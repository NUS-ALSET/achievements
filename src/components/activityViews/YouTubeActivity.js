/**
 * @file YouTubeActivity container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import YouTube from "react-youtube";

import ActivityQuestion from "./ActivityQuestion";

class YouTubeActivity extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
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
      this.props.onChange({
        answers: {
          ...this.state.answers,
          [question]: answer
        }
      });
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
        {solution !== null &&
          problem.questionAfter && (
            <ActivityQuestion
              question="questionAfter"
              setAnswer={this.setAnswer}
              solution={solution}
            />
          )}
        {solution !== null &&
          problem.questionAnswer && (
            <ActivityQuestion
              question="questionAnswer"
              setAnswer={this.setAnswer}
              solution={solution}
            />
          )}
        {solution !== null &&
          problem.topics && (
            <ActivityQuestion
              question="topics"
              setAnswer={this.setAnswer}
              solution={solution}
            />
          )}
        {solution !== null &&
          problem.questionCustom &&
          problem.customText && (
            <ActivityQuestion
              label={problem.customText}
              question="customQuestion"
              setAnswer={this.setAnswer}
              solution={solution}
            />
          )}
      </Fragment>
    );
  }
}

export default YouTubeActivity;
