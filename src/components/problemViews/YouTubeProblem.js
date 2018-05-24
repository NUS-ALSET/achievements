/**
 * @file YouTubeProblem container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";

import YouTube from "react-youtube";

import ProblemQuestion from "../ProblemQuestion";
import { problemSolutionSubmitRequest } from "../../containers/Problem/actions";

class YouTubeProblem extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    problem: PropTypes.object,
    solution: PropTypes.any
  };

  state = {
    answers: {},
    youtubeEvents: {}
  };

  setAnswer = (question, answer) => {
    this.setState({
      answers: {
        ...this.state.answers,
        [question]: answer
      }
    });
    if (this.props.onChange) {
      this.props.onChange(this.state);
    }
  };
  setYoutubeEvent = (event, videoTime, info = {}) => {
    if (!videoTime) {
      return;
    }
    this.setState({
      youtubeEvents: {
        ...this.state.youtubeEvents,
        [new Date().getTime()]: {
          event,
          videoTime,
          ...info
        }
      }
    });
    if (this.props.onChange) {
      this.props.onChange(this.state);
    }
  };

  onCommit = () => {
    const { dispatch, problem } = this.props;

    dispatch(
      problemSolutionSubmitRequest(problem.owner, problem.problemId, this.state)
    );
  };

  render() {
    const { onChange, problem, solution } = this.props;

    return (
      <Fragment>
        <YouTube
          onEnd={e => this.setYoutubeEvent("end", e.target.getCurrentTime())}
          onError={e =>
            this.setYoutubeEvent("error", e.target.getCurrentTime(), {
              error: e.data
            })
          }
          onPause={e =>
            this.setYoutubeEvent("pause", e.target.getCurrentTime())
          }
          onPlay={e => this.setYoutubeEvent("play", e.target.getCurrentTime())}
          onPlaybackQualityChange={e =>
            this.setYoutubeEvent(
              "playbackQualityChange",
              e.target.getCurrentTime(),
              { quality: e.data }
            )
          }
          onPlaybackRateChange={e =>
            this.setYoutubeEvent(
              "PlaybackRateChange",
              e.target.getCurrentTime(),
              { rate: e.data }
            )
          }
          videoId={problem.youtubeURL.replace(/.*=/, "")}
        />
        {problem.questionAfter && (
          <ProblemQuestion
            question="questionAfter"
            setAnswer={this.setAnswer}
            solution={solution}
          />
        )}
        {problem.questionAnswer && (
          <ProblemQuestion
            question="questionAnswer"
            setAnswer={this.setAnswer}
            solution={solution}
          />
        )}
        {problem.topics && (
          <ProblemQuestion
            question="topics"
            setAnswer={this.setAnswer}
            solution={solution}
          />
        )}
        {problem.questionCustom &&
          problem.customText && (
            <ProblemQuestion
              label={problem.customText}
              question="customQuestion"
              setAnswer={this.setAnswer}
              solution={solution}
            />
          )}

        {!onChange && (
          <Button color="primary" onClick={this.onCommit} variant="raised">
            Submit
          </Button>
        )}
      </Fragment>
    );
  }
}

export default YouTubeProblem;
