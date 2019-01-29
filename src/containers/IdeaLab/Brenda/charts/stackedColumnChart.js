import dataSource from "../data/stackedBarChartData.js";

const stackedChart2Configs = {
    type: "scrollstackedcolumn2d",// The chart type
    width: "100%",
    dataFormat: "json", // Data type
    dataSource: {...dataSource}
};


export default stackedChart2Configs;