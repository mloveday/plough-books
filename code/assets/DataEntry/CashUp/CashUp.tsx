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
import {AppState} from "../../redux";
import {CashUpExternalState} from "../../Redux/CashUp/CashUpExternalState";
import {cashUpCreate, cashUpDataEntry, cashUpFetch} from "../../Redux/CashUp/CashUpRedux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {momentFromDate} from "../../Util/DateUtils";
import './CashUp.scss';
import {CashUpBanking} from "./Partials/CashUpBanking";
import {CashUpCards} from "./Partials/CashUpCards";
import {CashUpDiscounts} from "./Partials/CashUpDiscounts";
import {CashUpNettTakes} from "./Partials/CashUpNettTakes";
import {CashUpReceipts} from "./Partials/CashUpReceipts";
import {CashUpSpendStaffComo} from "./Partials/CashUpSpendStaffComo";
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

          {sectionShown === CashUpSection.RECEIPTS && <CashUpReceipts cashUp={this.getCashUp()} formUpdate={obj => this.formUpdate(obj)} />}

          {sectionShown === CashUpSection.SPEND_STAFF_PTS_COMO && <CashUpSpendStaffComo cashUp={this.getCashUp()} formUpdate={obj => this.formUpdate(obj)} />}

          {sectionShown === CashUpSection.NETT_TAKES && <CashUpNettTakes cashUp={this.getCashUp()} formUpdate={obj => this.formUpdate(obj)} />}

          {sectionShown === CashUpSection.BANKING && <CashUpBanking cashUp={this.getCashUp()} formUpdate={obj => this.formUpdate(obj)} />}

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

  private formUpdate(obj: CashUpEntityUpdateType) {
    this.props.updateCashUpLocalState(
      [this.getCashUp().with(obj)]
    );
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
