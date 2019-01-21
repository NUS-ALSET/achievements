import dataSource from "../data/chartFiveData.js";

const chartFiveConfigs = {
    type: "heatmap",// The chart type
    renderAt: "chart-container",
    width: "70%",
    height: "35%",
    dataFormat: "json", // Data type
    dataSource: {...dataSource}
};

export default chartFiveConfigs;