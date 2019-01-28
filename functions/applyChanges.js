const existing = require("./completedActivities");
const processed = require("./output");

let missing = 0;
let valid = 1;

for (const userKey of Object.keys(existing)) {
  const processedUser = processed[userKey];

  for (const pathKey of Object.keys(existing[userKey])) {
    const processedPath = processedUser && processedUser[pathKey];

    for (const activityKey of Object.keys(existing[userKey][pathKey])) {
      const processedActivity = processedPath && processedPath[activityKey];
      if (existing[userKey][pathKey][activityKey] === true) {
        if (!processedActivity) {
          missing += 1;
        } else {
          valid += 1;
        }
      }
    }
  }
}

console.log(missing, valid);
