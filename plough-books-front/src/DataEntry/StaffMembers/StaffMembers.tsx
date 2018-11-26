import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";

interface StaffMembersOwnProps {
}

interface StaffMembersStateProps {
}

const mapStateToProps = (state: AppState, ownProps: StaffMembersOwnProps): StaffMembersStateProps => {
  return {}
};

interface StaffMembersDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: StaffMembersOwnProps): StaffMembersDispatchProps => {
  return {};
};

type StaffMembersProps = StaffMembersOwnProps & StaffMembersStateProps & StaffMembersDispatchProps;

class StaffMembersComponent extends React.Component<StaffMembersProps, {}> {
  public render() {
    return (
      <div>Staff members data entry</div>
    )
  }
}

export const StaffMembers = connect<StaffMembersStateProps, StaffMembersDispatchProps, StaffMembersOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(StaffMembersComponent);