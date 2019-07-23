import React, { Fragment } from "react";
import { connect } from "react-redux";
import * as firebase from "firebase";
import "firebase/firestore";
import moment from "moment";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const lastWeekEpochTime = moment()
  .subtract(7, "days")
  .valueOf();
const lastMonthEpochTime = moment()
  .subtract(28, "days")
  .valueOf();

const TabLastWeek = props => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
};

const TabLastMonth = props => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
};

const TabAllTime = props => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
};

const TabValueToLabel = {
  lastWeek: "last week",
  lastMonth: "last month",
  allTime: "all time"
};
const mapTabValueToLabel = tabValue => TabValueToLabel[tabValue];

const Accordion = props => {
  return (
    // defaultExpanded
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography style={{ width: "30%", fontWeight: 550, alignSelf: "center" }}>{props.title}</Typography>
        <Typography style={{ paddingRight: "0.25rem", alignSelf: "center" }}>{props.description}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ flexDirection: "column" }}>
        <Tabs
          centered
          indicatorColor="primary"
          onChange={props.handleTabChange}
          textColor="primary"
          value={props.tabValue}
        >
          <Tab label="Last week" value="lastWeek" />
          <Tab label="Last month" value="lastMonth" />
          <Tab label="All time" value="allTime" />
        </Tabs>
        {props.children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const PlainAccordionNoTabs = props => {
  return (
    // defaultExpanded
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography style={{ width: "30%", fontWeight: 550, alignSelf: "center" }}>{props.title}</Typography>
        <Typography style={{ paddingRight: "0.25rem", alignSelf: "center" }}>{props.description}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ flexDirection: "column" }}>{props.children}</ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const convertDataToDates = dataSource => {
  const convertedData = dataSource.map(dataItem => {
    const { date, ...otherStuff } = dataItem;
    return {
      createdAt: date,
      dateDDmmFormat: moment(date).format("DD/MM/YY"),
      details: otherStuff
    };
  });
  return convertedData;
};

// this function is the workhorse of the myLearning component.
// The data passed to it has date field{ pathId: 123, pathName: "helloWorld1", date: 1557894183000 }
// 1. It converts server timestamp to DD/MM/YY format
// 2. It counts how many times the timestamp occurs
// 3. It can also count how many times the optional parameter dataParam (eg. we can pass in pathName) occurs
const countDataByDate = (convertedDataWithDates, dataParam = "") =>
  convertedDataWithDates.reduce(
    (accumulator, dateObject) => {
      // destructure dateObject which comprises epoch timeStamp and date
      const { createdAt, dateDDmmFormat, details = "" } = dateObject;
      // destructure accumulator - the structure is declared as argument to reduce func
      const { lastWeek, lastMonth, allTime } = accumulator;
      if (createdAt >= lastWeekEpochTime) {
        if (dateDDmmFormat in lastWeek) {
          lastWeek[dateDDmmFormat]++;
          lastMonth[dateDDmmFormat]++;
          allTime[dateDDmmFormat]++;
        } else {
          lastWeek[dateDDmmFormat] = 1;
          lastMonth[dateDDmmFormat] = 1;
          allTime[dateDDmmFormat] = 1;
        }
        // Add dateDDmmFormat to details[dataParam] so that we can map each details[dataParam] to its date
        if (dataParam) {
          if (dateDDmmFormat + details[dataParam] in lastWeek) {
            lastWeek[dateDDmmFormat + details[dataParam]]++;
          } else {
            lastWeek[dateDDmmFormat + details[dataParam]] = 1;
          }
          if (dateDDmmFormat + details[dataParam] in lastMonth) {
            lastMonth[dateDDmmFormat + details[dataParam]]++;
          } else {
            lastMonth[dateDDmmFormat + details[dataParam]] = 1;
          }
          if (dateDDmmFormat + details[dataParam] in allTime) {
            allTime[dateDDmmFormat + details[dataParam]]++;
          } else {
            allTime[dateDDmmFormat + details[dataParam]] = 1;
          }
        }
      } else if (createdAt >= lastMonthEpochTime) {
        if (dateDDmmFormat in lastMonth) {
          lastMonth[dateDDmmFormat]++;
          allTime[dateDDmmFormat]++;
        } else {
          lastMonth[dateDDmmFormat] = 1;
          allTime[dateDDmmFormat] = 1;
        }
        if (dataParam) {
          if (dateDDmmFormat + details[dataParam] in lastMonth) {
            lastMonth[dateDDmmFormat + details[dataParam]]++;
          } else {
            lastMonth[dateDDmmFormat + details[dataParam]] = 1;
          }
          if (dateDDmmFormat + details[dataParam] in allTime) {
            allTime[dateDDmmFormat + details[dataParam]]++;
          } else {
            allTime[dateDDmmFormat + details[dataParam]] = 1;
          }
        }
      } else {
        if (dateDDmmFormat in allTime) {
          allTime[dateDDmmFormat]++;
        } else {
          allTime[dateDDmmFormat] = 1;
        }
        if (dataParam) {
          if (dateDDmmFormat + details[dataParam] in allTime) {
            allTime[dateDDmmFormat + details[dataParam]]++;
          } else {
            allTime[dateDDmmFormat + details[dataParam]] = 1;
          }
        }
      }
      return accumulator;
    },
    { lastWeek: {}, lastMonth: {}, allTime: {} }
  );

const countNumericDataByDate = (convertedDataWithDates, dataParam = "") =>
  convertedDataWithDates.reduce(
    (accumulator, dateObject) => {
      // destructure dateObject which comprises epoch timeStamp and date
      const { createdAt, dateDDmmFormat, details = "" } = dateObject;
      // destructure accumulator - the structure is declared as argument to reduce func
      const { lastWeek, lastMonth, allTime } = accumulator;
      if (createdAt >= lastWeekEpochTime) {
        if (dateDDmmFormat in lastWeek) {
          lastWeek[dateDDmmFormat]++;
          lastMonth[dateDDmmFormat]++;
          allTime[dateDDmmFormat]++;
        } else {
          lastWeek[dateDDmmFormat] = 1;
          lastMonth[dateDDmmFormat] = 1;
          allTime[dateDDmmFormat] = 1;
        }
        // Add dateDDmmFormat to details[dataParam] so that we can map each details[dataParam] to its date
        if (dataParam) {
          if (dateDDmmFormat + dataParam in lastWeek) {
            lastWeek[dateDDmmFormat + dataParam] = lastWeek[dateDDmmFormat + dataParam] + details[dataParam];
          } else {
            lastWeek[dateDDmmFormat + dataParam] = details[dataParam];
          }
          if (dateDDmmFormat + dataParam in lastMonth) {
            lastMonth[dateDDmmFormat + dataParam] = lastMonth[dateDDmmFormat + dataParam] + details[dataParam];
          } else {
            lastMonth[dateDDmmFormat + dataParam] = details[dataParam];
          }
          if (dateDDmmFormat + dataParam in allTime) {
            allTime[dateDDmmFormat + dataParam] = allTime[dateDDmmFormat + dataParam] + details[dataParam];
          } else {
            allTime[dateDDmmFormat + dataParam] = details[dataParam];
          }
        }
      } else if (createdAt >= lastMonthEpochTime) {
        if (dateDDmmFormat in lastMonth) {
          lastMonth[dateDDmmFormat]++;
          allTime[dateDDmmFormat]++;
        } else {
          lastMonth[dateDDmmFormat] = 1;
          allTime[dateDDmmFormat] = 1;
        }
        if (dataParam) {
          if (dateDDmmFormat + dataParam in lastMonth) {
            lastMonth[dateDDmmFormat + dataParam] = lastMonth[dateDDmmFormat + dataParam] + details[dataParam];
          } else {
            lastMonth[dateDDmmFormat + dataParam] = details[dataParam];
          }
          if (dateDDmmFormat + dataParam in allTime) {
            allTime[dateDDmmFormat + dataParam] = allTime[dateDDmmFormat + dataParam] + details[dataParam];
          } else {
            allTime[dateDDmmFormat + dataParam] = details[dataParam];
          }
        }
      } else {
        if (dateDDmmFormat in allTime) {
          allTime[dateDDmmFormat]++;
        } else {
          allTime[dateDDmmFormat] = 1;
        }
        if (dataParam) {
          if (dateDDmmFormat + dataParam in allTime) {
            allTime[dateDDmmFormat + dataParam] = allTime[dateDDmmFormat + dataParam] + details[dataParam];
          } else {
            allTime[dateDDmmFormat + dataParam] = details[dataParam];
          }
        }
      }
      return accumulator;
    },
    { lastWeek: {}, lastMonth: {}, allTime: {} }
  );
// data in time categories means lastWeek / lastMonth / allTime
// This function can filter on the optional parameter, eg pathName of "helloWorld1"
const dataFormatting = (dataInTimeCategories, filter = "") => {
  // the aim of reduce function below is to collapse the various data fields under the date
  // eg "15/10/12":2 and "15/10/12createdPath":2 to 15/10/12:{value:2, createdPath:2}
  const collatedDataInDate = Object.keys(dataInTimeCategories).reduce((accumulator, item) => {
    const otherValueMatcher = item.match(/(\d\d\/\d\d\/\d\d)(\w.*)/);
    if (otherValueMatcher) {
      if (otherValueMatcher[1] in accumulator) {
        accumulator[otherValueMatcher[1]][otherValueMatcher[2]] = dataInTimeCategories[item];
      } else {
        accumulator[otherValueMatcher[1]] = {};
        accumulator[otherValueMatcher[1]]["value"] = dataInTimeCategories[item];
      }
    } else {
      if (item in accumulator) {
        accumulator[item]["value"] = dataInTimeCategories[item];
      } else {
        accumulator[item] = {};
        accumulator[item]["value"] = dataInTimeCategories[item];
      }
    }
    return accumulator;
  }, {});
  let formattedData = Object.keys(collatedDataInDate).map(item => {
    return { date: item, ...collatedDataInDate[item] };
  });

  if (filter) {
    // allow only dataItems with filter as a field to pass through
    formattedData = formattedData
      .filter(dataItem => filter in dataItem)
      // only keep the date field and equate filter field value to value key
      .map(dataItem => {
        return { date: dataItem["date"], value: dataItem[filter] };
      });
  }
  formattedData.sort((a, b) =>
    moment(a.date, "DD/MM/YY") > moment(b.date, "DD/MM/YY")
      ? 1
      : moment(b.date, "DD/MM/YY") > moment(a.date, "DD/MM/YY")
      ? -1
      : 0
  );
  return formattedData;
};

// This function calculates the total to display to viewer in accordion text
const sumUpByValueField = (datasource, field = "value") =>
  datasource.reduce((accumulator, datasourceItem) => accumulator + datasourceItem[field], 0);

// reference: https://repl.it/repls/HarmoniousInfiniteInverse
const concatArray = (array1, array2, array1ValueName, array2ValueName) => {
  const array1Container = array1.reduce((acc, item) => {
    acc[item.date] = {};
    acc[item.date][array1ValueName] = item.value;
    return acc;
  }, {});
  array2.map(item => {
    if (item.date in array1Container) {
      array1Container[item.date][array2ValueName] = item.value;
    } else {
      array1Container[item.date] = {};
      array1Container[item.date][array2ValueName] = item.value;
    }
    return true;
  });

  const concatedArray = [];
  for (const data in array1Container) {
    if (array1Container.hasOwnProperty(data)) {
      // using for loop, the iterating variable (data in our case) contains the object key
      concatedArray.push({ date: data, ...array1Container[data] });
    }
  }

  // sort the concated array by date
  concatedArray.sort((a, b) =>
    moment(a.date, "DD/MM/YY") > moment(b.date, "DD/MM/YY")
      ? 1
      : moment(b.date, "DD/MM/YY") > moment(a.date, "DD/MM/YY")
      ? -1
      : 0
  );

  return concatedArray;
};

const randomHsl = () => "hsla(" + Math.random() * 360 + ", 50%, 50%, 0.5)";

// this function is designed to remove dupes for stacked barcharts categories
// eg. {lastweek:[{date:22/02/19, somePath:3}, {date:23/02/19, somePath:2}] contains 2 dupes of somePath}
// it returns ["somePath"]
// const removeDupeData = dataArray => {
//   const aggregatedDataWithDupes = dataArray.reduce((accumulator, { date, value, ...duplicatedData }) => {
//     const keyOfDupes = Object.keys(duplicatedData);
//     keyOfDupes.forEach(dataPoint => accumulator.push(dataPoint));
//     return accumulator;
//   }, []);
//   const removedDupes = new Set(aggregatedDataWithDupes);
//   return Array.from(removedDupes);
// };

// This function counts the number of times the additional detail parameter occurs
// Eg. we want to capture number of pathNames completed per date
// If we have {date:15/04/19, pathName1:"A",pathName2:"B", pathName3:"C" },
// this function returns {date:15/04/19, pathName1:"A",pathName2:"B", pathName3:"C", total:3 }
const countDetails = (dataArray, nameOfTotal = "total") => {
  const clonedDataArray = [...dataArray];
  clonedDataArray.map(dataItem => {
    const { date, value, ...duplicatedData } = dataItem;
    dataItem[nameOfTotal] = Object.keys(duplicatedData).length;
    return true;
  });
  return clonedDataArray;
};

const CreatorStats = props => {
  const { createdActivities, createdPaths } = props.data;
  const createdActivitiesToDates = convertDataToDates(createdActivities);
  const createdPathsToDates = convertDataToDates(createdPaths);

  const countActivitiesByDate = countDataByDate(createdActivitiesToDates);
  const countPathsByDate = countDataByDate(createdPathsToDates);

  const activitiesCreatorData = {
    lastWeek: dataFormatting(countActivitiesByDate.lastWeek),
    lastMonth: dataFormatting(countActivitiesByDate.lastMonth),
    allTime: dataFormatting(countActivitiesByDate.allTime)
  };
  const pathsCreatorData = {
    lastWeek: dataFormatting(countPathsByDate.lastWeek),
    lastMonth: dataFormatting(countPathsByDate.lastMonth),
    allTime: dataFormatting(countPathsByDate.allTime)
  };

  const data = {
    lastWeek: concatArray(
      activitiesCreatorData.lastWeek,
      pathsCreatorData.lastWeek,
      "activitiesCreated",
      "pathsCreated"
    ),
    lastMonth: concatArray(
      activitiesCreatorData.lastMonth,
      pathsCreatorData.lastMonth,
      "activitiesCreated",
      "pathsCreated"
    ),
    allTime: concatArray(activitiesCreatorData.allTime, pathsCreatorData.allTime, "activitiesCreated", "pathsCreated")
  };

  return (
    <Accordion
      description={`you have created ${sumUpByValueField(
        activitiesCreatorData[props.tabValue]
      )} activities and ${sumUpByValueField(pathsCreatorData[props.tabValue])} paths ${mapTabValueToLabel(
        props.tabValue
      )}`}
      handleTabChange={(e, tabValue) =>
        props.handleTabChange(
          e,
          tabValue,
          "Creator stats",
          props.uid,
          props.getCreatedPaths,
          props.getCreatedActivities
        )
      }
      tabValue={props.tabValue}
      title={"Creator stats"}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          {data.lastWeek.some(e => e.activitiesCreated || e.pathsCreated) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.lastWeek}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {data.lastWeek.some(e => e.activitiesCreated) && (
                  <Bar dataKey="activitiesCreated" fill="#8884d8" name="Activities created" />
                )}
                {data.lastWeek.some(e => e.pathsCreated) && (
                  <Bar dataKey="pathsCreated" fill="#82ca9d" name="Paths created" />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          {data.lastMonth.some(e => e.activitiesCreated || e.pathsCreated) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.lastMonth}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {data.lastMonth.some(e => e.activitiesCreated) && (
                  <Bar dataKey="activitiesCreated" fill="#8884d8" name="Activities created" />
                )}
                {data.lastMonth.some(e => e.pathsCreated) && (
                  <Bar dataKey="pathsCreated" fill="#82ca9d" name="Paths created" />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          {data.allTime.some(e => e.activitiesCreated || e.pathsCreated) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.allTime}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {data.allTime.some(e => e.activitiesCreated) && (
                  <Bar dataKey="activitiesCreated" fill="#8884d8" name="Activities created" />
                )}
                {data.allTime.some(e => e.pathsCreated) && (
                  <Bar dataKey="pathsCreated" fill="#82ca9d" name="Paths created" />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabAllTime>
      )}
    </Accordion>
  );
};

// const SolversCreatedPaths = props => {
//   const { solversCreatedActivities } = props.data;

//   const solversDataToDates = convertDataToDates(solversCreatedActivities);

//   const countSolversByDate = countDataByDate(solversDataToDates, "pathName");

//   const data = {
//     lastWeek: dataFormatting(countSolversByDate.lastWeek),
//     lastMonth: dataFormatting(countSolversByDate.lastMonth),
//     allTime: dataFormatting(countSolversByDate.allTime)
//   };

//   const pathsLastWeek = removeDupeData(data.lastWeek);
//   const pathsLastMonth = removeDupeData(data.lastMonth);
//   const pathsAllTime = removeDupeData(data.allTime);

//   return (
//     <PlainAccordionNoTabs description={"Coming soon"} title={"Solvers of created activities"}>
//       <Typography component="div" style={{ padding: 8 * 3 }}>
//         <p>This feature is coming soon.</p>
//       </Typography>
//     </PlainAccordionNoTabs>
//     <Accordion
//       description={`your activities have been solved by ${sumUpByValueField(
//         data[props.tabValue]
//       )} users ${mapTabValueToLabel(props.tabValue)}`}
//       handleTabChange={props.handleTabChange}
//       tabValue={props.tabValue}
//       title={"Solvers of created activities"}
//     >
//       {props.tabValue === "lastWeek" && (
//         <TabLastWeek>
//           <p>This feature is coming soon.</p>
//           <ResponsiveContainer height={500} width="95%">
//             <BarChart data={data.lastWeek}>
//               <XAxis dataKey="date" name="Date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {pathsLastWeek.map(pathName => (
//                 <Bar dataKey={pathName} fill={randomHsl()} key={pathName} name={pathName} stackId={1} />
//               ))}
//             </BarChart>
//           </ResponsiveContainer>
//         </TabLastWeek>
//       )}
//       {props.tabValue === "lastMonth" && (
//         <TabLastMonth>
//           <ResponsiveContainer height={500} width="95%">
//             <BarChart data={data.lastMonth}>
//               <XAxis dataKey="date" name="Date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {pathsLastMonth.map(pathName => (
//                 <Bar dataKey={pathName} fill={randomHsl()} key={pathName} name={pathName} stackId={1} />
//               ))}
//             </BarChart>
//           </ResponsiveContainer>
//         </TabLastMonth>
//       )}
//       {props.tabValue === "allTime" && (
//         <TabAllTime>
//           <ResponsiveContainer height={500} width="95%">
//             <BarChart data={data.allTime}>
//               <XAxis dataKey="date" name="Date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {pathsAllTime.map(pathName => (
//                 <Bar dataKey={pathName} fill={randomHsl()} key={pathName} name={pathName} stackId={1} />
//               ))}
//             </BarChart>
//           </ResponsiveContainer>
//         </TabAllTime>
//       )}
//     </Accordion>
//   );
// };

const SelfExploration = props => {
  const { activitiesExplored } = props.data;

  const activitiesExploredDataToDates = convertDataToDates(activitiesExplored);

  const countActivitiesByDate = countDataByDate(activitiesExploredDataToDates, "pathName");

  const data = {
    lastWeek: countDetails(dataFormatting(countActivitiesByDate.lastWeek), "pathsCompleted"),
    lastMonth: countDetails(dataFormatting(countActivitiesByDate.lastMonth), "pathsCompleted"),
    allTime: countDetails(dataFormatting(countActivitiesByDate.allTime), "pathsCompleted")
  };

  return (
    <Accordion
      description={`you have explored ${sumUpByValueField(data[props.tabValue])} activities ${mapTabValueToLabel(
        props.tabValue
      )}`}
      handleTabChange={(e, tabValue) =>
        props.handleTabChange(e, tabValue, "SelfExploration", props.uid, props.getActivitiesExplored)
      }
      tabValue={props.tabValue}
      title={"Self Exploration"}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          {data.lastWeek.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.lastWeek}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={"activities explored"} name={"activities completed"} />
                {/* <Bar dataKey={"pathsCompleted"} fill={randomHsl()} key={"paths explored"} name={"paths explored"} /> */}
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          {data.lastMonth.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.lastMonth}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={"activities completed"} name={"activities completed"} />
                {/* <Bar dataKey={"pathsCompleted"} fill={randomHsl()} key={"paths explored"} name={"paths explored"} /> */}
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          {data.allTime.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.allTime}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={"activities completed"} name={"activities completed"} />
                {/* <Bar dataKey={"pathsCompleted"} fill={randomHsl()} key={"paths explored"} name={"paths explored"} /> */}
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabAllTime>
      )}
    </Accordion>
  );
};

// const DisplaySpecificPath = props => {
//   const { activitiesExplored } = props.data;
//   const { pathName, title, chartName } = props.componentDetails;

//   const activitiesExploredDataToDates = convertDataToDates(activitiesExplored);

//   const countActivitiesByDate = countDataByDate(activitiesExploredDataToDates, "pathName");

//   const data = {
//     lastWeek: countDetails(dataFormatting(countActivitiesByDate.lastWeek, pathName), "pathsCompleted"),
//     lastMonth: countDetails(dataFormatting(countActivitiesByDate.lastMonth, pathName), "pathsCompleted"),
//     allTime: countDetails(dataFormatting(countActivitiesByDate.allTime, pathName), "pathsCompleted")
//   };

//   return (
//     <Accordion
//       description={`you have explored ${sumUpByValueField(data[props.tabValue])} ${title} ${mapTabValueToLabel(
//         props.tabValue
//       )}`}
//       handleTabChange={props.handleTabChange}
//       tabValue={props.tabValue}
//       title={title}
//     >
//       {props.tabValue === "lastWeek" && (
//         <TabLastWeek>
//           {data.lastWeek.some(e => e.date) && (
//             <ResponsiveContainer height={500} width="95%">
//               <BarChart data={data.lastWeek}>
//                 <XAxis dataKey="date" name="Date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </TabLastWeek>
//       )}
//       {props.tabValue === "lastMonth" && (
//         <TabLastMonth>
//           {data.lastMonth.some(e => e.date) && (
//             <ResponsiveContainer height={500} width="95%">
//               <BarChart data={data.lastMonth}>
//                 <XAxis dataKey="date" name="Date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </TabLastMonth>
//       )}
//       {props.tabValue === "allTime" && (
//         <TabAllTime>
//           {data.allTime.some(e => e.date) && (
//             <ResponsiveContainer height={500} width="95%">
//               <BarChart data={data.allTime}>
//                 <XAxis dataKey="date" name="Date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </TabAllTime>
//       )}
//     </Accordion>
//   );
// };

const DisplayGenericOneField = props => {
  const rawData = props.data;
  const { field, title, chartName, getterFunction1, getterFunction2 = "" } = props.componentDetails;

  const dataToDates = convertDataToDates(rawData);
  const countDataPointsByDate = countNumericDataByDate(dataToDates, field);

  const data = {
    lastWeek: dataFormatting(countDataPointsByDate.lastWeek, field),
    lastMonth: dataFormatting(countDataPointsByDate.lastMonth, field),
    allTime: dataFormatting(countDataPointsByDate.allTime, field)
  };

  return (
    <Accordion
      description={`you have had ${sumUpByValueField(data[props.tabValue])} ${title} ${mapTabValueToLabel(
        props.tabValue
      )}`}
      handleTabChange={(e, tabValue) =>
        props.handleTabChange(e, tabValue, title, props.uid, getterFunction1, getterFunction2)
      }
      tabValue={props.tabValue}
      title={title}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          {data.lastWeek.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.lastWeek}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          {data.lastMonth.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.lastMonth}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          {data.allTime.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.allTime}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabAllTime>
      )}
    </Accordion>
  );
};

const DisplayGenericOneFieldSpecificItem = props => {
  const rawData = props.data;
  const { field, fieldItem, title, chartName, getterFunction1, getterFunction2 = "" } = props.componentDetails;

  const dataToDates = convertDataToDates(rawData);
  const countDataPointsByDate = countDataByDate(dataToDates, field);

  const data = {
    lastWeek: dataFormatting(countDataPointsByDate.lastWeek, fieldItem),
    lastMonth: dataFormatting(countDataPointsByDate.lastMonth, fieldItem),
    allTime: dataFormatting(countDataPointsByDate.allTime, fieldItem)
  };

  return (
    <Accordion
      description={`you have had ${sumUpByValueField(data[props.tabValue])} ${title} ${mapTabValueToLabel(
        props.tabValue
      )}`}
      handleTabChange={(e, tabValue) =>
        props.handleTabChange(e, tabValue, title, props.uid, getterFunction1, getterFunction2)
      }
      tabValue={props.tabValue}
      title={title}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          {data.lastWeek.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.lastWeek}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          {data.lastMonth.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.lastMonth}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          {data.allTime.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.allTime}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabAllTime>
      )}
    </Accordion>
  );
};

