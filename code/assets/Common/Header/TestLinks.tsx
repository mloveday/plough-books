import * as React from "react";
// import {Link} from "react-router-dom";
// import {Routes} from "../Routing/Routes";
import './TestLinks.scss';

export class TestLinksComponent extends React.Component {
  public render() {
    return (
      <div className={`test-links`}>
        {/*<Link className={`App-nav-anchor`} to={Routes.TEST_RESULTS}>Tests</Link>*/}
        {/*<Link className={`App-nav-anchor`} to={Routes.TEST_COVERAGE}>Coverage</Link>*/}
      </div>
    );
  }
}