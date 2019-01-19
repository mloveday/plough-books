import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {DateFormats} from "../../Util/DateFormats";
import {validateCash} from "../../Util/Validation";
import {Constants} from "../Rota/State/Constants";
import "./Constants.scss";
import {ConstantsExternalState} from "./State/ConstantsExternalState";
import {ConstantsLocalState} from "./State/ConstantsLocalState";
import {constantsCreate, constantsDataEntry, constantsFetch} from "./State/ConstantsRedux";

interface ConstantsOwnProps {
}

interface ConstantsStateProps {
  constantsExternalState: ConstantsExternalState;
  constantsLocalState: ConstantsLocalState;
}

const mapStateToProps = (state: AppState, ownProps: ConstantsOwnProps): ConstantsStateProps => {
  return {
    constantsExternalState: state.constantsExternalState,
    constantsLocalState: state.constantsLocalState,
  }
};

interface ConstantsDispatchProps {
  fetchConstants: () => void;
  saveConstants: (constants: Constants) => void;
  updateConstants: (constantsLocalState: ConstantsLocalState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: ConstantsOwnProps): ConstantsDispatchProps => {
  return {
    fetchConstants: () => dispatch(constantsFetch()),
    saveConstants: (constants: Constants) => dispatch(constantsCreate(constants)),
    updateConstants: (constantsLocalState: ConstantsLocalState) => dispatch(constantsDataEntry(constantsLocalState)),
  };
};

type ConstantsProps = ConstantsOwnProps & ConstantsStateProps & ConstantsDispatchProps;

class ConstantsComponent extends React.Component<ConstantsProps, {}> {
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
              <div>{entity.date.format(DateFormats.DMY_SLASHES)}</div>
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.fixedCosts} onChange={ev => this.updateConstants(entity.with({'fixedCosts' : validateCash(ev.target.value, entity.fixedCosts)}))} />
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.labourRate*100} onChange={ev => this.updateConstants(entity.with({'labourRate' : parseFloat(ev.target.value)/100}))} />
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.vatMultiplier} onChange={ev => this.updateConstants(entity.with({'vatMultiplier' : parseFloat(ev.target.value)}))} />
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.barProportionOfRevenue*100} onChange={ev => this.updateConstants(entity.with({'barProportionOfRevenue' : parseFloat(ev.target.value)/100}))} />
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.hoursPerShortBreak} onChange={ev => this.updateConstants(entity.with({'hoursPerShortBreak' : parseFloat(ev.target.value)}))} />
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.shortBreakDuration} onChange={ev => this.updateConstants(entity.with({'shortBreakDuration' : parseFloat(ev.target.value)}))} />
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.hoursPerLongBreak} onChange={ev => this.updateConstants(entity.with({'hoursPerLongBreak' : parseFloat(ev.target.value)}))} />
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.longBreakDuration} onChange={ev => this.updateConstants(entity.with({'longBreakDuration' : parseFloat(ev.target.value)}))} />
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.ersThreshold} onChange={ev => this.updateConstants(entity.with({'ersThreshold' : validateCash(ev.target.value, entity.fixedCosts)}))} />
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.ersPercentAboveThreshold*100} onChange={ev => this.updateConstants(entity.with({'ersPercentAboveThreshold' : parseFloat(ev.target.value)/100}))} />
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.holidayLinearPercent*100} onChange={ev => this.updateConstants(entity.with({'holidayLinearPercent' : parseFloat(ev.target.value)/100}))} />
              <input disabled={!isEditingEntity} type="number" step="0.01" value={entity.pensionLinearPercent*100} onChange={ev => this.updateConstants(entity.with({'pensionLinearPercent' : parseFloat(ev.target.value)/100}))} />
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
            <div key={2}>{newEntity.date.format(DateFormats.DMY_SLASHES)}</div>,
            <input key={3} type="number" step="0.01" value={(newEntity.fixedCosts).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'fixedCosts' : validateCash(ev.target.value, newEntity.fixedCosts)}))} />,
            <input key={4} type="number" step="0.01" value={(newEntity.labourRate*100).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'labourRate' : parseFloat(ev.target.value)/100}))} />,
            <input key={5} type="number" step="0.01" value={(newEntity.vatMultiplier).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'vatMultiplier' : parseFloat(ev.target.value)}))} />,
            <input key={6} type="number" step="0.01" value={(newEntity.barProportionOfRevenue*100).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'barProportionOfRevenue' : parseFloat(ev.target.value)/100}))} />,
            <input key={7} type="number" step="0.01" value={(newEntity.hoursPerShortBreak).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'hoursPerShortBreak' : parseFloat(ev.target.value)}))} />,
            <input key={8} type="number" step="0.01" value={(newEntity.shortBreakDuration).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'shortBreakDuration' : parseFloat(ev.target.value)}))} />,
            <input key={9} type="number" step="0.01" value={(newEntity.hoursPerLongBreak).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'hoursPerLongBreak' : parseFloat(ev.target.value)}))} />,
            <input key={10} type="number" step="0.01" value={(newEntity.longBreakDuration).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'longBreakDuration' : parseFloat(ev.target.value)}))} />,
            <input key={11} type="number" step="0.01" value={(newEntity.ersThreshold).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'ersThreshold' : validateCash(ev.target.value, newEntity.fixedCosts)}))} />,
            <input key={12} type="number" step="0.01" value={(newEntity.ersPercentAboveThreshold*100).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'ersPercentAboveThreshold' : parseFloat(ev.target.value)/100}))} />,
            <input key={13} type="number" step="0.01" value={(newEntity.holidayLinearPercent*100).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'holidayLinearPercent' : parseFloat(ev.target.value)/100}))} />,
            <input key={14} type="number" step="0.01" value={(newEntity.pensionLinearPercent*100).toFixed(2)} onChange={ev => this.updateNewConstants(newEntity.with({'pensionLinearPercent' : parseFloat(ev.target.value)/100}))} />,
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
  
  private newConstants(constants: Constants = Constants.default()) {
    this.props.updateConstants(this.props.constantsLocalState.withNewEntity(constants));
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

export const ConstantsDataEntry = connect<ConstantsStateProps, ConstantsDispatchProps, ConstantsOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(ConstantsComponent);