// const DisplayCompletedPaths = props => {
//   const { activitiesExplored, pathInfo } = props.data;

//   const uniqueActivitiesByPathDone = activitiesDoneArray => {
//     const uniqueActivitySet = new Set([]);
//     activitiesDoneArray.map(activity => uniqueActivitySet.add(activity.id));
//     return uniqueActivitySet;
//   };

//   const uniqueActivities = uniqueActivitiesByPathDone(activitiesExplored);

//   const checkIfPathCompleted = pathInfoArray => {
//     const completedPaths = [];
//     for (const path of pathInfoArray) {
//       for (let i = 0; i < path.activityId.length; i++) {
//         if (!uniqueActivities.has(path.activityId[i])) {
//           continue;
//         }
//         if (i === path.activityId.length - 1) {
//           completedPaths.push({ pathName: path.name });
//         }
//       }
//     }
//     return completedPaths;
//   };

//   const completedPaths = checkIfPathCompleted(pathInfo);

//   return (
//     <PlainAccordionNoTabs
//       description={"Coming soon"} //`you have completed ${completedPaths.length} paths in total`}
//       title={"Completed Paths"}
//     >
//       <Typography component="div" style={{ padding: 8 * 3 }}>
//         <p>This feature is coming soon.</p>
//         <p>You have completed the following paths:</p>
//         <ul>
//           {completedPaths.map(path => (
//             <li key={path.pathName}>{path.pathName}</li>
//           ))}
//         </ul>
//       </Typography>
//     </PlainAccordionNoTabs>
//   );
// };

