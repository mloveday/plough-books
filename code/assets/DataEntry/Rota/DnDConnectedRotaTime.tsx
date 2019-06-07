import * as moment from "moment";
import * as React from "react";
import {ConnectDropTarget} from "react-dnd";
import {ConnectDragSource} from "react-dnd/lib/esm";
import {connect} from "react-redux";
import {Shift} from "../../Model/Shift/Shift";
import {AppState} from "../../redux";
import {
  getShiftEndTimeFromStrings,
  getShiftStartTimeFromStrings,
  timeFromHalfHoursPastStart
} from "../../Util/DateUtils";

interface DnDRotaTimeOwnProps {
  isWorking: boolean;
  startPeriodIndex: number,
  timePeriodIndex: number;
  draggedShiftId: number;
  isHovering: boolean;
  updateRota: (dragIndex: moment.Moment, dropIndex: moment.Moment) => void,
  shift: Shift,
  connectDragSource: ConnectDragSource,
  connectDropTarget: ConnectDropTarget;
}

interface DnDRotaTimeStateProps {
}

const mapStateToProps = (state: AppState, ownProps: DnDRotaTimeOwnProps): DnDRotaTimeStateProps => {
  return {}
};

interface DnDRotaTimeDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: DnDRotaTimeOwnProps): DnDRotaTimeDispatchProps => {
  return {};
};

type DnDRotaTimeProps = DnDRotaTimeOwnProps & DnDRotaTimeStateProps & DnDRotaTimeDispatchProps;

class DnDRotaTimeComponent extends React.Component<DnDRotaTimeProps, {}> {
  public componentDidUpdate() {
    const startTime = getShiftStartTimeFromStrings(timeFromHalfHoursPastStart(Math.min(this.props.startPeriodIndex, this.props.timePeriodIndex)), this.props.shift.date);
    const endTime = getShiftEndTimeFromStrings(timeFromHalfHoursPastStart(Math.max(this.props.startPeriodIndex, this.props.timePeriodIndex)), this.props.shift.date);
    if (this.props.isHovering
      && this.props.draggedShiftId === this.props.shift.id
      && (!endTime.isSame(this.props.shift.getEndTime(), 'minute')
        || !startTime.isSame(this.props.shift.getStartTime(), 'minute'))
    ) {
      this.props.updateRota(startTime, endTime);
    }
  }

  public render() {
    return this.props.connectDropTarget(
      <div ref={this.props.connectDragSource} className={this.props.isWorking ? "rota-time working" : "rota-time"} key={this.props.timePeriodIndex}/>
    );
  }
}

export const ConnectedRotaTime = connect<DnDRotaTimeStateProps, DnDRotaTimeDispatchProps, DnDRotaTimeOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(DnDRotaTimeComponent);