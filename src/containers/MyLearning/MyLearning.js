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
const removeDupeData = dataArray => {
  const aggregatedDataWithDupes = dataArray.reduce((accumulator, { date, value, ...duplicatedData }) => {
    const keyOfDupes = Object.keys(duplicatedData);
    keyOfDupes.forEach(dataPoint => accumulator.push(dataPoint));
    return accumulator;
  }, []);
  const removedDupes = new Set(aggregatedDataWithDupes);
  return Array.from(removedDupes);
};

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

  const handleTabChangeCreatorStats = (e, tabValue) => {
    props.handleTabChange(e, tabValue, "Creator stats");
    if (tabValue === "lastMonth") {
      props.getCreatedPaths(props.uid, lastMonthEpochTime);
      props.getCreatedActivities(props.uid, lastMonthEpochTime);
    }
    if (tabValue === "allTime") {
      props.getCreatedPaths(props.uid, 0);
      props.getCreatedActivities(props.uid, 0);
    }
  };
  return (
    <Accordion
      description={`you have created ${sumUpByValueField(
        activitiesCreatorData[props.tabValue]
      )} activities and ${sumUpByValueField(pathsCreatorData[props.tabValue])} paths ${mapTabValueToLabel(
        props.tabValue
      )}`}
      handleTabChange={handleTabChangeCreatorStats}
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

const SolversCreatedPaths = props => {
  const { solversCreatedActivities } = props.data;

  const solversDataToDates = convertDataToDates(solversCreatedActivities);

  const countSolversByDate = countDataByDate(solversDataToDates, "pathName");

  const data = {
    lastWeek: dataFormatting(countSolversByDate.lastWeek),
    lastMonth: dataFormatting(countSolversByDate.lastMonth),
    allTime: dataFormatting(countSolversByDate.allTime)
  };

  const pathsLastWeek = removeDupeData(data.lastWeek);
  const pathsLastMonth = removeDupeData(data.lastMonth);
  const pathsAllTime = removeDupeData(data.allTime);

  return (
    <Accordion
      description={`your activities have been solved by ${sumUpByValueField(
        data[props.tabValue]
      )} users ${mapTabValueToLabel(props.tabValue)}`}
      handleTabChange={props.handleTabChange}
      tabValue={props.tabValue}
      title={"Solvers of created activities"}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.lastWeek}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {pathsLastWeek.map(pathName => (
                <Bar dataKey={pathName} fill={randomHsl()} key={pathName} name={pathName} stackId={1} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.lastMonth}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {pathsLastMonth.map(pathName => (
                <Bar dataKey={pathName} fill={randomHsl()} key={pathName} name={pathName} stackId={1} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.allTime}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {pathsAllTime.map(pathName => (
                <Bar dataKey={pathName} fill={randomHsl()} key={pathName} name={pathName} stackId={1} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </TabAllTime>
      )}
    </Accordion>
  );
};

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
      handleTabChange={props.handleTabChange}
      tabValue={props.tabValue}
      title={"Self Exploration"}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.lastWeek}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={"activities completed"} name={"activities completed"} />
              <Bar dataKey={"pathsCompleted"} fill={randomHsl()} key={"paths explored"} name={"paths explored"} />
            </BarChart>
          </ResponsiveContainer>
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.lastMonth}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={"activities completed"} name={"activities completed"} />
              <Bar dataKey={"pathsCompleted"} fill={randomHsl()} key={"paths explored"} name={"paths explored"} />
            </BarChart>
          </ResponsiveContainer>
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.allTime}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={"activities completed"} name={"activities completed"} />
              <Bar dataKey={"pathsCompleted"} fill={randomHsl()} key={"paths explored"} name={"paths explored"} />
            </BarChart>
          </ResponsiveContainer>
        </TabAllTime>
      )}
    </Accordion>
  );
};