const DisplayVisitsMyLearning = props => {
  const { visitsToMyLearning } = props.data;
  const visitsToMyLearningToDates = convertDataToDates(visitsToMyLearning);

  const countVisitsByDate = countDataByDate(visitsToMyLearningToDates);

  const data = {
    lastWeek: dataFormatting(countVisitsByDate.lastWeek),
    lastMonth: dataFormatting(countVisitsByDate.lastMonth),
    allTime: dataFormatting(countVisitsByDate.allTime)
  };
  return (
    <Accordion
      description={`you have reviewed myLearning ${sumUpByValueField(data[props.tabValue])} times ${mapTabValueToLabel(
        props.tabValue
      )}`}
      handleTabChange={(e, tabValue) =>
        props.handleTabChange(e, tabValue, "VisitsMyLearning", props.uid, props.getVisitsMyLearning)
      }
      tabValue={props.tabValue}
      title={"Visits to MyLearning"}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          {data.lastWeek.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.lastWeek}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={"visits to myLearning"} name={"visits to myLearning"} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          {data.lastMonth.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.lastMonth}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={"visits to myLearning"} name={"visits to myLearning"} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          {data.allTime.some(e => e.date) && (
            <ResponsiveContainer height={500} width="95%">
              <BarChart data={data.allTime}>
                <XAxis dataKey="date" name="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={"value"} fill={randomHsl()} key={"visits to myLearning"} name={"visits to myLearning"} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabAllTime>
      )}
    </Accordion>
  );
};

