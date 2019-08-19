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

import EqualizerIcon from "@material-ui/icons/Equalizer";
import ViewListIcon from "@material-ui/icons/ViewList";
import IconButton from "@material-ui/core/IconButton";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import isEmpty from "lodash/isEmpty";

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

const BarChartBoilerPlate = props => {
  return (
    <ResponsiveContainer height={500} width="95%">
      <BarChart data={props.data[props.tabValue]}>
        <XAxis dataKey="date" name="Date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {props.children}
      </BarChart>
    </ResponsiveContainer>
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
    const otherValueMatcher = item.match(/(\d\d\/\d\d\/\d\d)(\S.*)/);
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
            <BarChartBoilerPlate data={data} tabValue={"lastWeek"}>
              {data.lastWeek.some(e => e.activitiesCreated) && (
                <Bar dataKey="activitiesCreated" fill="#8884d8" name="Activities created" />
              )}
              {data.lastWeek.some(e => e.pathsCreated) && (
                <Bar dataKey="pathsCreated" fill="#82ca9d" name="Paths created" />
              )}
            </BarChartBoilerPlate>
          )}
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          {data.lastMonth.some(e => e.activitiesCreated || e.pathsCreated) && (
            <BarChartBoilerPlate data={data} tabValue={"lastMonth"}>
              {data.lastMonth.some(e => e.activitiesCreated) && (
                <Bar dataKey="activitiesCreated" fill="#8884d8" name="Activities created" />
              )}
              {data.lastMonth.some(e => e.pathsCreated) && (
                <Bar dataKey="pathsCreated" fill="#82ca9d" name="Paths created" />
              )}
            </BarChartBoilerPlate>
          )}
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          {data.allTime.some(e => e.activitiesCreated || e.pathsCreated) && (
            <BarChartBoilerPlate data={data} tabValue={"allTime"}>
              {data.allTime.some(e => e.activitiesCreated) && (
                <Bar dataKey="activitiesCreated" fill="#8884d8" name="Activities created" />
              )}
              {data.allTime.some(e => e.pathsCreated) && (
                <Bar dataKey="pathsCreated" fill="#82ca9d" name="Paths created" />
              )}
            </BarChartBoilerPlate>
          )}
        </TabAllTime>
      )}
    </Accordion>
  );
};

