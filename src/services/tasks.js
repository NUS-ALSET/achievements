import firebase from "firebase/app";

export const TASK_TYPES = {
  jupyter: {
    id: "jupyter",
    name: "Jupyter Notebook"
  },
  custom: {
    id: "custom",
    name: "Custom Task"
  },
  customNotebook: {
    id: "customNotebook",
    name: "Custom Notebook"
  }
};

const DEFAULT_JUPYTER_TASK = {
  nbformat: 4,
  nbformat_minor: 0,
  metadata: {},
  cells: [
    {
      cell_type: "code",
      metadata: {
        colab_type: "code",
        language_info: {
          name: "python"
        },
        achievements: {
          title: "Task",
          editable: true,
          type: "shown"
        }
      },
      source: [""]
    }
  ]
};

const DEFAULT_CUSTOM_TASK = {
  nbformat: 4,
  nbformat_minor: 0,
  metadata: {
    language_info: {
      name: "python"
    }
  },
  cells: [
    {
      cell_type: "code",
      language_info: {
        name: "python"
      },
      metadata: {
        colab_type: "code",
        achievements: {
          title: "Editable Code",
          language_info: {
            name: "python"
          },
          editable: true,
          type: "editable"
        }
      },
      source: []
    },
    {
      cell_type: "code",
      metadata: {
        colab_type: "code",
        achievements: {
          title: "Hidden Code",
          language_info: {
            name: "python"
          },
          type: "hidden"
        }
      },
      source: []
    },
    {
      cell_type: "code",
      metadata: {
        colab_type: "code",
        achievements: {
          title: "Shown Code/Text",
          language_info: {
            name: "python"
          },
          type: "shown"
        }
      },
      source: []
    }
  ]
};

const BASIC_PRESET = {
  blocksCount: 4,
  id: "basic",
  json: JSON.stringify({
    nbformat: 4,
    nbformat_minor: 0,
    metadata: {},
    cells: [
      { cell_type: "markdown", source: ["Hi\\n"] },
      { cell_type: "code", source: ["test", "f()"], outputs: [] },
      { cell_type: "markdown", source: ["Cool\\n"] },
      { cell_type: "code", source: ["assert(True)\\n"], outputs: [] }
    ]
  }),
  owner: "no-one"
};

export class TasksService {
  getTaskInfo(id, initialTask, changes, preset, response) {
    const type = changes.type || initialTask.type || preset.type || "custom";
    let json = changes.json;

    const result = {
      id,
      type,
      name: changes.name || initialTask.name || "",
      presetId: changes.presetId || initialTask.presetId || "basic"
    };

    if (initialTask.json) {
      json = json || initialTask.json;
    }
    if (preset && type === TASK_TYPES.jupyter.id) {
      json = json || JSON.parse(preset.json);
    }

    switch (type) {
      case TASK_TYPES.jupyter.id:
        json = json || DEFAULT_JUPYTER_TASK;
        break;
      case TASK_TYPES.custom.id:
        // Add required blocks for `custom` Task
        json = json || DEFAULT_CUSTOM_TASK;
        result.url = changes.url || initialTask.url || "";
        result.fallback = changes.fallback || initialTask.fallback || "ipynb";
        break;
      default:
    }

    if (!json.cells) {
      json = { ...json, cells: [] };
    }

    // Mutable code. Just validation, shouldn't affect anything
    json.metadata = json.metadata || {};
    json.metadata.language_info = json.metadata.language_info || {
      name: "python"
    };
    for (const cell of json.cells) {
      cell.metadata = cell.metadata || {};
      cell.metadata.achievements = cell.metadata.achievements || {};
      cell.metadata.achievements.language_info = cell.metadata.achievements
        .language_info || {
        name: "python"
      };
      cell.outputs = cell.outputs || [];
    }
    if (response && response.cells) {
      json.cells = json.cells.map((cell, index) =>
        response
          ? {
              ...cell,
              outputs:
                response.cells[index] &&
                response.cells[index].outputs &&
                response.cells[index].source.join("") === cell.source.join("")
                  ? [...response.cells[index].outputs]
                  : []
            }
          : cell
      );
    }

    return {
      ...result,
      json
    };
  }

