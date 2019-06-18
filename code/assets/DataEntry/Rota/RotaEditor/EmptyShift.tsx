import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {WorkType} from "../../../Model/Enum/WorkTypes";
import {Shift} from "../../../Model/Shift/Shift";
import {StaffMember} from "../../../Model/StaffMember/StaffMember";
import {AppState} from "../../../redux";

interface EmptyShiftOwnProps {
  staffMember: StaffMember;
  date: string;
  addShift: (shiftToAdd: Shift) => void;
  editingDisabled: boolean;
  timePeriods: moment.Moment[];
  workType: WorkType;
}

interface EmptyShiftStateProps {
}

const mapStateToProps = (state: AppState, ownProps: EmptyShiftOwnProps): EmptyShiftStateProps => {
  return {}
};

interface EmptyShiftDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: EmptyShiftOwnProps): EmptyShiftDispatchProps => {
  return {};
};

type EmptyShiftProps = EmptyShiftOwnProps & EmptyShiftStateProps & EmptyShiftDispatchProps;

class EmptyShiftComponent extends React.Component<EmptyShiftProps, {}> {
  public shouldComponentUpdate(nextProps: Readonly<EmptyShiftOwnProps & EmptyShiftStateProps & EmptyShiftDispatchProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    return this.props.staffMember.id !== nextProps.staffMember.id && this.props.editingDisabled !== nextProps.editingDisabled;
  }

  public render() {
    return (
      <div className="rota-shift no-shift" key={this.props.staffMember.entityId}>
        <div className="rota-staff-name">{this.props.staffMember.name}</div>
        <div className="rota-remove-shift"/>
        <div className="rota-off-floor"/>
        <div className="rota-new-shift">
          <button disabled={this.props.editingDisabled} onClick={() => this.newShiftHandler(this.props.staffMember)} type="button"><FontAwesomeIcon icon="plus-circle"/></button>
        </div>
        <div className="rota-new-shift-spacer"/>
        <div className="rota-new-shift-spacer"/>
        <div className="rota-new-shift-spacer"/>
        {this.props.timePeriods.map((timePeriod, periodKey) => (
          <div className="rota-time" key={periodKey}/>
        ))}
      </div>
    )
  }

  private newShiftHandler(member: StaffMember) {
    this.props.addShift(Shift.default(member, this.props.workType, this.props.date));
  }
}

export const EmptyShift = connect<EmptyShiftStateProps, EmptyShiftDispatchProps, EmptyShiftOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(EmptyShiftComponent);
