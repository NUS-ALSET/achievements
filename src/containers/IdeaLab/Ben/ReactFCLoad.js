import React from "react";
// Charting packages from fusionChart
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import powerCharts from "fusioncharts/fusioncharts.powercharts";
import ReactFC from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ZoomLine from "fusioncharts/fusioncharts.zoomline"

ReactFC.fcRoot(FusionCharts, Charts, powerCharts, FusionTheme, ZoomLine);

class ReactFCLoad extends React.PureComponent {
  render() {
    const { ...props } = this.props;
    return <ReactFC {...props} />;
  }
}

export default ReactFCLoad;