const DisplaySpecificPath = props => {
  const { activitiesExplored } = props.data;
  const { pathName, title, chartName } = props.componentDetails;

  const activitiesExploredDataToDates = convertDataToDates(activitiesExplored);

  const countActivitiesByDate = countDataByDate(activitiesExploredDataToDates, "pathName");

  const data = {
    lastWeek: countDetails(dataFormatting(countActivitiesByDate.lastWeek, pathName), "pathsCompleted"),
    lastMonth: countDetails(dataFormatting(countActivitiesByDate.lastMonth, pathName), "pathsCompleted"),
    allTime: countDetails(dataFormatting(countActivitiesByDate.allTime, pathName), "pathsCompleted")
  };

  return (
    <Accordion
      description={`you have explored ${sumUpByValueField(data[props.tabValue])} ${title} ${mapTabValueToLabel(
        props.tabValue
      )}`}
      handleTabChange={props.handleTabChange}
      tabValue={props.tabValue}
      title={title}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.lastWeek}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChart>
          </ResponsiveContainer>
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.lastMonth}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChart>
          </ResponsiveContainer>
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.allTime}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChart>
          </ResponsiveContainer>
        </TabAllTime>
      )}
    </Accordion>
  );
};

const DisplayGenericOneField = props => {
  const rawData = props.data;
  const { field, title, chartName } = props.componentDetails;

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
      handleTabChange={props.handleTabChange}
      tabValue={props.tabValue}
      title={title}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.lastWeek}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChart>
          </ResponsiveContainer>
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.lastMonth}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChart>
          </ResponsiveContainer>
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.allTime}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChart>
          </ResponsiveContainer>
        </TabAllTime>
      )}
    </Accordion>
  );
};

const DisplayGenericOneFieldSpecificItem = props => {
  const rawData = props.data;
  const { field, fieldItem, title, chartName } = props.componentDetails;

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
      handleTabChange={props.handleTabChange}
      tabValue={props.tabValue}
      title={title}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.lastWeek}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChart>
          </ResponsiveContainer>
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.lastMonth}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChart>
          </ResponsiveContainer>
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          <ResponsiveContainer height={500} width="95%">
            <BarChart data={data.allTime}>
              <XAxis dataKey="date" name="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChart>
          </ResponsiveContainer>
        </TabAllTime>
      )}
    </Accordion>
  );
};

const DisplayCompletedPaths = props => {
  const { activitiesExplored, pathInfo } = props.data;

  const uniqueActivitiesByPathDone = activitiesDoneArray => {
    const uniqueActivitySet = new Set([]);
    activitiesDoneArray.map(activity => uniqueActivitySet.add(activity.id));
    return uniqueActivitySet;
  };

  const uniqueActivities = uniqueActivitiesByPathDone(activitiesExplored);

  const checkIfPathCompleted = pathInfoArray => {
    const completedPaths = [];
    for (const path of pathInfoArray) {
      for (let i = 0; i < path.activityId.length; i++) {
        if (!uniqueActivities.has(path.activityId[i])) {
          continue;
        }
        if (i === path.activityId.length - 1) {
          completedPaths.push({ pathName: path.name });
        }
      }
    }
    return completedPaths;
  };

  const completedPaths = checkIfPathCompleted(pathInfo);

  return (
    <PlainAccordionNoTabs
      description={`you have completed ${completedPaths.length} paths in total`}
      title={"Completed Paths"}
    >
      <Typography component="div" style={{ padding: 8 * 3 }}>
        <p>You have completed the following paths:</p>
        <ul>
          {completedPaths.map(path => (
            <li key={path.pathName}>{path.pathName}</li>
          ))}
        </ul>
      </Typography>
    </PlainAccordionNoTabs>
  );
};

const DisplayVisitsMyLearning = props => {
  const { dateAccessed } = props.data;

  return (
    <PlainAccordionNoTabs
      description={`you visited the My Learning page ${dateAccessed.length} times to review your progress`}
      title={"Visits to MyLearning"}
    >
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {dateAccessed && (
          <div>
            <p>You have visited MyLearning on these occasions:</p>
            <ul>
              {dateAccessed.map(date => (
                <li key={date}>{moment(date).format("DD/MM/YY")}</li>
              ))}
            </ul>
          </div>
        )}
        {!dateAccessed && <p>Tip: MyLearning provides analytics tools on your progress within Achievements!</p>}
      </Typography>
    </PlainAccordionNoTabs>
  );
};