const DisplayRequestsAdditionalActivities = props => {
  const paths = props.data;

  return (
    <PlainAccordionNoTabs
      description={
        paths
          ? `you have requested additional activities on ${paths.length} paths`
          : "you have yet to request additional activities on any paths"
      }
      title={"Requests for additional activities"}
    >
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {paths && (
          <div>
            <p>{`You have requested additional activities on ${paths.length} paths`}</p>
          </div>
        )}
        {!paths && <p>Tip: You can make requests for path creators to add more activities within Achievements !</p>}
      </Typography>
    </PlainAccordionNoTabs>
  );
};

const DisplayRecommendedActivitiesClick = props => {
  const recommendedActivityClicks = props.data;

  return (
    <PlainAccordionNoTabs
      description={
        recommendedActivityClicks
          ? `you have opened ${recommendedActivityClicks.length} recommended activities`
          : "you have yet to click on any recommended activities"
      }
      title={"Clicks on recommended activities"}
    >
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {recommendedActivityClicks && (
          <div>
            <p>{`You have opened ${recommendedActivityClicks.length} recommended activities so far`}</p>
          </div>
        )}
        {!recommendedActivityClicks && (
          <p>Tip: You can browse the recommended activities in the homescreen to discover new activities to try!</p>
        )}
      </Typography>
    </PlainAccordionNoTabs>
  );
};

