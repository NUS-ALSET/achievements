import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { mount } from "enzyme";

// Let's create a Child functional component which does
// nothing but throw an error. This way we can ensure we'll trigger
// an error and have our Error Boundary called.
const Child = () => {
  throw "child has error";
};

const pauseErrorLogging = codeToRun => {
  // capture error function
  const logger = console.error;
  // replace with stub function
  console.error = () => {};

  // execute code
  codeToRun();

  // add back the console error function
  console.error = logger;
};

it("ErrorBoundary HOC should catches error and renders message", () => {
  // stop error within from logging error to console
  pauseErrorLogging(() => {
    const wrapper = mount(
      <ErrorBoundary render={() => <div>test error message</div>}>
        <Child />
      </ErrorBoundary>
    );

    // because an error has occured in the Child
    // let's make sure our error boundary has displayed the error
    // which was provided in the render prop
    expect(wrapper.text()).toEqual("test error message");
  });
});
