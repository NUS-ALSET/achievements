import * as Parser from "@babel/parser";

export function getJavaScriptSkills(sourceCode = "") {
  try {
    const output = Parser.parse(sourceCode, {
      // parse in strict mode and allow module declarations
      sourceType: "module",
      plugins: [
        "estree",
        "jsx",
        "flow",
        "doExpressions",
        "objectRestSpread",
        "classProperties",
        "exportExtensions",
        "asyncGenerators",
        "functionBind",
        "functionSent",
        "dynamicImport",
        "templateInvalidEscapes"
      ]
    });
    const result = collectExpression(output);
    return result;
  } catch (err) {
    return {};
  }
}

function collectExpression(obj, res = {}) {
  if (obj && typeof obj === "object") {
    Object.keys(obj).forEach(key => {
      if (key === "type" && typeof obj[key] === "string") {
        res[obj[key]] = true;
      } else {
        const newRes = collectExpression(obj[key], res);
        res = {
          ...res,
          ...newRes
        };
      }
    });
    return res;
  }
  return res;
}

export function getJSSkillsDifference(solutionFiles, problemFiles) {
  let solutionSkills = {};
  let problemSkills = {};
  solutionFiles.forEach(file => {
    const solutionFileSkills = getJavaScriptSkills(file.code);
    solutionSkills = {
      ...solutionSkills,
      ...solutionFileSkills
    };
    const problemFile = problemFiles.find(p => p.path === file.path);
    if (problemFile) {
      const problemFileSkills = getJavaScriptSkills(problemFile.code);

      problemSkills = {
        ...problemSkills,
        ...problemFileSkills
      };
    }
  });
  const differenceSkills = {};

  Object.keys(solutionSkills).forEach(skill => {
    if (!problemSkills[skill]) {
      differenceSkills[skill] = true;
    }
  });
  return differenceSkills;
}
