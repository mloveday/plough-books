import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {ShiftRecordingType, ShiftRecordingTypes} from "../../Model/Enum/ShiftRecordingType";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {RotaEntity} from "../../Model/Rota/RotaEntity";
import {Shift} from "../../Model/Shift/Shift";
import {StaffMember} from '../../Model/StaffMember/StaffMember';
import {StaffRole} from "../../Model/StaffRole/StaffRole";
import {AppState} from "../../redux";
import {RotaExternalState} from "../../Redux/Rota/RotaExternalState";
import {rotaFetch} from "../../Redux/Rota/RotaRedux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {DateFormats} from "../../Util/DateFormats";
import {startOfWeek} from "../../Util/DateUtils";
import {RotaGridComponent} from "./RotaGrid";
import "./WeeklyRota.scss";

interface WeeklyRotaOwnProps {
  match: match<{
    weekNumber: string,
    year: string,
  }>;
  shiftRecordingType: ShiftRecordingType;
}

interface WeeklyRotaStateProps {
  rotaExternalState: RotaExternalState;
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: WeeklyRotaOwnProps): WeeklyRotaStateProps => {
  return {
    rotaExternalState: state.rotaExternalState,
    uiState: state.uiState,
  }
};

interface WeeklyRotaDispatchProps {
  fetchRotaForDate: (date: moment.Moment) => void,
  updateUi: (state: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyRotaOwnProps): WeeklyRotaDispatchProps => {
  return {
    fetchRotaForDate: (date: moment.Moment) => dispatch(rotaFetch(date)),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  };
};

type WeeklyRotaProps = WeeklyRotaOwnProps & WeeklyRotaStateProps & WeeklyRotaDispatchProps;

class WeeklyRotaComponent extends React.Component<WeeklyRotaProps, {}> {
  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    if (!this.props.rotaExternalState.isLoaded()) {
      return null;
    }

    const startOfThisWeek = this.getStartOfWeek();
    const allStaff = new Map<number, StaffMember>();
    this.props.rotaExternalState.rotasForWeek.getRotasForWeek(startOfThisWeek)
      .forEach(rota => this.getShifts(rota)
        .forEach(shift => {
          if (!allStaff.has(shift.staffMember.entityId)) {
            allStaff.set(shift.staffMember.entityId, shift.staffMember);
          }
        })
      );
    const barStaff = Array.from(allStaff.values())
      .filter(staffMember => staffMember.role.type === WorkTypes.BAR)
      .sort((a,b) => a.role.orderInRota > b.role.orderInRota ? 1 : (a.name > b.name ? 1 : -1));
    const kitchenStaff = Array.from(allStaff.values())
      .filter(staffMember => staffMember.role.type === WorkTypes.KITCHEN);
    const ancillaryStaff = Array.from(allStaff.values())
      .filter(staffMember => staffMember.role.type === WorkTypes.ANCILLARY);

    const visibleRoles: StaffRole[] = [];
    allStaff.forEach(member => {
      if (member.isActive() && visibleRoles.find(role => member.role.entityId === role.entityId) === undefined) {
        visibleRoles.push(member.role);
      }
    });
    const sortedRoles = visibleRoles.sort((a, b) => a.orderInRota > b.orderInRota ? 1 : -1);

    const rotas = this.props.rotaExternalState.rotasForWeek.getRotasForWeek(startOfThisWeek);

    return (
      <div className="weekly-rota">
        <div>Weekly bar {this.getName()} for week starting {this.getStartOfWeek().format(DateFormats.READABLE_WITH_YEAR)}</div>
        <RotaGridComponent staff={barStaff} rotas={rotas} roles={sortedRoles} shiftRecordingType={this.props.shiftRecordingType}/>
        <div>Weekly kitchen {this.getName()} for week starting {this.getStartOfWeek().format(DateFormats.READABLE_WITH_YEAR)}</div>
        <RotaGridComponent staff={kitchenStaff} rotas={rotas}  roles={sortedRoles} shiftRecordingType={this.props.shiftRecordingType}/>
        <div>Weekly ancillary {this.getName()} for week starting {this.getStartOfWeek().format(DateFormats.READABLE_WITH_YEAR)}</div>
        <RotaGridComponent staff={ancillaryStaff} rotas={rotas}  roles={sortedRoles} shiftRecordingType={this.props.shiftRecordingType}/>
      </div>
    )
  }

  private getName():string {
    return this.props.shiftRecordingType === ShiftRecordingTypes.ROTA ? 'rota' : 'sign in'
  }

  private getShifts(rota: RotaEntity): Shift[] {
    return this.props.shiftRecordingType === ShiftRecordingTypes.ROTA ? rota.plannedShifts : rota.actualShifts;
  }

  private getStartOfWeek() {
    return startOfWeek(Number(this.props.match.params.year), Number(this.props.match.params.weekNumber))
  }

  private maintainStateWithUrl() {
    const paramDate = this.getStartOfWeek();
    if (this.props.uiState.isCurrentDateSameAs(paramDate)) {
      this.props.updateUi(this.props.uiState.withCurrentDate(paramDate));
      return;
    }
    if (this.props.rotaExternalState.shouldLoadForDate(paramDate)) {
      this.props.fetchRotaForDate(paramDate);
      return;
    }
  }
}

export const WeeklyRota = connect<WeeklyRotaStateProps, WeeklyRotaDispatchProps, WeeklyRotaOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyRotaComponent);