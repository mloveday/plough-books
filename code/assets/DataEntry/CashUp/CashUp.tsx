import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {ResetButton} from "../../Common/Buttons/ResetButton";
import {SaveButton} from "../../Common/Buttons/SaveButton";
import {DatePicker} from "../../Common/Nav/DatePicker";
import {Routes} from "../../Common/Routing/Routes";
import {CashUpEntity} from "../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../Model/CashUp/CashUpEntityTypes";
import {CashUpsForWeek} from "../../Model/CashUp/CashUpsForWeek";
import {CashUpSection} from "../../Model/Enum/CashUpSection";
import {Receipt} from "../../Model/Receipt/Receipt";
import {AppState} from "../../redux";
import {CashUpExternalState} from "../../Redux/CashUp/CashUpExternalState";
import {cashUpCreate, cashUpDataEntry, cashUpFetch} from "../../Redux/CashUp/CashUpRedux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {momentFromDate} from "../../Util/DateUtils";
import {currencyPattern, positiveCurrencyPattern} from "../../Util/Validation";
import './CashUp.scss';
import {CashUpCards} from "./Partials/CashUpCards";
import {CashUpDiscounts} from "./Partials/CashUpDiscounts";
import {CashUpSummary} from "./Partials/CashUpSummary";
import {CashUpTills} from "./Partials/CashUpTills";
import {SafeFloatDenom} from "./Partials/SafeFloatDenom";
import {sectionOrder} from "./State/AllSections";
import {SectionPosition} from "./State/SectionPosition";

interface CashUpOwnProps {
  match: match<{
    date: string
  }>;
}

interface CashUpLocalStateProps {
  cashUpExternalState: CashUpExternalState;
  cashUpsForWeek: CashUpsForWeek;
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: CashUpOwnProps): CashUpLocalStateProps => {
  return {
    cashUpExternalState: state.cashUpExternalState,
    cashUpsForWeek: state.cashUpLocalStates,
    uiState: state.uiState,
  }
};

interface CashUpDispatchProps {
  fetchCashUpForDate: (date: moment.Moment) => void;
  updateBackEnd: (state: CashUpEntity) => void;
  updateCashUpLocalState: (state: CashUpEntity[]) => void;
  updateUi: (state: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpOwnProps): CashUpDispatchProps => {
  return {
    fetchCashUpForDate: (date: moment.Moment) => dispatch(cashUpFetch(date)),
    updateBackEnd: (state: CashUpEntity) => dispatch(cashUpCreate(state)),
    updateCashUpLocalState: (state: CashUpEntity[]) => dispatch(cashUpDataEntry(state)),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  }
};

type CashUpProps = CashUpOwnProps & CashUpLocalStateProps & CashUpDispatchProps;

class CashUpComponent extends React.Component<CashUpProps, {}> {

  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    const sectionShown = this.props.uiState.cashUpSection;
    const currentSectionPosition = this.getSectionPosition();
    return (
      <div className='cash-up'>
        <DatePicker dateParam={this.props.match.params.date}
                    urlFromDate={(date: moment.Moment) => Routes.cashUpUrl(date)}/>

        <form className="form-wrapper">
          <div className="form-group">
            <h3 className="group-title summary_title">Summary</h3>
            <div className="label-and-input mod">
              <label htmlFor="mod">MOD</label>
              <input id="mod" type="text"
                     value={this.getCashUp().mod}
                     onChange={ev => this.formUpdate({mod: ev.target.value})}/>
            </div>
            <div className="label-and-input daily_notes">
              <label htmlFor="daily_notes">Daily notes</label>
              <textarea id="daily_notes"
                        value={this.getCashUp().dailyNotes}
                        onChange={ev => this.formUpdate({dailyNotes: ev.target.value})}/>
            </div>
            <SaveButton mini={false} clickFn={() => this.updateBackEnd()}/>
            <ResetButton mini={false} clickFn={() => this.revert()}>Reset</ResetButton>
          </div>

          <CashUpSummary cashUp={this.getCashUp()} />

          <ul className='cash-up-link-list'>
            {Array.from(sectionOrder.values()).map((sectionPosition, key) => (
              <li className='cash-up-link-item' key={key}>
                <button className={`cash-up-link-button${sectionPosition.section === currentSectionPosition.section ? ' selected' : ''}`} type="button" onClick={() => this.props.updateUi(this.props.uiState.withCashUpSection(sectionPosition.section))}>{sectionPosition.section}</button>
              </li>
            ))}
          </ul>

          {sectionShown === CashUpSection.TILLS && <CashUpTills cashUp={this.getCashUp()} formUpdate={obj => this.formUpdate(obj)} />}

          {sectionShown === CashUpSection.DISCOUNTS && <CashUpDiscounts cashUp={this.getCashUp()} formUpdate={obj => this.formUpdate(obj)} />}

          {sectionShown === CashUpSection.CARDS && <CashUpCards cashUp={this.getCashUp()} formUpdate={obj => this.formUpdate(obj)} />}

          {sectionShown === CashUpSection.RECEIPTS && <div className="form-group receipts">
            <h3 className="group-title receipts_label">Cash Receipts</h3>
            <button className='receipt_add_button' type='button' onClick={ev => {
              this.formUpdate({
                receipts: this.getCashUp().receipts
                  .map(r => r.clone())
                  .concat([Receipt.default()])
              });
            }}>+
            </button>
            {this.getCashUp().receipts.map(receipt => this.receiptInput(receipt))}
          </div>}

          {sectionShown === CashUpSection.SPEND_STAFF_PTS_COMO && <div className="form-group">
            <div className="label-and-input spend_staff_pts">
              <label htmlFor="spend_staff_points">Spend & staff points</label>
              <input id="spend_staff_points" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.spendStaffPts}
                     onChange={ev => this.formUpdate({spendStaffPts: ev.target.value})}/>
            </div>
            <div className="label-and-input como_disc_asset">
              <label htmlFor="como_disc_asset">COMO Discount asset</label>
              <input id="como_disc_asset" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.comoDiscAsset}
                     onChange={ev => this.formUpdate({comoDiscAsset: ev.target.value})}/>
            </div>
          </div>}

