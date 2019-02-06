import * as React from 'react';
import {mountComponent} from "../../TestHelpers/ComponentMounting";
import {StateHelpers} from "../../TestHelpers/StateHelpers";
import {LandingPage} from "./LandingPage";

describe('LandingPage component', () => {
  it('Renders 5 FAQs for normal users', () => {
    const wrapper = mountComponent(
      <LandingPage />,
      StateHelpers.appStateWith({authState:StateHelpers.authState(StateHelpers.normalUser())})
    );

    expect(wrapper.find('.query')).toHaveLength(5);
  });

  it('renders an additional FAQ for admin users', () => {
    const normalUserWrapper = mountComponent(
      <LandingPage />,
      StateHelpers.appStateWith({authState:StateHelpers.authState(StateHelpers.normalUser())})
    );

    const superUserWrapper = mountComponent(
      <LandingPage />,
      StateHelpers.appStateWith({authState:StateHelpers.authState(StateHelpers.adminUser())})
    );

    expect(superUserWrapper.find('.query')).toHaveLength(normalUserWrapper.find('.query').length + 1);
  });
});