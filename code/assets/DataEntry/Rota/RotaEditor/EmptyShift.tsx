import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {WorkType} from "../../../Model/Enum/WorkTypes";
import {Holiday} from "../../../Model/Holiday/Holiday";
import {Shift} from "../../../Model/Shift/Shift";
import {StaffMember} from "../../../Model/StaffMember/StaffMember";
import {AppState} from "../../../redux";
import {DateFormats} from "../../../Util/DateFormats";

interface EmptyShiftOwnProps {
  staffMember: StaffMember;
  date: string;
  addShift: (shiftToAdd: Shift) => void;
  onHoliday: boolean;
  holiday?: Holiday;
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
    return this.props.staffMember.id !== nextProps.staffMember.id || this.props.editingDisabled !== nextProps.editingDisabled || this.props.onHoliday !== nextProps.onHoliday;
  }

  public render() {
    if (this.props.onHoliday) {
      return (
        <div className={`rota-shift no-shift on-holiday`} key={this.props.staffMember.entityId}>
          <div className="rota-staff-name on-holiday">
            {this.props.staffMember.name} (holiday {this.props.holiday ? moment.utc(this.props.holiday.startDate).format(DateFormats.READABLE_NO_YEAR):''} - {this.props.holiday ? moment.utc(this.props.holiday.endDate).format(DateFormats.READABLE_NO_YEAR):''})
          </div>
        </div>
      )
    } else {
      return (
        <div className="rota-shift no-shift" key={this.props.staffMember.entityId}>
          <div className="rota-staff-name">{this.props.staffMember.name}</div>
          <div className="rota-remove-shift"/>
          <div className="rota-off-floor"/>
          <div className="rota-new-shift">
            <button className={`new-shift-button`} disabled={this.props.editingDisabled} onClick={() => this.newShiftHandler(this.props.staffMember)} type="button"><FontAwesomeIcon icon="plus-circle"/></button>
          </div>
          <div className="rota-new-shift-spacer"/>
          <div className="rota-new-shift-spacer"/>
          <div className="rota-new-shift-spacer"/>
          {this.props.timePeriods.map((timePeriod, periodKey) => (
            <div className="rota-time-empty" key={periodKey}/>
          ))}
        </div>
      )
    }
  }

  private newShiftHandler(member: StaffMember) {
    this.props.addShift(Shift.default(member, this.props.workType, this.props.date));
  }
}

export const EmptyShift = connect<EmptyShiftStateProps, EmptyShiftDispatchProps, EmptyShiftOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(EmptyShiftComponent);
