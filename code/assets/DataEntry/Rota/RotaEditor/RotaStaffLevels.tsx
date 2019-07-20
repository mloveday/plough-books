import * as React from "react";
import {connect} from "react-redux";
import {WorkType, WorkTypes} from "../../../Model/Enum/WorkTypes";
import {RotaEntity} from "../../../Model/Rota/RotaEntity";
import {RotaUpdateType} from "../../../Model/Rota/RotaTypes";
import {AppState} from "../../../redux";
import {DateFormats} from "../../../Util/DateFormats";
import {getTimePeriods} from "../../../Util/DateUtils";
import {integerPattern} from "../../../Util/Validation";

interface RotaStaffLevelsOwnProps {
  rota: RotaEntity;
  workType: WorkType;
  formUpdate: (obj: RotaUpdateType) => void;
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
        <div className="staff-level labels">
          <div className={`staff-level-required`}>Req</div>
          <div className={`staff-level-mod`}>Mod</div>
          <div className={`staff-level-diff`}>Diff</div>
        </div>
        {timePeriods.map((timePeriod, index) => {
          const numberWorking = this.props.rota.getPlannedNumberWorkingAtTime(timePeriod.format(DateFormats.TIME_LEADING_ZERO), this.props.workType);
          const numberRequired = (this.props.workType === WorkTypes.BAR ? this.props.rota.barRotaTemplate : this.props.rota.kitchenRotaTemplate).staffLevels[index];
          const numberDiff = numberWorking - numberRequired - this.props.rota.staffLevelModifiers[index];
          const stylingClass = numberDiff === 0 ? 'staff-good' : (numberDiff < -2 ? 'staff-short' : (numberDiff < 0 ? 'staff-under' : (numberDiff === 1 ? 'staff-ok' : (numberDiff === 2 ? 'staff-mediocre' : 'staff-poor'))));
          return <div className={`staff-level ${stylingClass}`} key={index}>
            <div className={`staff-level-required`}>{numberRequired}</div>
            <div className={`staff-level-mod`}>
              <input className="staff-level-mod-input" type={`tel`} pattern={integerPattern} value={this.props.rota.inputs.staffLevelModifiers[index]}
               onChange={ev => this.props.formUpdate({staffLevelModifiers: this.props.rota.inputs.staffLevelModifiers.map((slm, i) => index === i ? ev.target.value : slm)})}/>
            </div>
            <div className={`staff-level-diff`}>{numberDiff}</div>
          </div>
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
