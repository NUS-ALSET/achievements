import React from "react";

class Ouptut extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { output, isSubmitted = false } = this.props;
    return (
      <div id="result-div">
        <div className="wrap p-10" style={{ height: "71px" }}>
          <h2>{isSubmitted ? "Submitted Result" : "Test Result"}</h2>
          <div className="status" id="result-status">
            {output.numFailedTests > 0 && (
              <span className="error"> {output.numFailedTests} ❌</span>
            )}
            <span className="success"> {output.numPassedTests} ✅</span>
          </div>
        </div>
        <div className="result-logs">
          {output.testResults.map((r, rIndex) => {
            return r.testResults.map((result, index) => {
              return (
                <div key={(rIndex + 1) * (1 + index)}>
                  <div className="log">
                    <div
                      className="log-status"
                      style={{
                        color: result.status === "failed" ? "red" : "green"
                      }}
                    >
                      {index + 1}
                    </div>

                    <div
                      className="log-describe"
                      style={{
                        color: result.status === "failed" ? "red" : "green"
                      }}
                    >
                      {result.ancestorTitles && result.ancestorTitles.length
                        ? result.ancestorTitles.reduce((a, b) => a + " " + b)
                        : ""}
                    </div>

                    <div className="log-expect">
                      {result.title || "Not described"}
                    </div>

                    <div className="log-time">{result.duration} ms</div>
                  </div>
                  {result.failureMessages && result.failureMessages.length > 0 && (
                    <div className="log-err console">
                      <pre>{result.failureMessages}</pre>
                    </div>
                  )}
                </div>
              );
            });
          })}
        </div>
        {
          <div className="mainWrap">
            <h4 style={{ color: "white", padding: "11px" }}>Complete Logs </h4>
            {output.testResults.map((r, rIndex) => {
              return (
                r.failureMessage &&
                r.failureMessage.length > 0 && (
                  <pre className="console" id="result-text" key={rIndex + 1}>
                    {r.failureMessage}
                  </pre>
                )
              );
            })}
            {output.success && (
              <pre className="console" id="result-text">
                All Test Passed.
              </pre>
            )}
          </div>
        }
      </div>
    );
  }
}

export default Ouptut;
