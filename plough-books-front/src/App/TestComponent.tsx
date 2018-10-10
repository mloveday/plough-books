import * as React from "react";
import {connect} from "react-redux";
import {testActionCreators} from "../redux";

interface ITestStateProps {
  test: any
}

function mapStateToProps(state: any): ITestStateProps {
  return { test: state.test}
}

interface ITestDispatchProps {
  fetchTest: () => {}
}

function mapDispatchToProps(dispatch: any): ITestDispatchProps {
  return {
    fetchTest: () => dispatch(testActionCreators.fetchStart())
  }
}

class TestComponent extends React.Component<{} & ITestStateProps & ITestDispatchProps, []> {
  public componentDidMount() {
    this.props.fetchTest();
  }

  public render() {
    return <div>
      <div>Displays the response from the index of the backend server to test redux functionality</div>
      <br/>
      <div style={{color: '#666', fontSize: '10px'}}>
        {this.props.test[1] ? this.props.test[1].data : 'Loading sample data...'}
        </div>
    </div>
  }
}

export const Test = connect(mapStateToProps, mapDispatchToProps)(TestComponent);