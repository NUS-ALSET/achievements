import React from "react";
// Charting packages from fusionChart
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import powerCharts from "fusioncharts/fusioncharts.powercharts";
import ReactFC from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, Charts, powerCharts, FusionTheme);

class ReactFCLoad extends React.PureComponent {
  render() {
    const { ...props } = this.props;
    return <ReactFC {...props} />;
  }
}

export default ReactFCLoad;