import customData from "../data/moreProblemsRequestData.js";

const columnChartConfigs = {
    type: "column2d",// The chart type
    width: "100%",
    dataFormat: "json", // Data type
    dataSource: {
        // Chart Configuration
        "chart": {
            "caption": "Number of students who requested for more problems",
            "subCaption": "December 2018",
            "xAxisName": "Paths",
            "yAxisName": "Number of clicks",
            "numberSuffix": "",
            "theme": "fusion"
        },
        // Chart Data
        "data": customData
    }
};

const pieChartConfigs = {
    type: "pie2d",// The chart type
    // height: "100%",
    dataFormat: "json", // Data type
    dataSource: {
        // Chart Configuration
        "chart": {
            "caption": "Number of students who requested for more problems",
            "subCaption": "October 2018",
            "xAxisName": "Paths",
            "yAxisName": "Number of clicks",
            "numberSuffix": "",
            "theme": "fusion"
        },
        // Chart Data
        "data": customData
    }
};

export {columnChartConfigs, pieChartConfigs};