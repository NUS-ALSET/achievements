import dataSource from "../data/chartFourData.js";

const chartFourConfigs = {
    type: "scrollstackedcolumn2d",// The chart type
    width: "100%",
    dataFormat: "json", // Data type
    dataSource: {...dataSource}
};


export default chartFourConfigs;