class MyLearning extends React.Component {
  state = {
    createdPaths: [],
    createdActivities: [],
    activitiesExplored: [],
    requestsAdditionalActivities: [],
    tabValue: "lastWeek",
    tabvalueSpecificPanels: {},
    visitsToMyLearning: [],
    recommendedActivitiesClick: [],
    // these below are not used
    solversCreatedActivities: [
      { pathId: 123, pathName: "helloWorld1", date: 1557894183000 },
      { pathId: 123, pathName: "helloWorld1", date: 1557895183000 },
      { pathId: 128, pathName: "helloPython2", date: 1557903283000 },
      { pathId: 128, pathName: "helloPython2", date: 1558003283000 },
      { pathId: 123, pathName: "helloPython2", date: 1558103283000 },
      { pathId: 123, pathName: "helloPython2", date: 1558203283000 },
      { pathId: 126, pathName: "helloPython1", date: 1557474783000 },
      { pathId: 130, pathName: "helloPython3", date: 1557574783000 }
    ],
    pathInfo: [
      { name: "CodeCombat", id: 888, activityId: [1, 2, 9] },
      { name: "jupyterNotebook", id: 131, activityId: [3, 7, 8] },
      { name: "Python", id: 222, activityId: [12, 22, 28] }
    ],
    publicCloudServices: {
      lastWeek: ["AWS S3", "AWS Lambda"],
      lastMonth: ["AWS S3", "AWS Lambda", "Azure Functions"],
      allTime: ["AWS S3", "AWS Lambda", "Azure Functions", "Azure Storage", "Firebase Functions", "Google Functions"]
    }
  };

  handleTabChange = (event, tabValue, title, uid, getterFunction1, getterFunction2 = "") => {
    this.setState({ tabvalueSpecificPanels: { ...this.state.tabvalueSpecificPanels, [title]: tabValue } });
    this.getLastMonthAllTimeData(tabValue, uid, getterFunction1, getterFunction2);
    this.db.collection("/logged_events").add({
      createdAt: Date.now(),
      type: "FIREBASE_TRIGGERS",
      uid: uid,
      sGen: true,
      otherActionData: { tabValue: tabValue, title: title }
    });
  };

  getLastMonthAllTimeData = (tabValue, uid, getterFunction1, getterFunction2) => {
    if (tabValue === "lastMonth") {
      getterFunction1(uid, lastMonthEpochTime);
      if (getterFunction2) {
        getterFunction2(uid, lastMonthEpochTime);
      }
    }
    if (tabValue === "allTime") {
      getterFunction1(uid, 0);
      if (getterFunction2) {
        getterFunction2(uid, 0);
      }
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.getMyLearning(this.props.id);
    }
  }
  componentDidMount() {
    if (this.props.id) {
      this.getMyLearning(this.props.id);
    }
  }

  db = firebase.firestore();

  queryActionType = (actionType, uid, epochTime) =>
    this.db
      .collection("logged_events")
      .where("uid", "==", uid)
      .where("type", "==", actionType)
      .where("createdAt", ">", epochTime)
      .orderBy("createdAt", "desc");

