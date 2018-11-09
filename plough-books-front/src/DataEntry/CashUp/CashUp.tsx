import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {AppState} from "../../redux";
import {validateCash} from "../../Util/Validation";
import './CashUp.css';
import {DatePicker} from "./DatePicker";
import {SafeFloatDenom} from "./SafeFloatDenom";
import {CashUpExternalState} from "./State/CashUpExternalState";
import {CashUpLocalState} from "./State/CashUpLocalState";
import {cashUpCreate, cashUpDataEntry, cashUpFetch} from "./State/CashUpRedux";
import {Receipt} from "./State/Receipt";
import {TillInputGroup} from "./TillInputGroup";

interface CashUpOwnProps {
  match: match<{
    date: string
  }>;
}

interface CashUpLocalStateProps {
  cashUpExternalState: CashUpExternalState;
  cashUpLocalState: CashUpLocalState;
}

const mapStateToProps = (state: AppState, ownProps: CashUpOwnProps): CashUpLocalStateProps => {
  return {
    cashUpExternalState: state.cashUpExternalState,
    cashUpLocalState: state.cashUpLocalState,
  }
};

interface CashUpDispatchProps {
  fetchCashUpForDate: (date: moment.Moment) => void;
  updateBackEnd: (state: CashUpLocalState) => void;
  updateCashUpLocalState: (state: CashUpLocalState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpOwnProps): CashUpDispatchProps => {
  return {
    fetchCashUpForDate: (date: moment.Moment) => dispatch(cashUpFetch(date)),
    updateBackEnd: (state: CashUpLocalState) => dispatch(cashUpCreate(state)),
    updateCashUpLocalState: (state: CashUpLocalState) => dispatch(cashUpDataEntry(state)),
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
    return (
      <form className="form-wrapper">
        <DatePicker dateParam={this.props.match.params.date} />
        <h3 className="group-title summary_title">Summary</h3>
        <div className="label-and-input mod">
          <label htmlFor="mod">MOD</label>
          <input id="mod" type="text"
                 value={this.props.cashUpLocalState.mod}
                 onChange={ev => this.formUpdate({mod: ev.target.value})} />
        </div>
        <div className="label-and-input daily_notes">
          <label htmlFor="daily_notes">Daily notes</label>
          <textarea id="daily_notes"
                    value={this.props.cashUpLocalState.dailyNotes}
                    onChange={ev => this.formUpdate({dailyNotes: ev.target.value})} />
        </div>

        <div className="till-labels">
          <div className="till-label">1</div>
          <div className="till-label">2</div>
          <div className="till-label">3</div>
          <div className="till-label">4</div>
          <div className="till-label">5</div>
          <div className="till-label">6</div>
          <div className="till-label">7</div>
        </div>

        <h3 className="group-title till_float_title">Till float</h3>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'Till float'} groupIdentifier={'till_float_tills'} tillProperty={'float'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label amex_label">AMEX</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'amex'} groupIdentifier={'amex_tills'} tillProperty={'amex'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label visa_label">VISA</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'visa'} groupIdentifier={'visa_tills'} tillProperty={'visa'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label charge_deposit_label">Charge & deposit</h4>
        <div className="label-and-input charge_to_ac">
          <label htmlFor="charge_to_ac">Charge to account</label>
          <input id="charge_to_ac" type="number"
                 value={this.props.cashUpLocalState.chargeToAccount}
                 onChange={ev => this.formUpdate({chargeToAccount: validateCash(ev.target.value, this.props.cashUpLocalState.chargeToAccount)})} />
        </div>
        <div className="label-and-input deposit_redeemed">
          <label htmlFor="deposit_redeemed">Deposit redeemed</label>
          <input id="deposit_redeemed" type="number"
                 value={this.props.cashUpLocalState.depositRedeemed}
                 onChange={ev => this.formUpdate({depositRedeemed: validateCash(ev.target.value, this.props.cashUpLocalState.depositRedeemed)})} />
        </div>
        <h4 className="group-label fifty_label">£50</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'£50'} groupIdentifier={'fifty_tills'} tillProperty={'fiftyPounds'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label twenty_label">£20</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'£20'} groupIdentifier={'twenty_tills'} tillProperty={'twentyPounds'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label ten_label">£10</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'£10'} groupIdentifier={'ten_tills'} tillProperty={'tenPounds'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label five_label">£5</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'£5'} groupIdentifier={'five_tills'} tillProperty={'fivePounds'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label pounds_label">£1 &amp; £2</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'£1 & £2'} groupIdentifier={'pounds_tills'} tillProperty={'pounds'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label fifty_p_label">50p</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'50p'} groupIdentifier={'fifty_p_tills'} tillProperty={'fiftyPence'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label twenty_p_label">20p</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'20p'} groupIdentifier={'twenty_p_tills'} tillProperty={'twentyPence'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label ten_p_label">10p</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'10p'} groupIdentifier={'ten_p_tills'} tillProperty={'tenPence'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label five_p_label">5p</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'5p'} groupIdentifier={'five_p_tills'} tillProperty={'fivePence'} tills={this.props.cashUpLocalState.tills} />
        <h4 className="group-label z_label">Z</h4>
        <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'Z'} groupIdentifier={'z_tills'} tillProperty={'zRead'} tills={this.props.cashUpLocalState.tills} />

        <h3 className="group-title discounts_label">Discounts</h3>
        <div className="label-and-input comps_wet">
          <label htmlFor="comps_wet">Wet Comps</label>
          <input id="comps_wet" type="number"
                 value={this.props.cashUpLocalState.compsWet}
                 onChange={ev => this.formUpdate({compsWet: validateCash(ev.target.value, this.props.cashUpLocalState.compsWet)})} />
        </div>
        <div className="label-and-input d_staff_dry">
          <label htmlFor="d_staff_dry">Discount staff dry</label>
          <input id="d_staff_dry" type="number"
                 value={this.props.cashUpLocalState.dStaffDry}
                 onChange={ev => this.formUpdate({dStaffDry: validateCash(ev.target.value, this.props.cashUpLocalState.dStaffDry)})} />
        </div>
        <div className="label-and-input d_customers_wet">
          <label htmlFor="d_customers_wet">Discount customers wet</label>
          <input id="d_customers_wet" type="number"
                 value={this.props.cashUpLocalState.dCustomersWet}
                 onChange={ev => this.formUpdate({dCustomersWet: validateCash(ev.target.value, this.props.cashUpLocalState.dCustomersWet)})} />
        </div>
        <div className="label-and-input d_customers_dry">
          <label htmlFor="d_customers_dry">Discount customers dry</label>
          <input id="d_customers_dry" type="number"
                 value={this.props.cashUpLocalState.dCustomersDry}
                 onChange={ev => this.formUpdate({dCustomersDry: validateCash(ev.target.value, this.props.cashUpLocalState.dCustomersDry)})} />
        </div>
        <div className="label-and-input d_customers_coffee">
          <label htmlFor="d_customers_coffee">Discount customer coffee</label>
          <input id="d_customers_coffee" type="number"
                 value={this.props.cashUpLocalState.dCustomersCoffee}
                 onChange={ev => this.formUpdate({dCustomersCoffee: validateCash(ev.target.value, this.props.cashUpLocalState.dCustomersCoffee)})} />
        </div>
        <div className="label-and-input fwt_wet">
          <label htmlFor="fwt_wet">FWT wet</label>
          <input id="fwt_wet" type="number"
                 value={this.props.cashUpLocalState.fwtWet}
                 onChange={ev => this.formUpdate({fwtWet: validateCash(ev.target.value, this.props.cashUpLocalState.fwtWet)})} />
        </div>
        <div className="label-and-input como_in_drawer">
          <label htmlFor="como_in_drawer">COMO in drawer</label>
          <input id="como_in_drawer" type="number"
                 value={this.props.cashUpLocalState.comoInDrawer}
                 onChange={ev => this.formUpdate({comoInDrawer: validateCash(ev.target.value, this.props.cashUpLocalState.comoInDrawer)})} />
        </div>

        <h3 className="group-title credit_card_label">Credit card totals</h3>
        <div className="label-and-input amex_tots">
          <label htmlFor="amex_tots">AMEX total</label>
          <input id="amex_tots" type="number"
                 value={this.props.cashUpLocalState.amexTots}
                 onChange={ev => this.formUpdate({amexTots: validateCash(ev.target.value, this.props.cashUpLocalState.amexTots)})} />
        </div>
        <div className="label-and-input visa_mc_tots">
          <label htmlFor="visa_mc_tots">VISA/MC total</label>
          <input id="visa_mc_tots" type="number"
                 value={this.props.cashUpLocalState.visaMcTots}
                 onChange={ev => this.formUpdate({visaMcTots: validateCash(ev.target.value, this.props.cashUpLocalState.visaMcTots)})} />
        </div>

        <div className="receipts-group">
          <h3 className="group-title receipts_label">Cash Receipts</h3>
          {this.props.cashUpLocalState.receipts.map((receipt, index) => this.receiptInput(index))}
          <button className='receipt_add_button' type='button' onClick={ev => {
            this.props.cashUpLocalState.receipts.push(Receipt.default());
            this.formUpdate({receipts: this.props.cashUpLocalState.receipts});
          }}>+</button>
        </div>

        <div className="label-and-input spend_staff_pts">
          <label htmlFor="spend_staff_points">Spend & staff points</label>
          <input id="spend_staff_points" type="number"
                 value={this.props.cashUpLocalState.spendStaffPts}
                 onChange={ev => this.formUpdate({spendStaffPts: validateCash(ev.target.value, this.props.cashUpLocalState.spendStaffPts)})} />
        </div>
        <div className="label-and-input como_disc_asset">
          <label htmlFor="como_disc_asset">COMO Discount asset</label>
          <input id="como_disc_asset" type="number"
                 value={this.props.cashUpLocalState.comoDiscAsset}
                 onChange={ev => this.formUpdate({comoDiscAsset: validateCash(ev.target.value, this.props.cashUpLocalState.comoDiscAsset)})} />
        </div>

        <h3 className="group-title nett_takes_label">Nett takes</h3>
        <div className="label-and-input take_dry">
          <label htmlFor="take_dry">Dry</label>
          <input id="take_dry" type="number"
                 value={this.props.cashUpLocalState.takeDry}
                 onChange={ev => this.formUpdate({takeDry: validateCash(ev.target.value, this.props.cashUpLocalState.takeDry)})} />
        </div>
        <div className="label-and-input take_coffee">
          <label htmlFor="take_coffee">Coffee</label>
          <input id="take_coffee" type="number"
                 value={this.props.cashUpLocalState.takeCoffee}
                 onChange={ev => this.formUpdate({takeCoffee: validateCash(ev.target.value, this.props.cashUpLocalState.takeCoffee)})} />
        </div>
        <div className="label-and-input take_gift_card">
          <label htmlFor="take_gift_card">Gift card</label>
          <input id="take_gift_card" type="number"
                 value={this.props.cashUpLocalState.takeGiftCard}
                 onChange={ev => this.formUpdate({takeGiftCard: validateCash(ev.target.value, this.props.cashUpLocalState.takeGiftCard)})} />
        </div>
        <div className="label-and-input take_deposit_paid">
          <label htmlFor="take_deposit_paid">Deposit paid</label>
          <input id="take_deposit_paid" type="number"
                 value={this.props.cashUpLocalState.takeDepositPaid}
                 onChange={ev => this.formUpdate({takeDepositPaid: validateCash(ev.target.value, this.props.cashUpLocalState.takeDepositPaid)})} />
        </div>

        <h3 className="group-title banking_label">Banking</h3>
        <div className="label-and-input paid_out_amnt">
          <label htmlFor="paid_out_amnt">Paid out</label>
          <input id="paid_out_amnt" type="number"
                 value={this.props.cashUpLocalState.paidOutAmnt}
                 onChange={ev => this.formUpdate({paidOutAmnt: validateCash(ev.target.value, this.props.cashUpLocalState.paidOutAmnt)})} />
        </div>
        <div className="label-and-input paid_out_to">
          <label htmlFor="paid_out_to">Paid out to</label>
          <input id="paid_out_to" type="text"
                 value={this.props.cashUpLocalState.paidOutTo}
                 onChange={ev => this.formUpdate({paidOutTo: ev.target.value})} />
        </div>
        <div className="label-and-input banked">
          <label htmlFor="banked">Banked</label>
          <input id="banked" type="number"
                 value={this.props.cashUpLocalState.banked}
                 onChange={ev => this.formUpdate({banked: validateCash(ev.target.value, this.props.cashUpLocalState.banked)})} />
        </div>
        <div className="label-and-input cash_advantage_bag">
          <label htmlFor="cash_advantage_bag">Cash advantage bag</label>
          <input id="cash_advantage_bag" type="number"
                 value={this.props.cashUpLocalState.cashAdvantageBag}
                 onChange={ev => this.formUpdate({cashAdvantageBag: this.props.cashUpLocalState.cashAdvantageBag})} />
        </div>
        <div className="label-and-input cash_advantage_bag_seen_by">
          <label htmlFor="cash_advantage_bag_seen_by">Seen by</label>
          <input id="cash_advantage_bag_seen_by" type="text"
                 value={this.props.cashUpLocalState.cashAdvantageBagSeenBy}
                 onChange={ev => this.formUpdate({cashAdvantageBagSeenBy: ev.target.value})} />
        </div>

        <h3 className="group-title safe_float_label">Safe float denom</h3>
        <div className="safe_float_denom_time_groups">
          <SafeFloatDenom cashUpPropName='sfdAm' formUpdate={obj => this.formUpdate(obj)} friendlyTimeName="AM" safeFloatObj={this.props.cashUpLocalState.sfdAm} />
          <SafeFloatDenom cashUpPropName='sfdPm' formUpdate={obj => this.formUpdate(obj)} friendlyTimeName="PM" safeFloatObj={this.props.cashUpLocalState.sfdPm} />
        </div>
        <div className="label-and-input safe_float_notes">
          <label htmlFor="sfd_notes">Notes</label>
          <input id="sfd_notes" type="text"
                 value={this.props.cashUpLocalState.sfdNotes}
                 onChange={ev => this.formUpdate({sfdNotes: ev.target.value})} />
        </div>

        <h3 className="group-title summary_label">Summary</h3>
        <div className="label-and-input pub_secured_by">
          <label htmlFor="pub_secured_by">Pub secured by</label>
          <input id="pub_secured_by" type="text"
                 value={this.props.cashUpLocalState.pubSecuredBy}
                 onChange={ev => this.formUpdate({pubSecuredBy: ev.target.value})} />
        </div>
        <div className="label-and-input bar_closed_by">
          <label htmlFor="bar_closed_by">Bar closed by</label>
          <input id="bar_closed_by" type="text"
                 value={this.props.cashUpLocalState.barClosedBy}
                 onChange={ev => this.formUpdate({barClosedBy: ev.target.value})} />
        </div>
        <div className="label-and-input floor_closed_by">
          <label htmlFor="floor_closed_by">Floor closed by</label>
          <input id="floor_closed_by" type="text"
                 value={this.props.cashUpLocalState.floorClosedBy}
                 onChange={ev => this.formUpdate({floorClosedBy: ev.target.value})} />
        </div>
        <div className="label-and-input next_door_by">
          <label htmlFor="next_door_by">Next door by</label>
          <input id="next_door_by" type="text"
                 value={this.props.cashUpLocalState.nextDoorBy}
                 onChange={ev => this.formUpdate({nextDoorBy: ev.target.value})} />
        </div>
        <button className='submit-button' type='button' onClick={ev => this.updateBackEnd()} >Save</button>
      </form>
    )
  }

  private maintainStateWithUrl() {
    const paramDate = moment(this.props.match.params.date);
    if (this.props.cashUpExternalState.state === 'EMPTY'
      || (this.props.cashUpExternalState.cashUpExternalState && this.props.cashUpExternalState.state === 'OK' && !this.props.cashUpExternalState.cashUpExternalState.date.isSame(paramDate))
    ) {
      this.props.fetchCashUpForDate(paramDate);
    }
  }

  private updateBackEnd() {
    this.props.updateBackEnd(this.props.cashUpLocalState);
  }

  private receiptInput(index: number) {
    return (
      <div className='receipt' key={index}>
        <div className="label-and-input receipt_desc">
          <label htmlFor="receipt_desc_01">Description</label>
          <input id="receipt_desc_01" type="text"
                 value={this.props.cashUpLocalState.receipts[index].description}
                 onChange={ev => this.updateReceipt(index, this.props.cashUpLocalState.receipts[index].with({description: ev.target.value}))}/>
        </div>
        <div className="label-and-input receipt_amnt">
          <label htmlFor="receipt_amnt_01">Amount</label>
          <input id="receipt_amnt_01" type="number"
                 value={this.props.cashUpLocalState.receipts[index].amount}
                 onChange={ev => this.updateReceipt(index, this.props.cashUpLocalState.receipts[index].with({amount: validateCash(ev.target.value, this.props.cashUpLocalState.receipts[index].amount)}))}/>
        </div>
      </div>
    )
  }

  private formUpdate(obj: {}) {
    this.props.updateCashUpLocalState(
      this.props.cashUpLocalState.with(obj)
    );
  }

  private updateReceipt(index: number, receipt: Receipt) {
    const clonedReceipts = this.props.cashUpLocalState.receipts.map(till => till.clone());
    clonedReceipts[index] = receipt;
    this.props.updateCashUpLocalState(
      this.props.cashUpLocalState.with({receipts: clonedReceipts})
    );
  }
}

export const CashUp = connect<CashUpLocalStateProps, CashUpDispatchProps, CashUpOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpComponent);
