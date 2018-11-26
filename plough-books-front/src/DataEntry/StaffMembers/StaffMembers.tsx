import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {StaffMembersExternalState} from "./State/StaffMembersExternalState";
import {StaffMembersLocalState} from "./State/StaffMembersLocalState";
import {staffMembersFetch} from "./State/StaffMembersRedux";

interface StaffMembersOwnProps {
}

interface StaffMembersStateProps {
  staffMembersExternalState: StaffMembersExternalState;
  staffMembersLocalState: StaffMembersLocalState;
}

const mapStateToProps = (state: AppState, ownProps: StaffMembersOwnProps): StaffMembersStateProps => {
  return {
    staffMembersExternalState: state.staffMembersExternalState,
    staffMembersLocalState: state. staffMembersLocalState,
  }
};

interface StaffMembersDispatchProps {
  fetchStaffMembers: () => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: StaffMembersOwnProps): StaffMembersDispatchProps => {
  return {
    fetchStaffMembers: () => dispatch(staffMembersFetch()),
  };
};

type StaffMembersProps = StaffMembersOwnProps & StaffMembersStateProps & StaffMembersDispatchProps;

class StaffMembersComponent extends React.Component<StaffMembersProps, {}> {
  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }
  
  public render() {
    return (
      <div>
        {this.props.staffMembersLocalState.members.map((member, key) => (
          <div key={key}>{member.name}</div>
        ))}
      </div>
    )
  }

  private maintainStateWithUrl() {
    if (this.props.staffMembersExternalState.isEmpty()) {
      this.props.fetchStaffMembers();
      return;
    }
  }
}

export const StaffMembers = connect<StaffMembersStateProps, StaffMembersDispatchProps, StaffMembersOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(StaffMembersComponent);