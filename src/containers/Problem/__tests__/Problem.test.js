import React from "react";
import { MemoryRouter } from "react-router";
import renderer from "react-test-renderer";
import Problem from "../Problem";
import configureStore from "redux-mock-store";
import { storeWithFirebase } from "react-redux-firebase/test/utils";

it("should test Problem container", () => {
  const mockStore = configureStore();
  const component = renderer.create(
    <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
      <Problem firebase={{}} store={storeWithFirebase()} />
    </MemoryRouter>
  );

  expect(component.toJSON()).toMatchSnapshot();
});
