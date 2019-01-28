/* eslint-disable no-console,no-magic-numbers */

const fs = require("fs");
const itemsCounter = {};

// pipeline.on("data", data => {
//   if (!data.value.type || data.value.type.startsWith("@")) {
//     return;
//   }
//   let streamInfo = itemsCounter[data.value.type];
//   if (!streamInfo) {
//     streamInfo = {
//       index: 0,
//       stream: fs.createWriteStream(`./data/${data.value.type}.json`)
//     };
//     itemsCounter[data.value.type] = streamInfo;
//     streamInfo.stream.write("[");
//   }
//   if (streamInfo.index) {
//     streamInfo.stream.write(",");
//   }
//   streamInfo.index++;
//   streamInfo.stream.write(JSON.stringify(data.value));
// });
//
// pipeline.on("end", () =>
//   Object.keys(itemsCounter).map(key => itemsCounter[key].stream.end())
// );
const Parser = require("stream-json/Parser");
const parser = new Parser();
const pipeline = fs.createReadStream("data.json").pipe(parser);

let ignore = true;
let objectCounter = 0;
const current = [];
let currentKey = "";

const last = array => array[array.length - 1];
let action;

pipeline.on("data", data => {
  if (data.name === "keyValue" && data.value === "logged_events") {
    ignore = false;
    return;
  }
  if (ignore) {
    return;
  }
  switch (data.name) {
    case "keyValue":
      currentKey = data.value;
      break;
    case "stringValue":
    case "numberValue":
    case "nullValue":
    case "trueValue":
    case "falseValue":
      last(current)[currentKey] = data.value;
      break;
    case "startObject":
      objectCounter++;
      if (currentKey) {
        if (last(current)) {
          last(current)[currentKey] = {};
          current.push(last(current)[currentKey]);
        } else {
          current.push({ id: currentKey });
        }
      }
      break;
    case "endObject":
      objectCounter--;
      action = current.pop();
      if (objectCounter === 1) {
        if (
          action.type !== "COURSE_MEMBER_ACHIEVEMENTS_REFETCH" &&
          !action.type.startsWith("@")
        ) {
          let streamInfo = itemsCounter[action.type];
          if (!streamInfo) {
            streamInfo = {
              index: 0,
              stream: fs.createWriteStream(`./data/${action.type}.json`)
            };
            itemsCounter[action.type] = streamInfo;
            streamInfo.stream.write("[");
          }
          if (streamInfo.index) {
            streamInfo.stream.write(",");
          }
          streamInfo.index++;
          streamInfo.stream.write(JSON.stringify(action));
        }
      }
      break;
    default:
  }
  if (!objectCounter) {
    ignore = true;
    return Promise.all(
      Object.keys(itemsCounter).map(
        key =>
          new Promise(resolve => {
            itemsCounter[key].stream.write("]", () =>
              itemsCounter[key].stream.end(resolve)
            );
          })
      )
    );
  }
});
