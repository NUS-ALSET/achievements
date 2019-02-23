import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { format } from 'date-fns';
import FusionCharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import ReactFusioncharts from 'react-fusioncharts';
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { compose } from "redux";
import { notificationShow } from "../../containers/Root/actions";
import { sagaInjector } from "../../services/saga";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import sagas from "./sagas";
import Table from "@material-ui/core/Table";



charts(FusionCharts);

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// this is a demo route for AdditionalContentRequests actions to Firebase



class AdditionalContentRequests extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
  };
  constructor(props) {
    super(props);
    const dateTo = new Date((new Date()).setDate(new Date().getDate() + 1));
    const dateFrom = new Date((new Date()).setDate(dateTo.getDate() - 5));
    const caption = this.getCaption({ dateFrom, dateTo })
    this.state = {
      dateFrom,
      dateTo,
      timeDataSet: [],
      reqByPathsAndDate: null,
      dataSource: {
        "chart": {
          "caption": "Additional activity request for the different paths",
          "yaxisname": "Number of requests",
          "subcaption": caption,
          "showhovereffect": "1",
          "numbersuffix": "",
          "drawcrossline": "1",
          "plottooltext": "<b>$dataValue</b> request for $seriesName",
        },
        categories: [{
          category: []
        }],
        dataset: [],
      },
      pathsCounts: null
    }
  }
  componentDidMount() {
    this.createDataSet(this.state);
  }

  updateDate = (name, value) => {
    this.setState(() => ({
      [name]: new Date(value)
    }))
  }
  getCaption = ({ dateFrom, dateTo }) => {
    const fromText=`${dateFrom.getDate()} ${monthNames[dateFrom.getMonth()]} ${dateFrom.getFullYear()}`;
    const toText=`${dateTo.getDate()} ${monthNames[dateTo.getMonth()]} ${dateTo.getFullYear()}`;
    return `${fromText}-${toText}`;
  }

  changeCaption = ({ dateFrom, dateTo }) => {
    const caption = this.getCaption({ dateFrom, dateTo });
    const dataSource = this.state.dataSource;
    dataSource.chart.subcaption = caption;
    this.setState({
      dataSource
    });
  }
  getDate = (date) => {
    return `${date.getDate()} ${monthNames[date.getMonth()]}`;
  }
  changeState = (e) => {
    const { name, value } = e.target;
    this.updateDate(name, value);
    const data = {
      ...this.state,
      [name]: new Date(value),
    }
    const { dateFrom, dateTo } = data;
    if (dateFrom > dateTo) {
      this.props.notificationShow('start date must be greater than end date')
    }
    else {
      this.changeCaption(data)
      this.createDataSet(data);
    }

  }
  getPathName = (pathId) => {
    return ((this.props.paths || {})[pathId] || {}).name || pathId;
  }
  createDataSet = (state) => {
    const { dateFrom, dateTo, dataSource, reqByPathsAndDate } = state;
    let d = new Date(dateFrom);
    const pathsCounts = {};
    let timeDataSet = [];
    while (d.getTime() < (dateTo.getTime() + 1)) {
      timeDataSet.push({ 'label': this.getDate(d) });
      d = new Date(d.setDate(d.getDate() + 1))
      const dataset = dataSource.dataset.map(pathData => {
        const pathId = pathData.pathId;
        pathsCounts[pathId] = 0;
        const data = timeDataSet.map(timeData => {
          const dateId = timeData.label;
          const reqCount = (reqByPathsAndDate[pathId] || {})[dateId] || 0;
          pathsCounts[pathId] += reqCount;
          return { value: reqCount };
        })
        return {
          pathId: pathId,
          seriesname: this.getPathName(pathId),
          data
        }
      })
      this.setState({
        dataSource: {
          ...dataSource,
          categories: [
            {
              category: timeDataSet
            }
          ],
          dataset,

        },
        pathsCounts
      })
    };
  }

  componentDidUpdate() {
    const { moreProbRequestsData, paths } = this.props;
    if (moreProbRequestsData && paths && !this.state.reqByPathsAndDate) {
      const paths = {};
      Object.keys(moreProbRequestsData).forEach(reqId => {
        const req = moreProbRequestsData[reqId];
        const date = new Date(req.requestTime);
        const dateId = this.getDate(date);
        if (paths[req.path]) {
          if (paths[req.path][dateId]) {
            paths[req.path][dateId] += 1;
          } else {
            paths[req.path][dateId] = 1;
          }
        } else {
          paths[req.path] = {
            [dateId]: 1
          }
        }
      })


      const dataset = Object.keys(paths).map(pathId => {
        return {
          pathId: pathId,
          seriesname: this.getPathName(pathId),
          data: []
        }
      })

      const newState = {
        ...this.state,
        reqByPathsAndDate: paths,
        dataSource: {
          ...this.state.dataSource,
          dataset
        },

      }
      this.setState(newState);
      this.createDataSet(newState);
    }

  }
  render() {
    const { dateFrom, dateTo, pathsCounts } = this.state;
    const {
      classes,
    } = this.props;
    const formattedDateFrom = format(dateFrom, 'YYYY-MM-DD');
    const formattedDateTo = format(dateTo, 'YYYY-MM-DD');
    return (
      <Fragment >
        <form className={classes.container} noValidate>
          <TextField
            id="dateFrom"
            label="From"
            type="date"
            name="dateFrom"
            value={formattedDateFrom}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => this.changeState(e)}
          />
          <TextField
            id="dateTo"
            label="To"
            type="date"
            name="dateTo"
            value={formattedDateTo}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => this.changeState(e)}
          />
        </form>
        {/* <Chart dataSource={dataSource} /> */}
        <div style={{ height: '500px' }}>
          <ReactFusioncharts
            type="msline"
            width='100%'
            height='100%'
            dataFormat="JSON"
            dataSource={this.state.dataSource} />
            <center><h4>Additional activity request for the different paths</h4>
            <h5>{this.getCaption(this.state)}</h5>
            </center>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Path</TableCell>
                <TableCell>No. Of Request</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(pathsCounts || []).map(pathId => (
                <TableRow key={pathId}>
                  <TableCell>{this.getPathName(pathId)}</TableCell>
                  <TableCell>{pathsCounts[pathId]}</TableCell>
                </TableRow>
              )
              )}
            </TableBody>
          </Table>
        </div>
      </Fragment>
    );
  }
}

// inject saga to the main saga
sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  moreProbRequestsData: state.firebase.data.moreProbRequestsData,
  paths: state.firebase.data.paths,
});

const mapDispatchToProps = {
  notificationShow
};

export default compose(
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return firebaseAuth.isEmpty ? [] : [{
      path: "/moreProblemsRequests",
      storeAs: "moreProbRequestsData",
      queryParams: ["orderByChild=requestTime"],
    }, {
      path: "/paths",
    }]
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AdditionalContentRequests);

