import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import "./Constants.scss";
import {currencyPattern, decimalPattern, percentagePattern} from "../../Util/Validation";
import {Constants} from "../../Model/Constants/Constants";
import {ConstantsExternalState} from "./State/ConstantsExternalState";
import {ConstantsLocalState} from "./State/ConstantsLocalState";
import {constantsCreate, constantsDataEntry, constantsFetch} from "./State/ConstantsRedux";

interface ConstantsDataEntryOwnProps {
}

interface ConstantsDataEntryStateProps {
  constantsExternalState: ConstantsExternalState;
  constantsLocalState: ConstantsLocalState;
}

const mapStateToProps = (state: AppState, ownProps: ConstantsDataEntryOwnProps): ConstantsDataEntryStateProps => {
  return {
    constantsExternalState: state.constantsExternalState,
    constantsLocalState: state.constantsLocalState,
  }
};

interface ConstantsDataEntryDispatchProps {
  fetchConstants: () => void;
  saveConstants: (constants: Constants) => void;
  updateConstants: (constantsLocalState: ConstantsLocalState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: ConstantsDataEntryOwnProps): ConstantsDataEntryDispatchProps => {
  return {
    fetchConstants: () => dispatch(constantsFetch()),
    saveConstants: (constants: Constants) => dispatch(constantsCreate(constants)),
    updateConstants: (constantsLocalState: ConstantsLocalState) => dispatch(constantsDataEntry(constantsLocalState)),
  };
};

type ConstantsDataEntryProps = ConstantsDataEntryOwnProps & ConstantsDataEntryStateProps & ConstantsDataEntryDispatchProps;

class ConstantsDataEntryComponent extends React.Component<ConstantsDataEntryProps, {}> {
  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }
  
