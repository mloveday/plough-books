import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {connect} from "react-redux";
import {CashUpExternalState} from "../../DataEntry/CashUp/State/CashUpExternalState";
import {ConstantsExternalState} from "../../DataEntry/Constants/State/ConstantsExternalState";
import {RolesExternalState} from "../../DataEntry/Role/State/RolesExternalState";
import {RotaExternalState} from "../../DataEntry/Rota/State/RotaExternalState";
import {StaffMembersExternalState} from "../../DataEntry/StaffMembers/State/StaffMembersExternalState";
import {StaffRolesExternalState} from "../../DataEntry/StaffRoles/State/StaffRolesExternalState";
import {UsersExternalState} from "../../DataEntry/User/State/UsersExternalState";
import {FetchStatus} from "../../Enum/FetchStatus";
import {AppState} from "../../redux";
import {StatusItem} from "./State/StatusItem";
import './Status.scss';

interface StatusOwnProps {
}

interface StatusStateProps {
  cashUp: CashUpExternalState,
  constants: ConstantsExternalState,
  rota: RotaExternalState,
  staffMembers: StaffMembersExternalState,
  staffRoles: StaffRolesExternalState,
  users: UsersExternalState,
  userRoles: RolesExternalState,
}

const mapStateToProps = (state: AppState, ownProps: StatusOwnProps): StatusStateProps => {
  return {
    cashUp: state.cashUpExternalState,
    constants: state.constantsExternalState,
    rota: state.rotaExternalState,
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
    return <div className={`status ${statusItem.status}`} key={key}>Fetching {statusItem.state} ({statusItem.key}): {statusItem.status}</div>;
  }

  private getAllStatuses(): StatusItem[] {
    const statuses: StatusItem[] = [];
    this.props.cashUp.states.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Cash up', key, fetchStatus));
    });
    this.props.constants.states.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Constants', key, fetchStatus));
    });
    this.props.rota.states.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Rota', key, fetchStatus));
    });
    this.props.staffMembers.states.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Staff Members', key, fetchStatus));
    });
    this.props.staffRoles.states.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Staff Roles', key, fetchStatus));
    });
    this.props.users.states.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('Users', key, fetchStatus));
    });
    this.props.userRoles.states.forEach((fetchStatus, key) => {
      statuses.push(new StatusItem('User Roles', key, fetchStatus));
    });
    return statuses;
  }
}

export const Status = connect<StatusStateProps, StatusDispatchProps, StatusOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(StatusComponent);
