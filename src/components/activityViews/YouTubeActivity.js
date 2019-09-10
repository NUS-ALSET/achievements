/**
 * @file YouTubeActivity container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import YouTube from "react-youtube";

import ActivityQuestion from "./ActivityQuestion";
import { MultipleQuestionActivity } from "./MultipleQuestionActivity";

class YouTubeActivity extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    problem: PropTypes.object,
    solution: PropTypes.any
  };

  state = {
    answers: {},
    youtubeEvents: {},
    openTime: null
  };

  componentDidMount() {
    const { solution, onChange, problem, setProblemOpenTime } = this.props;
    if (solution && onChange) {
      const state = {
        answers: solution.answers,
        youtubeEvents: solution.youtubeEvents,
        openTime: new Date().getTime()
      };
      this.setState(state);
      onChange(state);
    }
    setProblemOpenTime(problem.problemId, new Date().getTime());
  }

  setAnswer = (question, answer) => {
    const newState = {
      answers: {
        ...this.state.answers,
        [question]: (answer || "").trim()
      },
      youtubeEvents: {
        ...(this.state.youtubeEvents || {})
      }
    };
    this.setState(newState);
    if (this.props.onChange) {
      this.props.onChange(newState);
    }
  };
  setYoutubeEvent = (event, videoTime, info = {}) => {
    if (!videoTime) {
      return;
    }
    const newState = {
      answers: {
        ...(this.state.answers || {})
      },
      youtubeEvents: {
        ...this.state.youtubeEvents,
        [new Date().getTime()]: {
          event,
          videoTime,
          ...info
        }
      }
    };
    this.setState(newState);
    if (this.props.onChange) {
      this.props.onChange(newState);
    }
  };

  render() {
    const { problem, solution } = this.props;

    // noinspection JSDeprecatedSymbols
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
        {solution !== null && problem.questionAfter && (
          <ActivityQuestion
            question="questionAfter"
            setAnswer={this.setAnswer}
            solution={solution}
          />
        )}
        {solution !== null && problem.questionAnswer && (
          <ActivityQuestion
            question="questionAnswer"
            setAnswer={this.setAnswer}
            solution={solution}
          />
        )}
        {solution !== null && problem.topics && (
          <ActivityQuestion
            question="topics"
            setAnswer={this.setAnswer}
            solution={solution}
          />
        )}
        {solution !== null && problem.questionCustom && problem.customText && (
          <ActivityQuestion
            label={problem.customText}
            question="questionCustom"
            setAnswer={this.setAnswer}
            solution={solution}
          />
        )}
        {solution !== null && problem.multipleQuestion && (
          <MultipleQuestionActivity
            noForce={true}
            onCommit={solution => this.setAnswer("multipleQuestion", solution)}
            problem={problem}
            solution={this.state.answers && this.state.answers.multipleQuestion}
          />
        )}
      </Fragment>
    );
  }
}

export default YouTubeActivity;
