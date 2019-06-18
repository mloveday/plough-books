import * as React from "react";
import {connect} from "react-redux";
import {WorkType, WorkTypes} from "../../../Model/Enum/WorkTypes";
import {RotaEntity} from "../../../Model/Rota/RotaEntity";
import {AppState} from "../../../redux";
import {DateFormats} from "../../../Util/DateFormats";
import {getTimePeriods} from "../../../Util/DateUtils";

interface RotaStaffLevelsOwnProps {
  rota: RotaEntity;
  workType: WorkType;
}

interface RotaStaffLevelsStateProps {
}

const mapStateToProps = (state: AppState, ownProps: RotaStaffLevelsOwnProps): RotaStaffLevelsStateProps => {
  return {}
};

interface RotaStaffLevelsDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: RotaStaffLevelsOwnProps): RotaStaffLevelsDispatchProps => {
  return {};
};

type RotaStaffLevelsProps = RotaStaffLevelsOwnProps & RotaStaffLevelsStateProps & RotaStaffLevelsDispatchProps;

class RotaStaffLevelsComponent extends React.Component<RotaStaffLevelsProps, {}> {
  public render() {
    const timePeriods = getTimePeriods(this.props.rota.date);
    return (
      <div className="rota-staff-levels">
        <div className="rota-header rota-staff-name"/>
        <div className="rota-header rota-remove-shift"/>
        <div className="rota-header rota-off-floor"/>
        <div className="rota-header rota-start-time"/>
        <div className="rota-header rota-end-time"/>
        <div className="rota-header rota-breaks"/>
        <div className="rota-header rota-rate"/>
        {timePeriods.map((timePeriod, timeKey) => {
          const numberWorking = this.props.rota.getPlannedNumberWorkingAtTime(timePeriod.format(DateFormats.TIME_LEADING_ZERO), this.props.workType);
          const numberRequired = (this.props.workType === WorkTypes.BAR ? this.props.rota.barRotaTemplate : this.props.rota.kitchenRotaTemplate).staffLevels[timeKey];
          const numberLeft = numberRequired - numberWorking;
          const stylingClass = numberLeft <= 0 ? 'staff-good' : (numberLeft === 1 ? 'staff-ok' : (numberLeft === 2 ? 'staff-mediocre' : 'staff-poor'));
          return <div className={`rota-time staff-level ${stylingClass}`} key={timeKey}>{numberLeft}</div>
        })}
        <div className={`rota-header rota-rate`}/>
      </div>
    )
  }
}

export const RotaStaffLevels = connect<RotaStaffLevelsStateProps, RotaStaffLevelsDispatchProps, RotaStaffLevelsOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RotaStaffLevelsComponent);
