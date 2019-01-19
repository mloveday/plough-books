import {mount} from "enzyme";
import * as React from "react";
import {ReactElement} from "react";
import {Provider} from "react-redux";
import {AppState} from "../assets/redux";
import {setupStore} from "./setupStore";

export function mountComponent<P>(node: ReactElement<P>, initialState: AppState) {
  return mount(<Provider store={setupStore(initialState)}>{node}</Provider>);
}