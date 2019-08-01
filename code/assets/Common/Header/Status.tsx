import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {connect} from "react-redux";
import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {AppState} from "../../redux";
import {CashUpExternalState} from "../../Redux/CashUp/CashUpExternalState";
import {ConstantsExternalState} from "../../Redux/Constants/ConstantsExternalState";
import {ExternalState} from "../../Redux/ExternalState";
import {HolidayExternalState} from "../../Redux/Holiday/HolidayExternalState";
import {RotaExternalState} from "../../Redux/Rota/RotaExternalState";
import {RotaStaffingTemplatesExternalState} from "../../Redux/RotaStaffingTemplates/RotaStaffingTemplatesExternalState";
import {StaffMembersExternalState} from "../../Redux/StaffMember/StaffMembersExternalState";
import {StaffRolesExternalState} from "../../Redux/StaffRole/StaffRolesExternalState";
import {UsersExternalState} from "../../Redux/User/UsersExternalState";
import {UserRolesExternalState} from "../../Redux/UserRole/UserRolesExternalState";
import {StatusItem} from "./State/StatusItem";
import './Status.scss';

interface StatusOwnProps {
}

interface StatusStateProps {
  cashUp: CashUpExternalState,
  constants: ConstantsExternalState,
  holidays: HolidayExternalState,
  rota: RotaExternalState,
  rotaStaffingTemplates: RotaStaffingTemplatesExternalState,
  staffMembers: StaffMembersExternalState,
  staffRoles: StaffRolesExternalState,
  users: UsersExternalState,
  userRoles: UserRolesExternalState,
}

const mapStateToProps = (state: AppState, ownProps: StatusOwnProps): StatusStateProps => {
  return {
    cashUp: state.cashUpExternalState,
    constants: state.constantsExternalState,
    holidays: state.holidayExternalState,
    rota: state.rotaExternalState,
    rotaStaffingTemplates: state.rotaStaffingTemplatesExternalState,
    staffMembers: state.staffMembersExternalState,
    staffRoles: state.staffRolesExternalState,
    users: state.usersExternalState,
    userRoles: state.rolesExternalState,
  }
};

interface StatusDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: StatusOwnProps): StatusDispatchProps => {
  return {};
};

type StatusProps = StatusOwnProps & StatusStateProps & StatusDispatchProps;

class StatusComponent extends React.Component<StatusProps, {}> {
  public render() {
    const statusItems = this.getAllStatuses();
    const errorStatuses = statusItems.filter(s => s.status === FetchStatus.ERROR);
    const pendingStatuses = statusItems.filter(s => s.status === FetchStatus.STARTED);
    return (
      <div className={'status-bar'}>
        <div className={`summary`}>
          {errorStatuses.length !== 0 && `Something's wrong`}
          {errorStatuses.length === 0 && pendingStatuses.length === 0 && ` Everything's fine` || ` Working on it...`}
        </div>
        <div className={`icon`}>
          {errorStatuses.length === 0 && pendingStatuses.length === 0 && <FontAwesomeIcon icon="thumbs-up" />}
          {errorStatuses.length === 0 && pendingStatuses.length !== 0 && <FontAwesomeIcon icon="wine-glass" className='fa-spin' /> }
          {errorStatuses.length !== 0 && <FontAwesomeIcon icon="skull-crossbones" />}
        </div>
        <div className={`status-list`}>
        {errorStatuses.map((statusItem, key) => this.renderStatus(statusItem, key))}
        {pendingStatuses.map((statusItem, key) => this.renderStatus(statusItem, key))}
        </div>
        <div className={'all-statuses'}>
          {statusItems.map((statusItem, key) => this.renderStatus(statusItem, key))}
        </div>
      </div>
    )
  }

  private renderStatus(statusItem: StatusItem, key: any) {
    if (statusItem.key === ExternalState.DEFAULT_KEY) {
      return <div className={`status ${statusItem.status}`} key={key}>{statusItem.method === 'get' ? 'Fetching' : 'Saving'} {statusItem.state}: {statusItem.status}</div>;
    }
    return <div className={`status ${statusItem.status}`} key={key}>{statusItem.method === 'get' ? 'Fetching' : 'Saving'} {statusItem.state} ({statusItem.key}): {statusItem.status}</div>;
  }

  private getAllStatuses(): StatusItem[] {
    const statuses: StatusItem[] = [];
    this.props.cashUp.fetchStates.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Cash up', fetchStatus.key, fetchStatus.fetchStatus, fetchStatus.method));
    });
    this.props.constants.fetchStates.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Constants', fetchStatus.key, fetchStatus.fetchStatus, fetchStatus.method));
    });
    this.props.holidays.fetchStates.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Holidays', fetchStatus.key, fetchStatus.fetchStatus, fetchStatus.method));
    });
    this.props.rota.fetchStates.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Rota', fetchStatus.key, fetchStatus.fetchStatus, fetchStatus.method));
    });
    this.props.rotaStaffingTemplates.fetchStates.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Rota Staffing Templates', fetchStatus.key, fetchStatus.fetchStatus, fetchStatus.method));
    });
    this.props.staffMembers.fetchStates.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Staff Members', fetchStatus.key, fetchStatus.fetchStatus, fetchStatus.method));
    });
    this.props.staffRoles.fetchStates.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Staff Roles', fetchStatus.key, fetchStatus.fetchStatus, fetchStatus.method));
    });
    this.props.users.fetchStates.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Users', fetchStatus.key, fetchStatus.fetchStatus, fetchStatus.method));
    });
    this.props.userRoles.fetchStates.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('User Roles', fetchStatus.key, fetchStatus.fetchStatus, fetchStatus.method));
    });
    return statuses;
  }
}

export const Status = connect<StatusStateProps, StatusDispatchProps, StatusOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(StatusComponent);