  fetchPresets() {
    return firebase
      .database()
      .ref("/config/taskPresets")
      .once("value")
      .then(snap => snap.val() || {})
      .then(presets =>
        Promise.all(
          Object.keys({ ...presets, basic: presets.basic || BASIC_PRESET }).map(
            presetId =>
              firebase
                .database()
                .ref(`/tasks/${presetId}`)
                .once("value")
                .then(snap => ({ id: presetId, ...(snap.val() || {}) }))
          )
        )
      );
  }

  fetchTask(taskId) {
    return firebase
      .database()
      .ref(`/tasks/${taskId}`)
      .once("value")
      .then(snap => snap.val());
  }

  fetchTasks(uid) {
    return firebase
      .database()
      .ref("/tasks")
      .orderByChild("owner")
      .equalTo(uid)
      .once("value")
      .then(data => data.val() || {})
      .then(tasks => Object.keys(tasks).map(field => tasks[field]));
  }

  runJupyterTask(uid, taskInfo) {
    return new Promise((resolve, reject) => {
      const answerPath = "/jupyterSolutionsQueue/responses/";
      const answerKey = firebase
        .database()
        .ref(answerPath)
        .push().key;

      firebase
        .database()
        .ref(`${answerPath}${answerKey}`)
        .on("value", response => {
          if (response.val() === null) {
            return;
          }

          firebase
            .database()
            .ref(`${answerPath}${answerKey}`)
            .off();

          return firebase
            .database()
            .ref(`${answerPath}${answerKey}`)
            .remove()
            .then(() =>
              response.val()
                ? resolve(JSON.parse(response.val().solution))
                : reject(new Error("Failing - Unable execute your solution"))
            );
        });

      return firebase
        .database()
        .ref(`/jupyterSolutionsQueue/tasks/${answerKey}`)
        .set({
          owner: uid,
          taskKey: answerKey,
          solution: JSON.stringify(taskInfo.json),
          open: new Date().getTime()
        });
    });
  }

  runCustomTask(uid, taskInfo, solution) {
    if (uid) {
      return fetch(taskInfo.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...taskInfo.json,
          cells: taskInfo.json.cells.map(cell =>
            cell.metadata.achievements.type === "editable"
              ? {
                  ...cell,
                  source: [solution]
                }
              : cell
          )
        })
      }).then(response => response.json());
    }
  }

  runTask(uid, taskInfo, solution) {
    switch (taskInfo.type) {
      case TASK_TYPES.jupyter.id:
        return this.runJupyterTask(uid, taskInfo);
      case TASK_TYPES.custom.id:
        return this.runCustomTask(uid, taskInfo, solution);
      default:
        return Promise.resolve();
    }
  }

  validateTask(taskInfo) {
    let editableExists = false;
    switch (taskInfo.type) {
      case "jupyter":
        for (const cell of taskInfo.json.cells) {
          editableExists =
            editableExists || cell.metadata.achievements.editable;
        }
        if (!editableExists)
          throw new Error("Missing required `editable` field");
        break;
      default:
        return true;
    }
  }

  saveTask(uid, taskId, taskInfo) {
    this.validateTask(taskInfo);

    if (taskId === "new") {
      taskId = firebase
        .database()
        .ref("/tasks")
        .push().key;
    }
    const request = {
      ...taskInfo,
      id: taskId,
      owner: uid,
      updatedAt: {
        ".sv": "timestamp"
      }
    };

    return firebase
      .database()
      .ref(`/tasks/${taskId}`)
      .update(request)
      .then(() => taskId);
  }
}

export const tasksService = new TasksService();
