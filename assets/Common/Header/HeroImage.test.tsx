import * as React from 'react';
import {mountComponent} from "../../TestHelpers/ComponentMounting";
import {StateHelpers} from "../../TestHelpers/StateHelpers";
import {HeroImage} from "./HeroImage";

describe('HeroImage component', () => {
  it('does not render without auth', () => {
    const wrapper = mountComponent(<HeroImage />);

    expect(wrapper.find('.hero-image')).toHaveLength(0);
  });

  it('renders with auth', () => {
    const wrapper = mountComponent(<HeroImage />, StateHelpers.appStateWith({authState:StateHelpers.authState()}));

    expect(wrapper.find('.hero-image')).toHaveLength(1);
  });
});