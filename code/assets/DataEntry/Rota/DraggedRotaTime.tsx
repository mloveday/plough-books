import * as moment from "moment";
import * as React from "react";
import {
  ConnectDropTarget,
  DragSourceSpec,
  DropTarget,
  DropTargetCollector,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec
} from "react-dnd";
import {ConnectDragSource, DragSourceCollector, DragSourceConnector, DragSourceMonitor} from "react-dnd/lib/esm";
import DragSource from "react-dnd/lib/esm/DragSource";
import {Shift} from "../../Model/Shift/Shift";
import {ConnectedRotaTime} from './DnDConnectedRotaTime';

const DND_ROTA_TIME = 'DND_ROTA_TIME';
interface OwnProps {
  timePeriodIndex: number,
  shiftStartIndex: number,
  shiftEndIndex: number,
  isWorking: boolean,
  updateRota: (dragIndex: moment.Moment, dropIndex: moment.Moment) => void,
  shift: Shift,
}
interface DragCollectedProps {
  startIndex: number,
  shiftId: number,
  connectDragSource: ConnectDragSource,
}
interface DropCollectedProps {
  isOver: boolean;
  connectDropTarget: ConnectDropTarget;
}
interface DragObject {
  timePeriodIndex: number,
  shiftId: number,
}

class DnDRotaTimeComponent extends React.Component<OwnProps & DragCollectedProps & DropCollectedProps,{}> {
  public render () {
    return (
      <ConnectedRotaTime
        isWorking={this.props.isWorking}
        timePeriodIndex={this.props.timePeriodIndex}
        startPeriodIndex={this.props.startIndex}
        draggedShiftId={this.props.shiftId}
        isHovering={this.props.isOver}
        updateRota={this.props.updateRota}
        shift={this.props.shift}
        connectDragSource={this.props.connectDragSource}
        connectDropTarget={this.props.connectDropTarget}
        shiftStartIndex={this.props.shiftStartIndex}
        shiftEndIndex={this.props.shiftEndIndex}
      />
    );
  }
}

const dragSpec: DragSourceSpec<OwnProps, DragObject> = {
  beginDrag: (props: OwnProps, monitor: DragSourceMonitor): DragObject => {
    return {
      timePeriodIndex: props.timePeriodIndex,
      shiftId: props.shift.id !== undefined ? props.shift.id : -1
    };
  }
};
const dragCollect: DragSourceCollector<DragCollectedProps, OwnProps> =
  (connect: DragSourceConnector, monitor: DragSourceMonitor, targetProps: OwnProps): DragCollectedProps => {
    const dragObject: DragObject = monitor.getItem();
  return {
    startIndex: dragObject === null ? -1 : dragObject.timePeriodIndex,
    shiftId: dragObject === null ? -1 : dragObject.shiftId,
    connectDragSource: connect.dragSource(),
  };
};

const dropSpec: DropTargetSpec<OwnProps> = {
};
const dropCollect: DropTargetCollector<DropCollectedProps, OwnProps> =
  (connect: DropTargetConnector, monitor: DropTargetMonitor, targetProps: OwnProps): DropCollectedProps => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver()
    };
  };

export const DnDRotaTime =
  DropTarget<OwnProps, DropCollectedProps>
  (DND_ROTA_TIME, dropSpec, dropCollect)
  (DragSource<OwnProps, DragCollectedProps, DragObject>
    (DND_ROTA_TIME, dragSpec, dragCollect)
    (DnDRotaTimeComponent)
  );