const DisplayRequestsAdditionalActivities = props => {
  const { paths } = props.data;

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
            <p>You have requested additional activities on the following paths:</p>
            <ul>
              {paths.map(pathInfo => (
                <li key={pathInfo.id}>{pathInfo.pathName}</li>
              ))}
            </ul>
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
          ? `you have clicked on ${recommendedActivityClicks.length} recommended activities on the home
          screen`
          : "you have yet to click on any recommended activities"
      }
      title={"Clicks on recommended activities"}
    >
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {recommendedActivityClicks && (
          <div>
            <p>You have clicked on the following recommended activities on the home screen:</p>
            <table style={{ borderSpacing: "1rem" }}>
              <thead>
                <tr style={{ fontWeight: 500 }}>
                  <td>Activity Name</td>
                  <td>Path Name</td>
                </tr>
              </thead>
              <tbody>
                {recommendedActivityClicks.map(activity => (
                  <tr key={activity.activityName}>
                    <td>{activity.activityName}</td>
                    <td>{activity.pathName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    activitiesExplored: [
      {
        id: 1,
        pathId: 888,
        activityName: "dungeon1",
        pathName: "CodeCombat",
        date: 1557894183000,
        attempts: 1,
        isComplete: true,
        otherTags: ""
      },
      {
        id: 2,
        pathId: 888,
        activityName: "dungeon12",
        pathName: "CodeCombat",
        date: 1557895183000,
        attempts: 1,
        isComplete: true,
        otherTags: ""
      },
      {
        id: 3,
        pathId: 131,
        activityName: "hello strings",
        pathName: "jupyterNotebook",
        date: 1557903283000,
        attempts: 2,
        isComplete: true,
        otherTags: ""
      },
      {
        id: 4,
        pathId: 128,
        activityName: "hello lists",
        pathName: "helloPython2",
        date: 1558003283000,
        attempts: 3,
        isComplete: true,
        otherTags: ""
      },
      {
        id: 5,
        pathId: 123,
        activityName: "hello functions",
        pathName: "helloPython2",
        date: 1558103283000,
        attempts: 1,
        isComplete: true,
        otherTags: ""
      },
      {
        id: 6,
        pathId: 123,
        activityName: "hello loops",
        pathName: "helloPython2",
        date: 1558203283000,
        attempts: 1,
        isComplete: true,
        otherTags: ""
      },
      {
        id: 7,
        pathId: 131,
        activityName: "what are expressions?",
        pathName: "jupyterNotebook",
        date: 1557474783000,
        attempts: 2,
        isComplete: true,
        otherTags: ""
      },
      {
        id: 8,
        pathId: 131,
        activityName: "Jupyter notebook intro",
        pathName: "jupyterNotebook",
        date: 1557574783000,
        isComplete: true,
        attempts: 3,
        otherTags: ""
      },
      {
        id: 9,
        pathId: 888,
        activityName: "Arena",
        pathName: "CodeCombat",
        date: 1557574783000,
        isComplete: true,
        attempts: 3,
        otherTags: "CodeCombat Multiplayer"
      }
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
    },
    codeCombatMultiplayerLevels: {
      lastWeek: ["King of the Hill"],
      lastMonth: ["King of the Hill", "Queen of the Desert"],
      allTime: ["King of the Hill", "Queen of the Desert", "Tesla Tesoro"]
    },
    codeCombatLevels: { lastWeek: 7, lastMonth: 10, allTime: 20 },
    jupyterNotebookActivities: { lastWeek: 11, lastMonth: 20, allTime: 48 },
    recommendedActivitiesClick: [
      {
        id: 2,
        pathId: 888,
        activityName: "dungeon12",
        pathName: "CodeCombat",
        dateClicked: 1557895183000,
        attempts: 1,
        isComplete: true,
        otherTags: ""
      },
      {
        id: 3,
        pathId: 131,
        activityName: "hello strings",
        pathName: "jupyterNotebook",
        dateClicked: 1557903283000,
        isComplete: true,
        otherTags: ""
      }
    ],
    visitsToMyLearning: { dateAccessed: [1557574783000] },
    requestsAdditionalActivities: {
      paths: [{ id: 888, pathName: "CodeCombat" }, { id: 131, pathName: "jupyterNotebook" }]
    },
    tabValue: "lastWeek",
    tabvalueSpecificPanels: {},
    newActivitiesExplored: {}
  };

  handleTabChange = (event, tabValue, title) => {
    this.setState({ tabvalueSpecificPanels: { ...this.state.tabvalueSpecificPanels, [title]: tabValue } });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.getMyLearning(this.props.id);
    }
  }

  db = firebase.firestore();

  getCreatedPaths = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = [];
    let query = this.db
      .collection("logged_events")
      .where("uid", "==", uid)
      .where("type", "==", "PATH_CHANGE_SUCCESS")
      .where("createdAt", ">", epochTime)
      .orderBy("createdAt", "desc");
    query
      .get()
      .then(querySnapshot =>
        querySnapshot.forEach(doc => {
          const dbData = doc.data();
          dataContainer[doc.id] = {};
          dataContainer[doc.id]["name"] = doc.id;
          dataContainer[doc.id]["id"] = doc.id;
          dataContainer[doc.id]["date"] = dbData.createdAt;
        })
      )
      .then(() =>
        this.setState({
          createdPaths: Object.values(dataContainer)
        })
      );
  };

  getCreatedActivities = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = [];
    let query = this.db
      .collection("logged_events")
      .where("uid", "==", uid)
      .where("type", "==", "PATH_ACTIVITY_CHANGE_SUCCESS")
      .where("createdAt", ">", epochTime)
      .orderBy("createdAt", "desc");
    query
      .get()
      .then(querySnapshot =>
        querySnapshot.forEach(doc => {
          const dbData = doc.data();
          dataContainer[doc.id] = {};
          dataContainer[doc.id]["id"] = doc.id;
          dataContainer[doc.id]["date"] = dbData.createdAt;
        })
      )
      .then(() =>
        this.setState({
          createdActivities: Object.values(dataContainer)
        })
      );
  };

  getActivitiesExplored = uid => {
    const dataContainer = {};
    let count = 0;
    let query = this.db
      .collection("logged_events")
      .where("uid", "==", uid)
      .where("type", "==", "PROBLEM_SOLUTION_ATTEMPT_REQUEST")
      .orderBy("createdAt", "desc");
    query
      .get()
      .then(querySnapshot =>
        querySnapshot.forEach(doc => {
          const dbData = doc.data();
          const json_dump = JSON.parse(dbData.otherActionData);
          if (
            "activityKey" in json_dump["payload"] &&
            (json_dump["payload"]["activityType"] === "codeCombat" ||
              json_dump["payload"]["activityType"] === "codeCombatMultiPlayerLevel")
          ) {
            dataContainer[count] = {};
            dataContainer[count]["id"] = doc.id;
            dataContainer[count]["date"] = dbData.createdAt;

            dataContainer[count]["activityName"] = json_dump["payload"]["activityKey"];
            count++;
          }
        })
      )
      .then(() => {
        this.setState({
          newActivitiesExplored: dataContainer
        });
      });
  };

  getMyLearning = uid => {
    this.getCreatedPaths(uid);
    this.getCreatedActivities(uid);
  };

  render() {
    return (
      <Fragment>
        {!this.props.id ? (
          <Fragment>
            Loading Learning Summary...
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
                <SolversCreatedPaths
                  data={{
                    solversCreatedActivities: this.state.solversCreatedActivities
                  }}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabValue}
                />
                <SelfExploration
                  data={{
                    activitiesExplored: this.state.activitiesExplored
                  }}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabValue}
                />
                <DisplaySpecificPath
                  componentDetails={{
                    pathName: "CodeCombat",
                    title: "CodeCombat activities",
                    chartName: "CodeCombat activities completed"
                  }}
                  data={{
                    activitiesExplored: this.state.activitiesExplored
                  }}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabValue}
                />
                <DisplaySpecificPath
                  componentDetails={{
                    pathName: "jupyterNotebook",
                    title: "Jupyter Notebook activities",
                    chartName: "Jupyter Notebook activities completed"
                  }}
                  data={{
                    activitiesExplored: this.state.activitiesExplored
                  }}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabValue}
                />
                <DisplayGenericOneField
                  componentDetails={{
                    field: "attempts",
                    title: "Activity attempts",
                    chartName: "Activity attempts"
                  }}
                  data={this.state.activitiesExplored}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabValue}
                />
                <DisplayGenericOneFieldSpecificItem
                  componentDetails={{
                    field: "otherTags",
                    fieldItem: "CodeCombat Multiplayer",
                    title: "CodeCombat Multiplayer activities",
                    chartName: "CodeCombat Multiplayer activities"
                  }}
                  data={this.state.activitiesExplored}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabValue}
                />
                <DisplayCompletedPaths
                  data={{
                    activitiesExplored: this.state.activitiesExplored,
                    pathInfo: this.state.pathInfo
                  }}
                />
                <DisplayVisitsMyLearning data={this.state.visitsToMyLearning} />
                <DisplayRequestsAdditionalActivities data={this.state.requestsAdditionalActivities} />
                <DisplayRecommendedActivitiesClick data={this.state.recommendedActivitiesClick} />
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
