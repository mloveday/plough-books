import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {Receipt} from "../../../Model/Receipt/Receipt";
import {AppState} from "../../../redux";
import {positiveCurrencyPattern} from "../../../Util/Validation";

interface CashUpReceiptsOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpReceiptsStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpReceiptsOwnProps): CashUpReceiptsStateProps => {
  return {}
};

interface CashUpReceiptsDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpReceiptsOwnProps): CashUpReceiptsDispatchProps => {
  return {};
};

type CashUpReceiptsProps = CashUpReceiptsOwnProps & CashUpReceiptsStateProps & CashUpReceiptsDispatchProps;

class CashUpReceiptsComponent extends React.Component<CashUpReceiptsProps, {}> {
  public render() {
    return (
      <div className="form-group receipts">
        <h3 className="group-title receipts_label">Petty Cash</h3>
        <button className='receipt_add_button' type='button' onClick={ev => {
          this.props.formUpdate({
            receipts: this.props.cashUp.receipts
              .map(r => r.clone())
              .concat([Receipt.default()])
          });
        }}>+
        </button>
        {this.props.cashUp.receipts.map(receipt => this.receiptInput(receipt))}
      </div>
    )
  }

  private receiptInput(receipt: Receipt) {
    const identifier = receipt.id ? receipt.id : receipt.timestamp;
    return (
      <div className={`receipt${receipt.inputs.isOutgoing ? ' outgoing' : ' incoming'}`} key={identifier}>
        <button className={`delete-item`} onClick={() => this.deleteReceipt(receipt)}>
          <FontAwesomeIcon icon="trash"/>
        </button>
        <div className="label-and-input receipt_desc">
          <label htmlFor={`receipt_desc_${identifier}`}>Description</label>
          <input id={`receipt_desc_${identifier}`} type="text"
                 value={receipt.inputs.description}
                 onChange={ev => this.updateReceipt(receipt.with({description: ev.target.value}))}/>
        </div>
        <div className="label-and-input receipt_amnt">
          <label htmlFor={`receipt_amnt_${identifier}`}>Amount</label>
          <input id={`receipt_amnt_${identifier}`} type="text" pattern={positiveCurrencyPattern}
                 value={receipt.inputs.amount}
                 onChange={ev => this.updateReceipt(receipt.with({amount: ev.target.value}))}/>
        </div>
        <div className="label-and-input receipt_amnt">
          <label htmlFor={`receipt_outgoing_${identifier}_outgoing`}>Outgoing</label>
          <input id={`receipt_outgoing_${identifier}_outgoing`} type="radio" name={`receipt_outgoing_${identifier}`}
                 checked={receipt.inputs.isOutgoing} value={'outgoing'}
                 onChange={ev => {this.updateReceipt(receipt.with({isOutgoing: ev.target.value === 'outgoing'}))}}/>
          <label htmlFor={`receipt_outgoing_${identifier}_incoming`}>Incoming</label>
          <input id={`receipt_outgoing_${identifier}_incoming`} type="radio" name={`receipt_outgoing_${identifier}`}
                 checked={!receipt.inputs.isOutgoing} value={'incoming'}
                 onChange={ev => {this.updateReceipt(receipt.with({isOutgoing: ev.target.value === 'outgoing'}))}}/>
        </div>
      </div>
    )
  }

  private updateReceipt(receipt: Receipt) {
    const clonedReceipts = this.props.cashUp.receipts
      .map(existingReceipt => (receipt.id ? (existingReceipt.id === receipt.id) : existingReceipt.timestamp === receipt.timestamp) ? receipt : existingReceipt.clone());
    this.props.formUpdate({receipts: clonedReceipts});
  }

  private deleteReceipt(receipt: Receipt) {
    const clonedReceipts = this.props.cashUp.receipts
      .filter(existingReceipt => (receipt.id ? (existingReceipt.id !== receipt.id) : existingReceipt.timestamp !== receipt.timestamp));
    this.props.formUpdate({receipts: clonedReceipts});
  }
}

export const CashUpReceipts = connect<CashUpReceiptsStateProps, CashUpReceiptsDispatchProps, CashUpReceiptsOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpReceiptsComponent);