  queryActionTypeOtherActionData = (actionType, paramName, uid, epochTime) =>
    this.db
      .collection("logged_events")
      .where("uid", "==", uid)
      .where("type", "==", actionType)
      .where(`otherActionData`, "==", paramName)
      .where("createdAt", ">", epochTime)
      .orderBy("createdAt", "desc");

  processQuerySnapshot = (query, dataContainer) =>
    query.get().then(querySnapshot =>
      querySnapshot.forEach(doc => {
        const dbData = doc.data();
        dataContainer[doc.id] = {};
        dataContainer[doc.id]["name"] = doc.id;
        dataContainer[doc.id]["id"] = doc.id;
        dataContainer[doc.id]["date"] = dbData.createdAt;
      })
    );
  getCreatedPaths = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = [];
    let query = this.queryActionType("PATH_CHANGE_SUCCESS", uid, epochTime);
    this.processQuerySnapshot(query, dataContainer).then(() =>
      this.setState({
        createdPaths: Object.values(dataContainer)
      })
    );
  };

  getCreatedActivities = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = [];
    let query = this.queryActionType("PATH_ACTIVITY_CHANGE_SUCCESS", uid, epochTime);
    this.processQuerySnapshot(query, dataContainer).then(() =>
      this.setState({
        createdActivities: Object.values(dataContainer)
      })
    );
  };

  // notes: actionType "PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS" doesn't contain codecombat activities whereas "PROBLEM_SOLUTION_ATTEMPT_REQUEST" does
  // actionType "PROBLEM_FINALIZE" doesn't have any otheractiondata or any indicator to the activity "finalized"
  // actionType "PROBLEM_SOLUTION_PROVIDED_SUCCESS" only works on notebooks

  getActivitiesExplored = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = {};
    let query = this.db
      .collection("logged_events")
      .where("uid", "==", uid)
      .where("type", "==", "PROBLEM_SOLUTION_ATTEMPT_REQUEST")
      .where("createdAt", ">", epochTime)
      .orderBy("createdAt", "desc");
    query
      .get()
      .then(querySnapshot =>
        querySnapshot.forEach(doc => {
          const parsedData = doc.data();
          parsedData["otherActionData"] = JSON.parse(parsedData["otherActionData"]);
          if ("activityKey" in parsedData["otherActionData"]["payload"]) {
            const {
              createdAt,
              otherActionData: {
                payload: { activityKey, pathKey, activityType }
              }
            } = parsedData;
            if (dataContainer[activityKey]) {
              dataContainer[activityKey]["attempts"]++;
            } else {
              dataContainer[activityKey] = {};
              dataContainer[activityKey]["id"] = activityKey;
              dataContainer[activityKey]["date"] = createdAt;
              dataContainer[activityKey]["pathId"] = pathKey;
              dataContainer[activityKey]["attempts"] = 1;
              if (activityType) {
                dataContainer[activityKey]["otherTags"] = [];
                dataContainer[activityKey]["otherTags"].push(activityType);
              }
            }
          }
        })
      )
      .then(() => {
        this.setState({
          activitiesExplored: Object.values(dataContainer)
        });
      });
  };

  getRequestMoreProblems = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = [];
    let query = this.queryActionType("PATH_MORE_PROBLEMS_SUCCESS", uid, epochTime);
    this.processQuerySnapshot(query, dataContainer).then(() =>
      this.setState({
        requestsAdditionalActivities: Object.values(dataContainer)
      })
    );
  };

  getVisitsMyLearning = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = [];
    let query = this.queryActionTypeOtherActionData("ROUTES_CHANGED", `{"pathName":"/mylearning"}`, uid, epochTime);
    this.processQuerySnapshot(query, dataContainer).then(() =>
      this.setState({
        visitsToMyLearning: Object.values(dataContainer)
      })
    );
  };

  getClickRecommendedActivity = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = [];
    let query = this.queryActionType("HOME_OPEN_RECOMMENDATION", uid, epochTime);
    this.processQuerySnapshot(query, dataContainer).then(() =>
      this.setState({
        recommendedActivitiesClick: Object.values(dataContainer)
      })
    );
  };

  getMyLearning = uid => {
    this.getCreatedPaths(uid);
    this.getCreatedActivities(uid);
    this.getActivitiesExplored(uid);
    this.getRequestMoreProblems(uid, 0);
    this.getVisitsMyLearning(uid);
    this.getClickRecommendedActivity(uid, 0);
  };

  render() {
    return (
      <Fragment>
        {!this.props.id ? (
          <Fragment>
            If you have already logged in, please wait...
            <br />
            <br />
            Loading Learning Summary
            <LinearProgress />
          </Fragment>
        ) : (
          <Fragment>
            <Typography variant="h5">My Learning Summary </Typography>
            <br />
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <CreatorStats
                  data={{
                    createdActivities: this.state.createdActivities,
                    createdPaths: this.state.createdPaths
                  }}
                  getCreatedActivities={this.getCreatedActivities}
                  getCreatedPaths={this.getCreatedPaths}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabvalueSpecificPanels["Creator stats"] || this.state.tabValue}
                  uid={this.props.id}
                />
                <SelfExploration
                  data={{
                    activitiesExplored: this.state.activitiesExplored
                  }}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabvalueSpecificPanels["SelfExploration"] || this.state.tabValue}
                  getActivitiesExplored={this.getActivitiesExplored}
                  uid={this.props.id}
                />
                <DisplayGenericOneFieldSpecificItem
                  componentDetails={{
                    field: "otherTags",
                    fieldItem: "codeCombat",
                    title: "CodeCombat activities",
                    chartName: "CodeCombat activities completed",
                    getterFunction1: this.getActivitiesExplored
                  }}
                  data={this.state.activitiesExplored}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabvalueSpecificPanels["CodeCombat activities"] || this.state.tabValue}
                  uid={this.props.id}
                />
                <DisplayGenericOneFieldSpecificItem
                  componentDetails={{
                    field: "otherTags",
                    fieldItem: "jupyterInline",
                    title: "Jupyter Notebook activities",
                    chartName: "Jupyter Notebook activities completed",
                    getterFunction1: this.getActivitiesExplored
                  }}
                  data={this.state.activitiesExplored}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabvalueSpecificPanels["Jupyter Notebook activities"] || this.state.tabValue}
                  uid={this.props.id}
                />
                <DisplayGenericOneField
                  componentDetails={{
                    field: "attempts",
                    title: "Activity attempts",
                    chartName: "Activity attempts",
                    getterFunction1: this.getActivitiesExplored
                  }}
                  data={this.state.activitiesExplored}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabvalueSpecificPanels["Activity attempts"] || this.state.tabValue}
                  uid={this.props.id}
                />
                <DisplayGenericOneFieldSpecificItem
                  componentDetails={{
                    field: "otherTags",
                    fieldItem: "codeCombatMultiPlayerLevel",
                    title: "CodeCombat Multiplayer activities",
                    chartName: "CodeCombat Multiplayer activities",
                    getterFunction1: this.getActivitiesExplored
                  }}
                  data={this.state.activitiesExplored}
                  handleTabChange={this.handleTabChange}
                  tabValue={
                    this.state.tabvalueSpecificPanels["CodeCombat Multiplayer activities"] || this.state.tabValue
                  }
                  uid={this.props.id}
                />
                <DisplayRequestsAdditionalActivities data={this.state.requestsAdditionalActivities} />
                <DisplayVisitsMyLearning
                  data={{
                    visitsToMyLearning: this.state.visitsToMyLearning
                  }}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabvalueSpecificPanels["VisitsMyLearning"] || this.state.tabValue}
                  getVisitsMyLearning={this.getVisitsMyLearning}
                  uid={this.props.id}
                />
                <DisplayRecommendedActivitiesClick data={this.state.recommendedActivitiesClick} />
                {/* <SolversCreatedPaths
                  data={{
                    solversCreatedActivities: this.state.solversCreatedActivities
                  }}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabValue}
                /> */}
                {/* <DisplayCompletedPaths
                  data={{
                    activitiesExplored: this.state.activitiesExplored,
                    pathInfo: this.state.pathInfo
                  }}
                /> */}
              </Grid>
            </Grid>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  id: state.firebase.auth.uid
});
export default connect(mapStateToProps)(MyLearning);