const SolversCreatedPaths = props => {
  const solversCreatedActivities = props.data;

  const solversDataToDates = convertDataToDates(solversCreatedActivities);

  const countSolversByDate = countDataByDate(solversDataToDates, "path");

  const data = {
    lastWeek: dataFormatting(countSolversByDate.lastWeek),
    lastMonth: dataFormatting(countSolversByDate.lastMonth),
    allTime: dataFormatting(countSolversByDate.allTime)
  };

  // removeDupeData just returns an array of paths in this case
  const pathsLastWeek = removeDupeData(data.lastWeek);
  const pathsLastMonth = removeDupeData(data.lastMonth);
  const pathsAllTime = removeDupeData(data.allTime);

  const currentView = props.selectedTabView["SolversCreatedPaths"];

  const graphData = function() {
    switch (props.tabValue) {
      case "lastMonth":
        return (
          <TabLastMonth>
            {data.lastMonth.some(e => e.date) && (
              <BarChartBoilerPlate data={data} tabValue={"lastMonth"}>
                {pathsLastMonth.map(pathName => (
                  <Bar dataKey={pathName} fill={randomHsl()} key={pathName} name={pathName} stackId={1} />
                ))}
              </BarChartBoilerPlate>
            )}
          </TabLastMonth>
        );
      case "allTime":
        return (
          <TabAllTime>
            {data.allTime.some(e => e.date) && (
              <BarChartBoilerPlate data={data} tabValue={"allTime"}>
                {pathsAllTime.map(pathName => (
                  <Bar dataKey={pathName} fill={randomHsl()} key={pathName} name={pathName} stackId={1} />
                ))}
              </BarChartBoilerPlate>
            )}
          </TabAllTime>
        );
      default:
        return (
          <TabLastWeek>
            {data.lastWeek.some(e => e.date) && (
              <BarChartBoilerPlate data={data} tabValue={"lastWeek"}>
                {pathsLastWeek.map(pathName => (
                  <Bar dataKey={pathName} fill={randomHsl()} key={pathName} name={pathName} stackId={1} />
                ))}
              </BarChartBoilerPlate>
            )}
          </TabLastWeek>
        );
    }
  };

  const filteredDataPathActivityType = (() => {
    let filteredData = props.data.filter(
      dataItem => dataItem.path === props.selectedFilters["SolversCreatedPaths"].path
    );

    if (props.selectedFilters["SolversCreatedPaths"].activityType !== "all") {
      filteredData = filteredData.filter(
        dataItem => dataItem.type === props.selectedFilters["SolversCreatedPaths"].activityType
      );
    }
    return isEmpty(filteredData)
      ? {
          "Either no activity or no solvers yet": {
            totalCount: 0,
            activities: { "Either no activity or no solvers yet": 0 }
          }
        }
      : filteredData.reduce((accumulator, item) => {
          if (accumulator[item.type]) {
            accumulator[item.type]["totalCount"]++;
          } else {
            accumulator[item.type] = {};
            accumulator[item.type]["totalCount"] = 1;
            accumulator[item.type]["activities"] = {};
          }
          if (accumulator[item.type]["activities"][item.name]) {
            accumulator[item.type]["activities"][item.name]++;
          } else {
            accumulator[item.type]["activities"][item.name] = {};
            accumulator[item.type]["activities"][item.name] = 1;
          }
          return accumulator;
        }, {});
  })();

  const tableData = function() {
    return (
      <div>
        <Typography component="div">
          <section style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr" }}>
              <p>Select a Path:</p>
              <Select
                value={props.selectedFilters["SolversCreatedPaths"].path}
                onChange={e => props.handleChangeFilter(e.target.value, "SolversCreatedPaths", "path")}
              >
                <MenuItem selected disabled value="none">
                  <em>None</em>
                </MenuItem>
                {/* to get the unique values in dropdown box, filter out unique values then map to MenuItems */}
                {[...new Set(props.data.map(item => item.path))].map(pathName => (
                  <MenuItem value={pathName} key={pathName}>
                    {pathName}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr" }}>
              <p>Select Activity Type:</p>
              <Select
                value={props.selectedFilters["SolversCreatedPaths"].activityType}
                onChange={e => props.handleChangeFilter(e.target.value, "SolversCreatedPaths", "activityType")}
              >
                <MenuItem value={"all"} key={"all"}>
                  all
                </MenuItem>
                {/* to get the unique values in dropdown box, filter out unique values then map to MenuItems */}
                {[...new Set(props.data.map(item => item.type))].map(activityTypeName => (
                  <MenuItem value={activityTypeName} key={activityTypeName}>
                    {activityTypeName}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </section>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activity Type</TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(filteredDataPathActivityType).map(activityType => (
                <TableRow key={activityType}>
                  <TableCell component="th" scope="row">
                    {activityType}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {filteredDataPathActivityType[activityType]["totalCount"]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activity</TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(filteredDataPathActivityType).map(activityType => {
                if (filteredDataPathActivityType[activityType]["activities"]) {
                  return Object.keys(filteredDataPathActivityType[activityType]["activities"]).map(activity => (
                    <TableRow key={activity}>
                      <TableCell component="th" scope="row">
                        {activity}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {filteredDataPathActivityType[activityType]["activities"][activity]}
                      </TableCell>
                    </TableRow>
                  ));
                }
                return true;
              })}
            </TableBody>
          </Table>
        </Typography>
      </div>
    );
  };
  return (
    <Accordion
      description={`Activities on your created or collaborated paths have been solved ${sumUpByValueField(
        data[props.tabValue]
      )} times ${mapTabValueToLabel(props.tabValue)}`}
      handleTabChange={(e, tabValue) =>
        props.handleTabChange(e, tabValue, "SolversCreatedPaths", props.uid, props.getCreatedPaths)
      }
      tabValue={props.tabValue}
      title={"Created / collaborated paths stats"}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <IconButton
          onClick={() => props.handleChangeView("graph", "SolversCreatedPaths")}
          color={currentView === "graph" ? "primary" : "inherit"}
        >
          <EqualizerIcon />
        </IconButton>
        <IconButton
          onClick={() => props.handleChangeView("table", "SolversCreatedPaths")}
          color={currentView === "table" ? "primary" : "inherit"}
        >
          <ViewListIcon />
        </IconButton>
      </div>
      {currentView === "table" && tableData()}
      {currentView === "graph" && graphData()}
    </Accordion>
  );
};

const SelfExploration = props => {
  const { SelfExploration } = props.data;

  const activitiesExploredDataToDates = convertDataToDates(SelfExploration);

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
        props.handleTabChange(
          e,
          tabValue,
          "SelfExploration",
          props.uid,
          props.getActivitiesExplored,
          "",
          "SelfExploration"
        )
      }
      tabValue={props.tabValue}
      title={"Self Exploration"}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          {data.lastWeek.some(e => e.date) && (
            <BarChartBoilerPlate data={data} tabValue={"lastWeek"}>
              <Bar dataKey={"value"} fill={randomHsl()} key={"activities explored"} name={"activities completed"} />
              {/* <Bar dataKey={"pathsCompleted"} fill={randomHsl()} key={"paths explored"} name={"paths explored"} /> */}
            </BarChartBoilerPlate>
          )}
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          {data.lastMonth.some(e => e.date) && (
            <BarChartBoilerPlate data={data} tabValue={"lastMonth"}>
              <Bar dataKey={"value"} fill={randomHsl()} key={"activities completed"} name={"activities completed"} />
              {/* <Bar dataKey={"pathsCompleted"} fill={randomHsl()} key={"paths explored"} name={"paths explored"} /> */}
            </BarChartBoilerPlate>
          )}
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          {data.allTime.some(e => e.date) && (
            <BarChartBoilerPlate data={data} tabValue={"allTime"}>
              <Bar dataKey={"value"} fill={randomHsl()} key={"activities completed"} name={"activities completed"} />
              {/* <Bar dataKey={"pathsCompleted"} fill={randomHsl()} key={"paths explored"} name={"paths explored"} /> */}
            </BarChartBoilerPlate>
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
  const { field, title, chartName, getterFunction1, getterFunction2 = "", container = "" } = props.componentDetails;

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
        props.handleTabChange(e, tabValue, title, props.uid, getterFunction1, getterFunction2, container)
      }
      tabValue={props.tabValue}
      title={title}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          {data.lastWeek.some(e => e.date) && (
            <BarChartBoilerPlate data={data} tabValue={"lastWeek"}>
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChartBoilerPlate>
          )}
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          {data.lastMonth.some(e => e.date) && (
            <BarChartBoilerPlate data={data} tabValue={"lastMonth"}>
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChartBoilerPlate>
          )}
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          {data.allTime.some(e => e.date) && (
            <BarChartBoilerPlate data={data} tabValue={"allTime"}>
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChartBoilerPlate>
          )}
        </TabAllTime>
      )}
    </Accordion>
  );
};

const DisplayGenericOneFieldSpecificItem = props => {
  const rawData = props.data;
  const {
    field,
    fieldItem,
    title,
    chartName,
    getterFunction1,
    getterFunction2 = "",
    container = ""
  } = props.componentDetails;

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
        props.handleTabChange(e, tabValue, title, props.uid, getterFunction1, getterFunction2, container)
      }
      tabValue={props.tabValue}
      title={title}
    >
      {props.tabValue === "lastWeek" && (
        <TabLastWeek>
          {data.lastWeek.some(e => e.date) && (
            <BarChartBoilerPlate data={data} tabValue={"lastWeek"}>
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChartBoilerPlate>
          )}
        </TabLastWeek>
      )}
      {props.tabValue === "lastMonth" && (
        <TabLastMonth>
          {data.lastMonth.some(e => e.date) && (
            <BarChartBoilerPlate data={data} tabValue={"lastMonth"}>
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChartBoilerPlate>
          )}
        </TabLastMonth>
      )}
      {props.tabValue === "allTime" && (
        <TabAllTime>
          {data.allTime.some(e => e.date) && (
            <BarChartBoilerPlate data={data} tabValue={"allTime"}>
              <Bar dataKey={"value"} fill={randomHsl()} key={chartName} name={chartName} />
            </BarChartBoilerPlate>
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
    solversCreatedActivities: [],
    selectedTabView: { SolversCreatedPaths: "graph" },
    selectedFilters: { SolversCreatedPaths: { path: "none", activityType: "all" } },
    SelfExploration: [],
    codeCombatActivities: [],
    codeCombatMultiPlayerLevelActivities: [],
    ActivityAttempts: [],
    jupyterNotebookActivities: [],
    // these below are not used
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

  handleTabChange = (event, tabValue, title, uid, getterFunction1, getterFunction2 = "", container = "") => {
    this.setState({ tabvalueSpecificPanels: { ...this.state.tabvalueSpecificPanels, [title]: tabValue } });
    // Note: getLastMonthAllTimeData also gets data for this week only during tab change
    this.getLastMonthAllTimeData(tabValue, uid, getterFunction1, getterFunction2, container);
    this.db.collection("/logged_events").add({
      createdAt: Date.now(),
      type: "MYLEARNING_NAVIGATION",
      uid: uid,
      version: process.env.REACT_APP_VERSION,
      otherActionData: { tabValue: tabValue, title: title }
    });
  };

  handleChangeView = (value, title) => {
    return this.setState({ selectedTabView: { ...this.state.selectedTabView, [title]: value } });
  };

  handleChangeFilter = (value, title, filter) => {
    return this.setState({ selectedFilters: { [title]: { ...this.state.selectedFilters[title], [filter]: value } } });
  };

  getLastMonthAllTimeData = (tabValue, uid, getterFunction1, getterFunction2, container) => {
    if (tabValue === "lastWeek") {
      getterFunction1(uid, lastWeekEpochTime, container);
      if (getterFunction2) {
        getterFunction2(uid, lastWeekEpochTime, container);
      }
    }
    if (tabValue === "lastMonth") {
      getterFunction1(uid, lastMonthEpochTime, container);
      if (getterFunction2) {
        getterFunction2(uid, lastMonthEpochTime, container);
      }
    }
    if (tabValue === "allTime") {
      getterFunction1(uid, 0, container);
      if (getterFunction2) {
        getterFunction2(uid, 0, container);
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
  rtdb = firebase.database();

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

  processSetState = (query, dataContainer, stateKey) => {
    this.processQuerySnapshot(query, dataContainer).then(() =>
      this.setState({
        [stateKey]: Object.values(dataContainer)
      })
    );
  };

  getCreatedPaths = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = {};
    const solversOfCreatedPaths = {};
    return Promise.all([
      this.db
        .collection("logged_events")
        .where("uid", "==", uid)
        .where("type", "==", "PATH_CHANGE_SUCCESS")
        .where("createdAt", ">", epochTime)
        .orderBy("createdAt", "desc")
        .get()
        .then(querySnapshot => {
          // Collect all paths from snapshot into an array
          const paths = [];
          querySnapshot.forEach(doc => {
            const parsedData = doc.data();
            parsedData["otherActionData"] = JSON.parse(parsedData["otherActionData"]);
            const {
              createdAt,
              otherActionData: { pathKey }
            } = parsedData;
            dataContainer[doc.id] = {};
            dataContainer[doc.id]["name"] = doc.id;
            dataContainer[doc.id]["id"] = doc.id;
            dataContainer[doc.id]["date"] = createdAt;
            if ("pathKey" in parsedData["otherActionData"]) {
              dataContainer[doc.id]["pathKey"] = pathKey;
              paths.push(pathKey);
            }
          });
          return paths;
        }),
      this.rtdb
        .ref("/pathAssistants")
        .orderByChild(uid)
        .equalTo(true)
        .once("value")
        .then(snap => {
          if (snap.val()) {
            return Object.keys(snap.val());
          } else return [];
        })
    ])
      .then(([myPaths, assistantPaths]) => {
        return myPaths.concat(assistantPaths);
      })
      .then(paths => {
        return Promise.all(
          paths.map(pathKey => {
            return this.rtdb
              .ref(`paths/${pathKey}`)
              .once("value")
              .then(snap => {
                return snap.val().name;
              })
              .then(pathName => {
                return this.rtdb
                  .ref(`activities`)
                  .orderByChild("path")
                  .equalTo(pathKey)
                  .once("value")
                  .then(snap => {
                    const activityData = snap.val();
                    // store the information to pass down to .then using activityInfo
                    const activityInfo = {};
                    activityInfo.activityId = Object.keys(activityData);
                    activityInfo.activityId.forEach(activityID => {
                      activityInfo[activityID] = {};
                      activityInfo[activityID]["path"] = pathName;
                      if ("type" in activityData[activityID]) {
                        activityInfo[activityID]["type"] = activityData[activityID]["type"];
                      } else {
                        activityInfo[activityID]["type"] = "undocumentedType";
                      }
                      if ("name" in activityData[activityID]) {
                        activityInfo[activityID]["name"] = activityData[activityID]["name"];
                      } else {
                        activityInfo[activityID]["type"] = "undocumentedName";
                      }
                    });
                    return activityInfo;
                  });
              })
              .then(activityInfo => {
                return Promise.all(
                  activityInfo.activityId.map(activityKey => {
                    return this.rtdb
                      .ref(`problemSolutions/${activityKey}`)
                      .once("value")
                      .then(snap => {
                        if (snap.val()) {
                          const activitySolutions = snap.val();
                          Object.keys(activitySolutions).map(userID => {
                            const activitySolutionID = activityKey + userID;
                            // only save activityinfo to state if there's a timestamp. Text activity no timestamps
                            if (activitySolutions[userID]["updatedAt"]) {
                              solversOfCreatedPaths[activitySolutionID] = {};
                              solversOfCreatedPaths[activitySolutionID]["date"] =
                                activitySolutions[userID]["updatedAt"];
                              solversOfCreatedPaths[activitySolutionID]["name"] = activityInfo[activityKey]["name"];
                              solversOfCreatedPaths[activitySolutionID]["type"] = activityInfo[activityKey]["type"];
                              solversOfCreatedPaths[activitySolutionID]["path"] = activityInfo[activityKey]["path"];
                            }
                            return true;
                          });
                        }
                        return true;
                      });
                  })
                );
              });
          })
        );
      })
      .then(() => {
        this.setState({
          createdPaths: Object.values(dataContainer),
          solversCreatedActivities: Object.values(solversOfCreatedPaths)
        });
      });
  };

  getCreatedActivities = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = [];
    let query = this.queryActionType("PATH_ACTIVITY_CHANGE_SUCCESS", uid, epochTime);
    this.processSetState(query, dataContainer, "createdActivities");
  };

  // notes: actionType "PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS" doesn't contain codecombat activities whereas "PROBLEM_SOLUTION_ATTEMPT_REQUEST" does
  // actionType "PROBLEM_FINALIZE" doesn't have any otheractiondata or any indicator to the activity "finalized"
  // actionType "PROBLEM_SOLUTION_PROVIDED_SUCCESS" only works on notebooks

  getActivitiesExplored = (uid, epochTime = lastWeekEpochTime, container = "activitiesExplored") => {
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
          [container]: Object.values(dataContainer)
        });
      });
  };

  getRequestMoreProblems = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = [];
    let query = this.queryActionType("PATH_MORE_PROBLEMS_SUCCESS", uid, epochTime);
    this.processSetState(query, dataContainer, "requestsAdditionalActivities");
  };

  getVisitsMyLearning = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = [];
    let query = this.queryActionTypeOtherActionData("ROUTES_CHANGED", `{"pathName":"/mylearning"}`, uid, epochTime);
    this.processSetState(query, dataContainer, "visitsToMyLearning");
  };

  getClickRecommendedActivity = (uid, epochTime = lastWeekEpochTime) => {
    const dataContainer = [];
    let query = this.queryActionType("HOME_OPEN_RECOMMENDATION", uid, epochTime);
    this.processSetState(query, dataContainer, "recommendedActivitiesClick");
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
                <SolversCreatedPaths
                  data={this.state.solversCreatedActivities}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabvalueSpecificPanels["SolversCreatedPaths"] || this.state.tabValue}
                  getCreatedPaths={this.getCreatedPaths}
                  uid={this.props.id}
                  selectedTabView={this.state.selectedTabView}
                  handleChangeView={this.handleChangeView}
                  selectedFilters={this.state.selectedFilters}
                  handleChangeFilter={this.handleChangeFilter}
                />
                <SelfExploration
                  data={{
                    SelfExploration: this.state.SelfExploration
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
                    getterFunction1: this.getActivitiesExplored,
                    container: "codeCombatActivities"
                  }}
                  data={this.state.codeCombatActivities}
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
                    getterFunction1: this.getActivitiesExplored,
                    container: "jupyterNotebookActivities"
                  }}
                  data={this.state.jupyterNotebookActivities}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabvalueSpecificPanels["Jupyter Notebook activities"] || this.state.tabValue}
                  uid={this.props.id}
                />
                <DisplayGenericOneField
                  componentDetails={{
                    field: "attempts",
                    title: "Activity attempts",
                    chartName: "Activity attempts",
                    getterFunction1: this.getActivitiesExplored,
                    container: "ActivityAttempts"
                  }}
                  data={this.state.ActivityAttempts}
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
                    getterFunction1: this.getActivitiesExplored,
                    container: "codeCombatMultiPlayerLevelActivities"
                  }}
                  data={this.state.codeCombatMultiPlayerLevelActivities}
                  handleTabChange={this.handleTabChange}
                  tabValue={
                    this.state.tabvalueSpecificPanels["CodeCombat Multiplayer activities"] || this.state.tabValue
                  }
                  uid={this.props.id}
                />
                <DisplayRequestsAdditionalActivities data={this.state.requestsAdditionalActivities} />
                <DisplayGenericOneField
                  componentDetails={{
                    field: "",
                    title: "Visits to MyLearning",
                    chartName: "Visits to MyLearning",
                    getterFunction1: this.getVisitsMyLearning
                  }}
                  data={this.state.visitsToMyLearning}
                  handleTabChange={this.handleTabChange}
                  tabValue={this.state.tabvalueSpecificPanels["Visits to MyLearning"] || this.state.tabValue}
                  uid={this.props.id}
                />
                <DisplayRecommendedActivitiesClick data={this.state.recommendedActivitiesClick} />
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
