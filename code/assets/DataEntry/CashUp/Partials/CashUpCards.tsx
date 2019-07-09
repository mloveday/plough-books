import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {AppState} from "../../../redux";
import {currencyPattern} from "../../../Util/Validation";

interface CashUpCardsOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpCardsStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpCardsOwnProps): CashUpCardsStateProps => {
  return {}
};

interface CashUpCardsDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpCardsOwnProps): CashUpCardsDispatchProps => {
  return {};
};

type CashUpCardsProps = CashUpCardsOwnProps & CashUpCardsStateProps & CashUpCardsDispatchProps;

class CashUpCardsComponent extends React.Component<CashUpCardsProps, {}> {
  public render() {
    return (
      <div className="form-group">
        <h3 className="group-title credit_card_label">Credit card totals</h3>
        <div className="label-and-input amex_tots">
          <label htmlFor="amex_tots">AMEX total</label>
          <input id="amex_tots" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.amexTots}
                 onChange={ev => this.props.formUpdate({amexTots: ev.target.value})}/>
        </div>
        <div className="label-and-input visa_mc_tots">
          <label htmlFor="visa_mc_tots">VISA/MC total</label>
          <input id="visa_mc_tots" type="text" pattern={currencyPattern}
                 value={this.props.cashUp.inputs.visaMcTots}
                 onChange={ev => this.props.formUpdate({visaMcTots: ev.target.value})}/>
        </div>
      </div>
    )
  }
}

export const CashUpCards = connect<CashUpCardsStateProps, CashUpCardsDispatchProps, CashUpCardsOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpCardsComponent);