          {sectionShown === CashUpSection.NETT_TAKES && <div className="form-group">
            <h3 className="group-title nett_takes_label">Nett takes</h3>
            <div className="label-and-input take_dry">
              <label htmlFor="take_dry">Dry</label>
              <input id="take_dry" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.takeDry}
                     onChange={ev => this.formUpdate({takeDry: ev.target.value})}/>
            </div>
            <div className="label-and-input take_coffee">
              <label htmlFor="take_coffee">Coffee</label>
              <input id="take_coffee" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.takeCoffee}
                     onChange={ev => this.formUpdate({takeCoffee: ev.target.value})}/>
            </div>
            <div className="label-and-input take_gift_card">
              <label htmlFor="take_gift_card">Gift card</label>
              <input id="take_gift_card" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.takeGiftCard}
                     onChange={ev => this.formUpdate({takeGiftCard: ev.target.value})}/>
            </div>
            <div className="label-and-input take_deposit_paid">
              <label htmlFor="take_deposit_paid">Deposit paid</label>
              <input id="take_deposit_paid" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.takeDepositPaid}
                     onChange={ev => this.formUpdate({takeDepositPaid: ev.target.value})}/>
            </div>
          </div>}

          {sectionShown === CashUpSection.BANKING && <div className="form-group">
            <h3 className="group-title banking_label">Banking</h3>
            <div className="label-and-input paid_out_amnt">
              <label htmlFor="paid_out_amnt">Paid out</label>
              <input id="paid_out_amnt" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.paidOutAmount}
                     onChange={ev => this.formUpdate({paidOutAmount: ev.target.value})}/>
            </div>
            <div className="label-and-input paid_out_to">
              <label htmlFor="paid_out_to">Paid out to</label>
              <input id="paid_out_to" type="text"
                     value={this.getCashUp().paidOutTo}
                     onChange={ev => this.formUpdate({paidOutTo: ev.target.value})}/>
            </div>
            <div className="label-and-input banked">
              <label htmlFor="banked">Banked</label>
              <input id="banked" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.banked}
                     onChange={ev => this.formUpdate({banked: ev.target.value})}/>
            </div>
            <div className="label-and-input cash_advantage_bag">
              <label htmlFor="cash_advantage_bag">Cash advantage bag</label>
              <input id="cash_advantage_bag" type="text"
                     value={this.getCashUp().cashAdvantageBag}
                     onChange={ev => this.formUpdate({cashAdvantageBag: ev.target.value})}/>
            </div>
            <div className="label-and-input cash_advantage_bag_seen_by">
              <label htmlFor="cash_advantage_bag_seen_by">Seen by</label>
              <input id="cash_advantage_bag_seen_by" type="text"
                     value={this.getCashUp().cashAdvantageBagSeenBy}
                     onChange={ev => this.formUpdate({cashAdvantageBagSeenBy: ev.target.value})}/>
            </div>
            <div className="label-and-input paypal">
              <label htmlFor="paypal">Paypal</label>
              <input id="paypal" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.paypal}
                     onChange={ev => this.formUpdate({paypal: ev.target.value})}/>
            </div>
            <div className="label-and-input deliveroo">
              <label htmlFor="deliveroo">Deliveroo</label>
              <input id="deliveroo" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.deliveroo}
                     onChange={ev => this.formUpdate({deliveroo: ev.target.value})}/>
            </div>
          </div>}

          {sectionShown === CashUpSection.SAFE_FLOAT && <div className="form-group safe-float">
            <h3 className="group-title safe_float_label">Safe float denom</h3>
            <SafeFloatDenom cashUpPropName='sfdAm' formUpdate={obj => this.formUpdate(obj)} friendlyTimeName="AM"
                            safeFloatObj={this.getCashUp().sfdAm}/>
            <SafeFloatDenom cashUpPropName='sfdPm' formUpdate={obj => this.formUpdate(obj)} friendlyTimeName="PM"
                            safeFloatObj={this.getCashUp().sfdPm}/>
            <div className="label-and-input safe_float_notes">
              <label htmlFor="sfd_notes">Notes</label>
              <input id="sfd_notes" type="text"
                     value={this.getCashUp().sfdNotes}
                     onChange={ev => this.formUpdate({sfdNotes: ev.target.value})}/>
            </div>
          </div>}

          {sectionShown === CashUpSection.SUMMARY && <div className="form-group">
            <h3 className="group-title summary_label">Summary</h3>
            <div className="label-and-input pub_secured_by">
              <label htmlFor="pub_secured_by">Pub secured by</label>
              <input id="pub_secured_by" type="text"
                     value={this.getCashUp().pubSecuredBy}
                     onChange={ev => this.formUpdate({pubSecuredBy: ev.target.value})}/>
            </div>
            <div className="label-and-input bar_closed_by">
              <label htmlFor="bar_closed_by">Bar closed by</label>
              <input id="bar_closed_by" type="text"
                     value={this.getCashUp().barClosedBy}
                     onChange={ev => this.formUpdate({barClosedBy: ev.target.value})}/>
            </div>
            <div className="label-and-input floor_closed_by">
              <label htmlFor="floor_closed_by">Floor closed by</label>
              <input id="floor_closed_by" type="text"
                     value={this.getCashUp().floorClosedBy}
                     onChange={ev => this.formUpdate({floorClosedBy: ev.target.value})}/>
            </div>
            <div className="label-and-input next_door_by">
              <label htmlFor="next_door_by">Next door by</label>
              <input id="next_door_by" type="text"
                     value={this.getCashUp().nextDoorBy}
                     onChange={ev => this.formUpdate({nextDoorBy: ev.target.value})}/>
            </div>
          </div>}

        </form>
      </div>
    )
  }

  private getCashUp(): CashUpEntity {
    return this.props.cashUpsForWeek.getCashUpForDay(momentFromDate(this.props.match.params.date));
  }

  private maintainStateWithUrl() {
    const paramDate = momentFromDate(this.props.match.params.date);
    if (this.props.uiState.isCurrentDateSameAs(paramDate)) {
      this.props.updateUi(this.props.uiState.withCurrentDate(paramDate));
      return;
    }
    if (this.props.cashUpExternalState.isEmpty()
      || (this.props.cashUpExternalState.cashUpsForWeek && this.props.cashUpExternalState.isLoaded() && this.props.cashUpExternalState.shouldLoadForDate(paramDate))
    ) {
      this.props.fetchCashUpForDate(paramDate);
      return;
    }
  }

  private updateBackEnd() {
    this.props.updateBackEnd(this.getCashUp());
  }

  private revert() {
    this.props.updateCashUpLocalState(
      this.props.cashUpExternalState.cashUpsForWeek.cashUps
    );
  }

  private receiptInput(receipt: Receipt) {
    const identifier = receipt.id ? receipt.id : receipt.timestamp;
    return (
      <div className={`receipt${receipt.inputs.isOutgoing ? ' outgoing' : ' incoming'}`} key={identifier}>
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

  private formUpdate(obj: CashUpEntityUpdateType) {
    this.props.updateCashUpLocalState(
      [this.getCashUp().with(obj)]
    );
  }

  private updateReceipt(receipt: Receipt) {
    const clonedReceipts = this.getCashUp().receipts
      .map(existingReceipt => (receipt.id ? (existingReceipt.id === receipt.id) : existingReceipt.timestamp === receipt.timestamp) ? receipt : existingReceipt.clone());
    this.formUpdate({receipts: clonedReceipts});
  }

  private getSectionPosition(): SectionPosition {
    if (sectionOrder.has(this.props.uiState.cashUpSection)) {
      // @ts-ignore
      return sectionOrder.get(this.props.uiState.cashUpSection);
    }
    return new SectionPosition(CashUpSection.TILLS, CashUpSection.SUMMARY, CashUpSection.DISCOUNTS);
  }
}

export const CashUp = connect<CashUpLocalStateProps, CashUpDispatchProps, CashUpOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpComponent);
