import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {AppState} from "../../../redux";

interface CashUpSecurityOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpSecurityStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpSecurityOwnProps): CashUpSecurityStateProps => {
  return {}
};

interface CashUpSecurityDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpSecurityOwnProps): CashUpSecurityDispatchProps => {
  return {};
};

type CashUpSecurityProps = CashUpSecurityOwnProps & CashUpSecurityStateProps & CashUpSecurityDispatchProps;

class CashUpSecurityComponent extends React.Component<CashUpSecurityProps, {}> {
  public render() {
    return (
      <div className="form-group">
        <h3 className="group-title summary_label">Security</h3>
        <div className="label-and-input pub_secured_by">
          <label htmlFor="pub_secured_by">Pub secured by</label>
          <input id="pub_secured_by" type="text"
                 value={this.props.cashUp.pubSecuredBy}
                 onChange={ev => this.props.formUpdate({pubSecuredBy: ev.target.value})}/>
        </div>
        <div className="label-and-input bar_closed_by">
          <label htmlFor="bar_closed_by">Bar closed by</label>
          <input id="bar_closed_by" type="text"
                 value={this.props.cashUp.barClosedBy}
                 onChange={ev => this.props.formUpdate({barClosedBy: ev.target.value})}/>
        </div>
        <div className="label-and-input floor_closed_by">
          <label htmlFor="floor_closed_by">Floor closed by</label>
          <input id="floor_closed_by" type="text"
                 value={this.props.cashUp.floorClosedBy}
                 onChange={ev => this.props.formUpdate({floorClosedBy: ev.target.value})}/>
        </div>
        <div className="label-and-input next_door_by">
          <label htmlFor="next_door_by">Next door by</label>
          <input id="next_door_by" type="text"
                 value={this.props.cashUp.nextDoorBy}
                 onChange={ev => this.props.formUpdate({nextDoorBy: ev.target.value})}/>
        </div>
      </div>
    )
  }
}

export const CashUpSecurity = connect<CashUpSecurityStateProps, CashUpSecurityDispatchProps, CashUpSecurityOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpSecurityComponent);
