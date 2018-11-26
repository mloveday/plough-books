import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {StaffRolesExternalState} from "./State/StaffRolesExternalState";
import {StaffRolesLocalState} from "./State/StaffRolesLocalState";
import {staffRolesFetch} from "./State/StaffRolesRedux";

interface StaffRolesOwnProps {
}

interface StaffRolesStateProps {
  staffRolesExternalState: StaffRolesExternalState;
  staffRolesLocalState: StaffRolesLocalState;
}

const mapStateToProps = (state: AppState, ownProps: StaffRolesOwnProps): StaffRolesStateProps => {
  return {
    staffRolesExternalState: state.staffRolesExternalState,
    staffRolesLocalState: state. staffRolesLocalState,
  }
};

interface StaffRolesDispatchProps {
  fetchStaffRoles: () => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: StaffRolesOwnProps): StaffRolesDispatchProps => {
  return {
    fetchStaffRoles: () => dispatch(staffRolesFetch()),
  };
};

type StaffRolesProps = StaffRolesOwnProps & StaffRolesStateProps & StaffRolesDispatchProps;

class StaffRolesComponent extends React.Component<StaffRolesProps, {}> {
  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    return (
      <div>
        {this.props.staffRolesLocalState.roles.map((role, key) => (
          <div key={key}>{role.role}</div>
        ))}
      </div>
    )
  }

  private maintainStateWithUrl() {
    if (this.props.staffRolesExternalState.isEmpty()) {
      this.props.fetchStaffRoles();
      return;
    }
  }
}

export const StaffRoles = connect<StaffRolesStateProps, StaffRolesDispatchProps, StaffRolesOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(StaffRolesComponent);