import dataSource from "../data/chartThreeData.js";

const chartThreeConfigs = {
    type: "scrollstackedcolumn2d",// The chart type
    width: "100%",
    dataFormat: "json", // Data type
    dataSource: {...dataSource}
};


export default chartThreeConfigs;