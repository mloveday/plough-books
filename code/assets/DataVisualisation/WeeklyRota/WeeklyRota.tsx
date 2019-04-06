import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {RotaExternalState} from "../../Redux/Rota/RotaExternalState";
import {rotaFetch} from "../../Redux/Rota/RotaRedux";
import {StaffMember} from '../../Model/StaffMember/StaffMember';
import {StaffRole} from "../../Model/StaffRole/StaffRole";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {AppState} from "../../redux";
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
      .forEach(rota => rota.plannedShifts
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
        <div>Weekly bar rota for week starting {this.getStartOfWeek().format(DateFormats.READABLE_WITH_YEAR)}</div>
        <RotaGridComponent staff={barStaff} rotas={rotas} roles={sortedRoles}/>
        <div>Weekly kitchen rota for week starting {this.getStartOfWeek().format(DateFormats.READABLE_WITH_YEAR)}</div>
        <RotaGridComponent staff={kitchenStaff} rotas={rotas}  roles={sortedRoles}/>
      </div>
    )
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
      this.props.fetchRotaForDate(moment.utc(paramDate));
      return;
    }
  }
}

export const WeeklyRota = connect<WeeklyRotaStateProps, WeeklyRotaDispatchProps, WeeklyRotaOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyRotaComponent);