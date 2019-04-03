import * as React from "react";

export class TestCoverageComponent extends React.PureComponent {
  public render() {
    return (
      <iframe src={`/build/test/output/coverage/index.html`} style={{boxSizing: 'border-box', width: '100%', height: '100%'}} />
    )
  }
}
