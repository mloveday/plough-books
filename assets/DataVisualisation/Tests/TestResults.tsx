import * as React from "react";

export class TestResultsComponent extends React.PureComponent {
  public render() {
    return (
      <iframe src={`/build/test/output/jest-stare/index.html`} style={{boxSizing: 'border-box', width: '100%', height: '100%'}} />
    )
  }
}
