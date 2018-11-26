import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";

interface StaffRolesOwnProps {
}

interface StaffRolesStateProps {
}

const mapStateToProps = (state: AppState, ownProps: StaffRolesOwnProps): StaffRolesStateProps => {
  return {}
};

interface StaffRolesDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: StaffRolesOwnProps): StaffRolesDispatchProps => {
  return {};
};

type StaffRolesProps = StaffRolesOwnProps & StaffRolesStateProps & StaffRolesDispatchProps;

class StaffRolesComponent extends React.Component<StaffRolesProps, {}> {
  public render() {
    return (
      <div>Staff roles data entry</div>
    )
  }
}

export const StaffRoles = connect<StaffRolesStateProps, StaffRolesDispatchProps, StaffRolesOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(StaffRolesComponent);