  public render() {
    const isCreatingNewEntity = this.props.constantsLocalState.isCreatingEntity;
    const newEntity = this.props.constantsLocalState.newEntity;
    return (
      <div className="constants-data-entry">
        <div className="constants-entity title">
          <div>Date</div>
          <div>Fixed costs</div>
          <div>Labour Rate</div>
          <div>VAT multiplier</div>
          <div>Bar proportion of revenue</div>
          <div>Shift length for short break</div>
          <div>Short break duration</div>
          <div>Shift length for long break</div>
          <div>Long break duration</div>
          <div>ERS threshold</div>
          <div>ERS rate above threshold</div>
          <div>Holiday rate</div>
          <div>Pension rate</div>
        </div>
        {this.props.constantsLocalState.entities
          .map((entity, key) => {
          const isEditingEntity = !isCreatingNewEntity && entity.id === this.props.constantsLocalState.editingEntityId;
          return (
            <div className="constants-entity" key={key}>
              <div>{moment.utc(entity.date).format(DateFormats.DMY_SLASHES)}</div>
              <div className="constants-input-wrapper"><span>£</span><input disabled={!isEditingEntity} type="text" pattern={currencyPattern} value={entity.inputs.fixedCosts} onChange={ev => this.updateConstants(entity.with({'fixedCosts' : ev.target.value}))} /></div>
              <div className="constants-input-wrapper"><input disabled={!isEditingEntity} type="text" pattern={percentagePattern} value={entity.inputs.labourRate} onChange={ev => this.updateConstants(entity.with({'labourRate' : ev.target.value}))} /><span>%</span></div>
              <div className="constants-input-wrapper"><input disabled={!isEditingEntity} type="text" pattern={decimalPattern} value={entity.inputs.vatMultiplier} onChange={ev => this.updateConstants(entity.with({'vatMultiplier' : ev.target.value}))} /><span>&#215;</span></div>
              <div className="constants-input-wrapper"><input disabled={!isEditingEntity} type="text" pattern={percentagePattern} value={entity.inputs.barProportionOfRevenue} onChange={ev => this.updateConstants(entity.with({'barProportionOfRevenue' : ev.target.value}))} /><span>%</span></div>
              <div className="constants-input-wrapper"><input disabled={!isEditingEntity} type="text" pattern={decimalPattern} value={entity.inputs.hoursPerShortBreak} onChange={ev => this.updateConstants(entity.with({'hoursPerShortBreak' : ev.target.value}))} /><span>hrs</span></div>
              <div className="constants-input-wrapper"><input disabled={!isEditingEntity} type="text" pattern={decimalPattern} value={entity.inputs.shortBreakDuration} onChange={ev => this.updateConstants(entity.with({'shortBreakDuration' : ev.target.value}))} /><span>hrs</span></div>
              <div className="constants-input-wrapper"><input disabled={!isEditingEntity} type="text" pattern={decimalPattern} value={entity.inputs.hoursPerLongBreak} onChange={ev => this.updateConstants(entity.with({'hoursPerLongBreak' : ev.target.value}))} /><span>hrs</span></div>
              <div className="constants-input-wrapper"><input disabled={!isEditingEntity} type="text" pattern={decimalPattern} value={entity.inputs.longBreakDuration} onChange={ev => this.updateConstants(entity.with({'longBreakDuration' : ev.target.value}))} /><span>hrs</span></div>
              <div className="constants-input-wrapper"><span>£</span><input disabled={!isEditingEntity} type="text" pattern={currencyPattern} value={entity.inputs.ersThreshold} onChange={ev => this.updateConstants(entity.with({'ersThreshold' : ev.target.value}))} /></div>
              <div className="constants-input-wrapper"><input disabled={!isEditingEntity} type="text" pattern={percentagePattern} value={entity.inputs.ersPercentAboveThreshold} onChange={ev => this.updateConstants(entity.with({'ersPercentAboveThreshold' : ev.target.value}))} /><span>%</span></div>
              <div className="constants-input-wrapper"><input disabled={!isEditingEntity} type="text" pattern={percentagePattern} value={entity.inputs.holidayLinearPercent} onChange={ev => this.updateConstants(entity.with({'holidayLinearPercent' : ev.target.value}))} /><span>%</span></div>
              <div className="constants-input-wrapper"><input disabled={!isEditingEntity} type="text" pattern={percentagePattern} value={entity.inputs.pensionLinearPercent} onChange={ev => this.updateConstants(entity.with({'pensionLinearPercent' : ev.target.value}))} /><span>%</span></div>
              <div className="constants-edit-buttons">
                {!isCreatingNewEntity && !isEditingEntity && !this.props.constantsLocalState.isEditing() &&
                <button type='button' onClick={() => this.updateConstants(entity)}>Edit</button>}
                {isEditingEntity && <button type='button' onClick={() => this.saveConstants(entity)}>Save</button>}
                {isEditingEntity && <button type='button' onClick={() => this.cancelEdit()}>Cancel</button>}
              </div>
            </div>
          );
        })}
        <div className="constants-entity">
          {isCreatingNewEntity && [
            <div className="constants-input-wrapper" key={2}>{moment.utc(newEntity.date).format(DateFormats.DMY_SLASHES)}</div>,
            <div className="constants-input-wrapper" key={3}><span>£</span><input type="text" pattern={currencyPattern} value={newEntity.inputs.fixedCosts} onChange={ev => this.updateNewConstants(newEntity.with({'fixedCosts' : ev.target.value}))} /></div>,
            <div className="constants-input-wrapper" key={4}><input type="text" pattern={percentagePattern} value={newEntity.inputs.labourRate} onChange={ev => this.updateNewConstants(newEntity.with({'labourRate' : ev.target.value}))} /><span>%</span></div>,
            <div className="constants-input-wrapper" key={5}><input type="text" pattern={decimalPattern} value={newEntity.inputs.vatMultiplier} onChange={ev => this.updateNewConstants(newEntity.with({'vatMultiplier' : ev.target.value}))} /><span>&#215;</span></div>,
            <div className="constants-input-wrapper" key={6}><input type="text" pattern={percentagePattern} value={newEntity.inputs.barProportionOfRevenue} onChange={ev => this.updateNewConstants(newEntity.with({'barProportionOfRevenue' : ev.target.value}))} /><span>%</span></div>,
            <div className="constants-input-wrapper" key={7}><input type="text" pattern={decimalPattern} value={newEntity.inputs.hoursPerShortBreak} onChange={ev => this.updateNewConstants(newEntity.with({'hoursPerShortBreak' : ev.target.value}))} /><span>hrs</span></div>,
            <div className="constants-input-wrapper" key={8}><input type="text" pattern={decimalPattern} value={newEntity.inputs.shortBreakDuration} onChange={ev => this.updateNewConstants(newEntity.with({'shortBreakDuration' : ev.target.value}))} /><span>hrs</span></div>,
            <div className="constants-input-wrapper" key={9}><input type="text" pattern={decimalPattern} value={newEntity.inputs.hoursPerLongBreak} onChange={ev => this.updateNewConstants(newEntity.with({'hoursPerLongBreak' : ev.target.value}))} /><span>hrs</span></div>,
            <div className="constants-input-wrapper" key={10}><input type="text" pattern={decimalPattern} value={newEntity.inputs.longBreakDuration} onChange={ev => this.updateNewConstants(newEntity.with({'longBreakDuration' : ev.target.value}))} /><span>hrs</span></div>,
            <div className="constants-input-wrapper" key={11}><span>£</span><input type="text" pattern={currencyPattern} value={newEntity.inputs.ersThreshold} onChange={ev => this.updateNewConstants(newEntity.with({'ersThreshold' : ev.target.value}))} /></div>,
            <div className="constants-input-wrapper" key={12}><input type="text" pattern={percentagePattern} value={newEntity.inputs.ersPercentAboveThreshold} onChange={ev => this.updateNewConstants(newEntity.with({'ersPercentAboveThreshold' : ev.target.value}))} /><span>%</span></div>,
            <div className="constants-input-wrapper" key={13}><input type="text" pattern={percentagePattern} value={newEntity.inputs.holidayLinearPercent} onChange={ev => this.updateNewConstants(newEntity.with({'holidayLinearPercent' : ev.target.value}))} /><span>%</span></div>,
            <div className="constants-input-wrapper" key={14}><input type="text" pattern={percentagePattern} value={newEntity.inputs.pensionLinearPercent} onChange={ev => this.updateNewConstants(newEntity.with({'pensionLinearPercent' : ev.target.value}))} /><span>%</span></div>,
            ]}
          
          <div className="constants-edit-buttons">
            {!isCreatingNewEntity && !this.props.constantsLocalState.isEditing() &&
            <button type='button' onClick={() => this.newConstants()}>New</button>}
            {isCreatingNewEntity && <button type='button' onClick={() => this.saveConstants(newEntity)}>Save</button>}
            {isCreatingNewEntity && <button type='button' onClick={() => this.cancelEdit()}>Cancel</button>}
          </div>
        </div>
      </div>
    )
  }
  
  private newConstants() {
    this.props.updateConstants(this.props.constantsLocalState.withNewEntity(Constants.default()));
  }

  private updateConstants(constants: Constants) {
    this.props.updateConstants(this.props.constantsLocalState.withEntities([constants], constants.id));
  }

  private updateNewConstants(constants: Constants) {
    this.props.updateConstants(this.props.constantsLocalState.withNewEntity(constants));
  }

  private cancelEdit() {
    this.props.updateConstants(this.props.constantsLocalState.withEntities(this.props.constantsExternalState.externalState.entities));
  }

  private saveConstants(constants: Constants) {
    this.props.saveConstants(constants);
  }

  private maintainStateWithUrl() {
    if (this.props.constantsExternalState.isEmpty()) {
      this.props.fetchConstants();
      return;
    }
  }
}

export const ConstantsDataEntry = connect<ConstantsDataEntryStateProps, ConstantsDataEntryDispatchProps, ConstantsDataEntryOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(ConstantsDataEntryComponent);