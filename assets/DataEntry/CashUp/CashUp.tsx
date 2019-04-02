import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {DatePicker} from "../../Common/Nav/DatePicker";
import {Routes} from "../../Common/Routing/Routes";
import {CashUpSection} from "../../Enum/CashUpSection";
import {AppState} from "../../redux";
import {uiUpdate} from "../../State/UiRedux";
import {UiState} from "../../State/UiState";
import {Formatting} from "../../Util/Formatting";
import {currencyPattern} from "../../Util/Validation";
import './CashUp.scss';
import {SafeFloatDenom} from "./SafeFloatDenom";
import {CashUpEntity} from "./State/CashUpEntity";
import {CashUpEntityUpdateType} from "./State/CashUpEntityTypes";
import {CashUpExternalState} from "./State/CashUpExternalState";
import {cashUpCreate, cashUpDataEntry, cashUpFetch} from "./State/CashUpRedux";
import {CashUpsForWeek} from "./State/CashUpsForWeek";
import {Receipt} from "./State/Receipt";
import {ReceiptInput} from "./State/ReceiptInput";
import {SectionPosition} from "./State/SectionPosition";
import {TillInputGroup} from "./TillInputGroup";

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
  private sectionOrder = new Map([
    [CashUpSection.TILLS, new SectionPosition(CashUpSection.TILLS, CashUpSection.DISCOUNTS, CashUpSection.SUMMARY)],
    [CashUpSection.DISCOUNTS, new SectionPosition(CashUpSection.DISCOUNTS, CashUpSection.CARDS, CashUpSection.TILLS)],
    [CashUpSection.CARDS, new SectionPosition(CashUpSection.CARDS, CashUpSection.RECEIPTS, CashUpSection.DISCOUNTS)],
    [CashUpSection.RECEIPTS, new SectionPosition(CashUpSection.RECEIPTS, CashUpSection.SPEND_STAFF_PTS_COMO, CashUpSection.CARDS)],
    [CashUpSection.SPEND_STAFF_PTS_COMO, new SectionPosition(CashUpSection.SPEND_STAFF_PTS_COMO, CashUpSection.NETT_TAKES, CashUpSection.RECEIPTS)],
    [CashUpSection.NETT_TAKES, new SectionPosition(CashUpSection.NETT_TAKES, CashUpSection.BANKING, CashUpSection.SPEND_STAFF_PTS_COMO)],
    [CashUpSection.BANKING, new SectionPosition(CashUpSection.BANKING, CashUpSection.SAFE_FLOAT, CashUpSection.NETT_TAKES)],
    [CashUpSection.SAFE_FLOAT, new SectionPosition(CashUpSection.SAFE_FLOAT, CashUpSection.SUMMARY, CashUpSection.BANKING)],
    [CashUpSection.SUMMARY, new SectionPosition(CashUpSection.SUMMARY, CashUpSection.TILLS, CashUpSection.SAFE_FLOAT)],
  ]);

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
            <button className='submit-button' type='button' onClick={ev => this.updateBackEnd()}><FontAwesomeIcon icon="save" /> Save</button>
          </div>

          <div className={`z-read-summary`}>
            <div className={`summary-stat`}>
              <div>Total in drawer inc receipts</div>
              <div>{Formatting.formatCash(this.getCashUp().getTotalRevenue())}</div>
            </div>
            <div className={`summary-stat`}>
              <div>Como in drawer</div>
              <div>{Formatting.formatCash(this.getCashUp().comoInDrawer)}</div>
            </div>
            <div className={`summary-stat`}>
              <div>Comps</div>
              <div>{Formatting.formatCash(this.getCashUp().getTotalComps())}</div>
            </div>

            <div className={`summary-stat`}>
              <div>Expected z read</div>
              <div>{Formatting.formatCash(this.getCashUp().getTotalComps() + this.getCashUp().getTotalRevenue() + this.getCashUp().comoInDrawer)}</div>
            </div>
            <div className={`summary-stat`}>
              <div>Actual z read</div>
              <div>{Formatting.formatCash(this.getCashUp().getTotalZRead())}</div>
            </div>
            <div className={`summary-stat`}>
              <div>Variance</div>
              <div>{Formatting.formatCash(this.getCashUp().getZReadVariance())}</div>
            </div>

            <div className={`summary-stat`}>
              <div>Visa/Amex fill in total</div>
              <div>{Formatting.formatCash(this.getCashUp().amexTots + this.getCashUp().visaMcTots)}</div>
            </div>
            <div className={`summary-stat`}>
              <div>Visa/Amex in tills</div>
              <div>{Formatting.formatCash(this.getCashUp().tills.reduce((prev, curr) => prev + curr.visa + curr.amex,0))}</div>
            </div>
            <div className={`summary-stat`}>
              <div>Variance</div>
              <div>{Formatting.formatCash(this.getCashUp().amexTots + this.getCashUp().visaMcTots - this.getCashUp().tills.reduce((prev, curr) => prev + curr.visa + curr.amex,0))}</div>
            </div>
          </div>

          <ul className='cash-up-link-list'>
            {Array.from(this.sectionOrder.values()).map((sectionPosition, key) => (
              <li className='cash-up-link-item' key={key}>
                <button className={`cash-up-link-button${sectionPosition.section === currentSectionPosition.section ? ' selected' : ''}`} type="button" onClick={() => this.props.updateUi(this.props.uiState.withCashUpSection(sectionPosition.section))}>{sectionPosition.section}</button>
              </li>
            ))}
          </ul>

          {sectionShown === CashUpSection.TILLS &&
          <div className="form-group">
            <div className="form-row">
              <h4 className="group-label charge_deposit_label">Charge & deposit</h4>
              <div className="label-and-input charge_to_ac">
                <label htmlFor="charge_to_ac">Charge to account</label>
                <input id="charge_to_ac" type="text" pattern={currencyPattern}
                       value={this.getCashUp().inputs.chargeToAccount}
                       onChange={ev => this.formUpdate({chargeToAccount: ev.target.value})}/>
              </div>
              <div className="label-and-input deposit_redeemed">
                <label htmlFor="deposit_redeemed">Deposit redeemed</label>
                <input id="deposit_redeemed" type="text" pattern={currencyPattern}
                       value={this.getCashUp().inputs.depositRedeemed}
                       onChange={ev => this.formUpdate({depositRedeemed: ev.target.value})}/>
              </div>
            </div>

            <div className="form-row">
              <h4 className="group-label till_label">Tills</h4>
              <div className="per-till">
                <div className="till-label">1</div>
                <div className="till-label">2</div>
                <div className="till-label">3</div>
                <div className="till-label">4</div>
                <div className="till-label">5</div>
                <div className="till-label">6</div>
                <div className="till-label">7</div>
              </div>
            </div>

            <div className={`section-line`}/>

            <div className="form-row">
            <h4 className="group-label till_float_label">Till float</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'Till float'}
                            groupIdentifier={'till_float_tills'} tillProperty={'float'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className="form-row">
            <h4 className="group-label amex_label">AMEX</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'amex'}
                            groupIdentifier={'amex_tills'} tillProperty={'amex'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className="form-row">
              <h4 className="group-label visa_label">VISA</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'visa'}
                            groupIdentifier={'visa_tills'} tillProperty={'visa'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className="form-row">
              <h4 className="group-label fifty_label">£50</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'£50'}
                            groupIdentifier={'fifty_tills'} tillProperty={'fiftyPounds'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className="form-row">
              <h4 className="group-label twenty_label">£20</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'£20'}
                            groupIdentifier={'twenty_tills'} tillProperty={'twentyPounds'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className="form-row">
              <h4 className="group-label ten_label">£10</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'£10'}
                            groupIdentifier={'ten_tills'} tillProperty={'tenPounds'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className="form-row">
              <h4 className="group-label five_label">£5</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'£5'}
                            groupIdentifier={'five_tills'} tillProperty={'fivePounds'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className="form-row">
              <h4 className="group-label pounds_label">£1 &amp; £2</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'£1 & £2'}
                            groupIdentifier={'pounds_tills'} tillProperty={'pounds'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className="form-row">
              <h4 className="group-label fifty_p_label">50p</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'50p'}
                            groupIdentifier={'fifty_p_tills'} tillProperty={'fiftyPence'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className="form-row">
              <h4 className="group-label twenty_p_label">20p</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'20p'}
                            groupIdentifier={'twenty_p_tills'} tillProperty={'twentyPence'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className="form-row">
              <h4 className="group-label ten_p_label">10p</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'10p'}
                            groupIdentifier={'ten_p_tills'} tillProperty={'tenPence'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className="form-row">
              <h4 className="group-label five_p_label">5p</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'5p'}
                            groupIdentifier={'five_p_tills'} tillProperty={'fivePence'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className={`section-line`}/>
            <div className="form-row">
            <h4 className="group-label z_label">Z read</h4>
            <TillInputGroup formUpdate={obj => this.formUpdate(obj)} friendlyName={'Z'}
                            groupIdentifier={'z_tills'} tillProperty={'zRead'}
                            tills={this.getCashUp().tills}/>
            </div>

            <div className={`section-line`}/>
            <div className="form-row">
            <h4 className="group-label z_label">Z variance</h4>
            <div className={`per-till diff`}>
              {this.getCashUp().tills.map((till, index) =>
                <div className="till-label-and-input" key={index}>
                  <div>{Formatting.formatCash(till.totalTaken() - till.zRead)}</div>
                </div>
              )}
            </div>
            </div>
          </div>}

          {sectionShown === CashUpSection.DISCOUNTS && <div className="form-group">
            <h3 className="group-title discounts_label">Discounts</h3>
            <div className="label-and-input comps_wet">
              <label htmlFor="comps_wet">Wet Comps</label>
              <input id="comps_wet" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.compsWet}
                     onChange={ev => this.formUpdate({compsWet: ev.target.value})}/>
            </div>
            <div className="label-and-input d_staff_dry">
              <label htmlFor="d_staff_dry">Discount staff dry</label>
              <input id="d_staff_dry" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.dStaffDry}
                     onChange={ev => this.formUpdate({dStaffDry: ev.target.value})}/>
            </div>
            <div className="label-and-input d_customers_wet">
              <label htmlFor="d_customers_wet">Discount customers wet</label>
              <input id="d_customers_wet" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.dCustomersWet}
                     onChange={ev => this.formUpdate({dCustomersWet: ev.target.value})}/>
            </div>
            <div className="label-and-input d_customers_dry">
              <label htmlFor="d_customers_dry">Discount customers dry</label>
              <input id="d_customers_dry" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.dCustomersDry}
                     onChange={ev => this.formUpdate({dCustomersDry: ev.target.value})}/>
            </div>
            <div className="label-and-input d_customers_coffee">
              <label htmlFor="d_customers_coffee">Discount customer coffee</label>
              <input id="d_customers_coffee" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.dCustomersCoffee}
                     onChange={ev => this.formUpdate({dCustomersCoffee: ev.target.value})}/>
            </div>
            <div className="label-and-input fwt_wet">
              <label htmlFor="fwt_wet">FWT wet</label>
              <input id="fwt_wet" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.fwtWet}
                     onChange={ev => this.formUpdate({fwtWet: ev.target.value})}/>
            </div>
            <div className="label-and-input como_in_drawer">
              <label htmlFor="como_in_drawer">COMO in drawer</label>
              <input id="como_in_drawer" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.comoInDrawer}
                     onChange={ev => this.formUpdate({comoInDrawer: ev.target.value})}/>
            </div>
          </div>}

          {sectionShown === CashUpSection.CARDS && <div className="form-group">
            <h3 className="group-title credit_card_label">Credit card totals</h3>
            <div className="label-and-input amex_tots">
              <label htmlFor="amex_tots">AMEX total</label>
              <input id="amex_tots" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.amexTots}
                     onChange={ev => this.formUpdate({amexTots: ev.target.value})}/>
            </div>
            <div className="label-and-input visa_mc_tots">
              <label htmlFor="visa_mc_tots">VISA/MC total</label>
              <input id="visa_mc_tots" type="text" pattern={currencyPattern}
                     value={this.getCashUp().inputs.visaMcTots}
                     onChange={ev => this.formUpdate({visaMcTots: ev.target.value})}/>
            </div>
          </div>}

          {sectionShown === CashUpSection.RECEIPTS && <div className="form-group receipts">
            <h3 className="group-title receipts_label">Cash Receipts</h3>
            <button className='receipt_add_button' type='button' onClick={ev => {
              this.formUpdate({
                receipts: this.getCashUp().receipts
                  .map(r => r.inputs)
                  .concat([ReceiptInput.default()])
              });
            }}>+
            </button>
            {this.getCashUp().receipts.map((receipt, index) => this.receiptInput(index))}
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
                     value={this.getCashUp().inputs.paidOutAmnt}
                     onChange={ev => this.formUpdate({paidOutAmnt: ev.target.value})}/>
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
    return this.props.cashUpsForWeek.getCashUpForDay(moment.utc(this.props.match.params.date));
  }

  private maintainStateWithUrl() {
    const paramDate = moment.utc(this.props.match.params.date);
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

  private receiptInput(index: number) {
    return (
      <div className='receipt' key={index}>
        <div className="label-and-input receipt_desc">
          <label htmlFor="receipt_desc_01">Description</label>
          <input id="receipt_desc_01" type="text"
                 value={this.getCashUp().receipts[index].description}
                 onChange={ev => this.updateReceipt(index, this.getCashUp().receipts[index].with({description: ev.target.value}))}/>
        </div>
        <div className="label-and-input receipt_amnt">
          <label htmlFor="receipt_amnt_01">Amount</label>
          <input id="receipt_amnt_01" type="text" pattern={currencyPattern}
                 value={this.getCashUp().receipts[index].inputs.amount}
                 onChange={ev => this.updateReceipt(index, this.getCashUp().receipts[index].with({amount: ev.target.value}))}/>
        </div>
      </div>
    )
  }

  private formUpdate(obj: CashUpEntityUpdateType) {
    this.props.updateCashUpLocalState(
      [this.getCashUp().with(obj)]
    );
  }

  private updateReceipt(index: number, receipt: Receipt) {
    const clonedReceipts = this.getCashUp().receipts.map(till => till.inputs.clone());
    clonedReceipts[index] = receipt.inputs;
    this.formUpdate({receipts: clonedReceipts});
  }

  private getSectionPosition(): SectionPosition {
    if (this.sectionOrder.has(this.props.uiState.cashUpSection)) {
      // @ts-ignore
      return this.sectionOrder.get(this.props.uiState.cashUpSection);
    }
    return new SectionPosition(CashUpSection.TILLS, CashUpSection.SUMMARY, CashUpSection.DISCOUNTS);
  }
}

export const CashUp = connect<CashUpLocalStateProps, CashUpDispatchProps, CashUpOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpComponent);
