import * as React from "react";
import {connect} from "react-redux";
import {EditButton} from "../../Common/Buttons/EditButton";
import {NewButton} from "../../Common/Buttons/NewButton";
import {ResetButton} from "../../Common/Buttons/ResetButton";
import {SaveButton} from "../../Common/Buttons/SaveButton";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {RotaStaffingTemplate} from "../../Model/RotaStaffingTemplate/RotaStaffingTemplate";
import {AppState} from "../../redux";
import {RotaStaffingTemplatesExternalState} from "../../Redux/RotaStaffingTemplates/RotaStaffingTemplatesExternalState";
import {RotaStaffingTemplatesLocalState} from "../../Redux/RotaStaffingTemplates/RotaStaffingTemplatesLocalState";
import {
  rotaStaffingTemplatesCreate,
  rotaStaffingTemplatesDataEntry,
  rotaStaffingTemplatesFetch
} from "../../Redux/RotaStaffingTemplates/RotaStaffingTemplatesRedux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {dayFromWeekDayNumber, timeFromHalfHoursPastStart} from "../../Util/DateUtils";
import {currencyPattern, integerPattern} from "../../Util/Validation";
import "./RotaStaffingTemplates.scss";

interface RotaStaffingTemplatesDataEntryOwnProps {
}

interface RotaStaffingTemplatesDataEntryStateProps {
  rotaStaffingTemplatesExternalState: RotaStaffingTemplatesExternalState;
  rotaStaffingTemplatesLocalState: RotaStaffingTemplatesLocalState;
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: RotaStaffingTemplatesDataEntryOwnProps): RotaStaffingTemplatesDataEntryStateProps => {
  return {
    rotaStaffingTemplatesExternalState: state.rotaStaffingTemplatesExternalState,
    rotaStaffingTemplatesLocalState: state.rotaStaffingTemplatesLocalState,
    uiState: state.uiState,
  }
};

interface RotaStaffingTemplatesDataEntryDispatchProps {
  fetchRotaStaffingTemplates: () => void;
  saveRotaStaffingTemplates: (rotaStaffingTemplates: RotaStaffingTemplate) => void;
  updateRotaStaffingTemplates: (rotaStaffingTemplatesLocalState: RotaStaffingTemplatesLocalState) => void;
  updateUiState: (uiState: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: RotaStaffingTemplatesDataEntryOwnProps): RotaStaffingTemplatesDataEntryDispatchProps => {
  return {
    fetchRotaStaffingTemplates: () => dispatch(rotaStaffingTemplatesFetch()),
    saveRotaStaffingTemplates: (rotaStaffingTemplates: RotaStaffingTemplate) => dispatch(rotaStaffingTemplatesCreate(rotaStaffingTemplates)),
    updateRotaStaffingTemplates: (rotaStaffingTemplatesLocalState: RotaStaffingTemplatesLocalState) => dispatch(rotaStaffingTemplatesDataEntry(rotaStaffingTemplatesLocalState)),
    updateUiState: uiState => dispatch(uiUpdate(uiState)),
  };
};

type RotaStaffingTemplatesDataEntryProps =
  RotaStaffingTemplatesDataEntryOwnProps
  & RotaStaffingTemplatesDataEntryStateProps
  & RotaStaffingTemplatesDataEntryDispatchProps;

class RotaStaffingTemplatesDataEntryComponent extends React.Component<RotaStaffingTemplatesDataEntryProps, {}> {
  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    const isCreatingNewEntity = this.props.rotaStaffingTemplatesLocalState.isCreatingEntity;
    const newEntity = this.props.rotaStaffingTemplatesLocalState.newEntity;
    return (
      <div className="rota-staffing-templates-data-entry">
        <div className={`rota-staffing-template-filters`}>
          <select value={this.props.uiState.rotaStaffingTemplateFilters.weekDay} onChange={ev => this.props.updateUiState(this.props.uiState.withRotaStaffingTemplateFilters(this.props.uiState.rotaStaffingTemplateFilters.withWeekDay(parseInt(ev.target.value, 0))))}>
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
            <option value={6}>Saturday</option>
            <option value={0}>Sunday</option>
          </select>
          <select value={this.props.uiState.rotaStaffingTemplateFilters.workType} onChange={ev => this.props.updateUiState(this.props.uiState.withRotaStaffingTemplateFilters(this.props.uiState.rotaStaffingTemplateFilters.withWorkType(ev.target.value as WorkTypes)))}>
            <option value={WorkTypes.BAR}>Bar</option>
            <option value={WorkTypes.KITCHEN}>Kitchen</option>
            <option value={WorkTypes.ANCILLARY}>Ancillary</option>
          </select>
        </div>
        <table>
          <thead>
          <tr className="rota-staffing-templates-entity title">
            <td/>
            <td>Type</td>
            <td>Week day</td>
            <td>Revenue</td>
            <td>Staff levels</td>
          </tr>
          </thead><tbody>
          {this.props.rotaStaffingTemplatesLocalState.entities
            .filter(rst => rst.dayOfWeek === this.props.uiState.rotaStaffingTemplateFilters.weekDay && rst.workType === this.props.uiState.rotaStaffingTemplateFilters.workType)
            .map((entity, key) => {
              const isEditingEntity = !isCreatingNewEntity && entity.id === this.props.rotaStaffingTemplatesLocalState.editingEntityId;
              return [
                <tr className="rota-staffing-templates-entity" key={`1-${key}`}>
                  <td className="rota-staffing-templates-edit-buttons">
                    {!isEditingEntity && <EditButton disabled={isCreatingNewEntity || this.props.rotaStaffingTemplatesLocalState.isEditing()} mini={true} clickFn={() => this.updateRotaStaffingTemplates(entity)}/>}
                    {isEditingEntity && <SaveButton mini={true} clickFn={() => this.saveRotaStaffingTemplates(entity)}/>}
                  </td>
                  <td>
                    <select disabled={!isEditingEntity} value={entity.workType} onChange={ev => this.updateRotaStaffingTemplates(entity.with({workType: ev.target.value}))}>
                      <option value={WorkTypes.BAR}>Bar</option>
                      <option value={WorkTypes.KITCHEN}>Kitchen</option>
                      <option value={WorkTypes.ANCILLARY}>Ancillary</option>
                    </select>
                  </td>
                  <td>{dayFromWeekDayNumber(entity.dayOfWeek)}</td>
                  <td className="rota-staffing-templates-input-wrapper">
                    <input disabled={!isEditingEntity} type="text" pattern={currencyPattern} value={entity.inputs.revenue} onChange={ev => this.updateRotaStaffingTemplates(entity.with({revenue: ev.target.value}))}/>
                  </td>
                  {entity.inputs.staffLevels.map((staffLevel, index) => index > 23 ? null :
                    this.staffLevelEdit(index, staffLevel, entity, isEditingEntity, rst => this.updateRotaStaffingTemplates(rst))
                  )}
                </tr>,
                <tr className="rota-staffing-templates-entity" key={`2-${key}`}>
                  <td colSpan={4}>
                    {isEditingEntity && <ResetButton mini={true} clickFn={() => this.cancelEdit()}>Cancel</ResetButton>}
                  </td>
                  {entity.inputs.staffLevels.map((staffLevel, index) => index <= 23 || index > 47 ? null :
                    this.staffLevelEdit(index, staffLevel, entity, isEditingEntity, rst => this.updateRotaStaffingTemplates(rst))
                  )}
                </tr>
              ];
            })}
          {!isCreatingNewEntity && <tr className="rota-staffing-templates-entity">
            <td><NewButton disabled={this.props.rotaStaffingTemplatesLocalState.isEditing()} mini={true} clickFn={() => this.newRotaStaffingTemplates()}/></td>
          </tr>}
          {isCreatingNewEntity && <tr className="rota-staffing-templates-entity">
            <td className="rota-staffing-templates-edit-buttons">
              <SaveButton mini={true} clickFn={() => this.saveRotaStaffingTemplates(newEntity)}/>
            </td>
            <td>
              <select value={newEntity.workType} onChange={ev => this.updateNewRotaStaffingTemplates(newEntity.with({workType: ev.target.value}))}>
                <option value={WorkTypes.BAR}>Bar</option>
                <option value={WorkTypes.KITCHEN}>Kitchen</option>
                <option value={WorkTypes.ANCILLARY}>Ancillary</option>
              </select>
            </td>
            <td className="rota-staffing-templates-input-wrapper">
              <select value={newEntity.inputs.dayOfWeek} onChange={ev => this.updateNewRotaStaffingTemplates(newEntity.with({dayOfWeek: parseInt(ev.target.value, 10)}))}>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
                <option value={0}>Sunday</option>
              </select>
            </td>
            <td className="rota-staffing-templates-input-wrapper">
              <input type="text" pattern={currencyPattern} value={newEntity.inputs.revenue} onChange={ev => this.updateNewRotaStaffingTemplates(newEntity.with({revenue: ev.target.value}))}/>
            </td>
            {...newEntity.inputs.staffLevels.map((staffLevel, index) => index > 23 ? null :
                this.staffLevelEdit(index, staffLevel, newEntity, true, rst => this.updateNewRotaStaffingTemplates(rst)))
            }
          </tr>}
          {isCreatingNewEntity && <tr className="rota-staffing-templates-entity">
            <td colSpan={4}>
              {isCreatingNewEntity && <ResetButton mini={true} clickFn={() => this.cancelEdit()}>Cancel</ResetButton>}
            </td>
            {newEntity.inputs.staffLevels.map((staffLevel, index) => index <= 23 || index > 47 ? null :
              this.staffLevelEdit(index, staffLevel, newEntity, true, rst => this.updateNewRotaStaffingTemplates(rst))
            )}
          </tr>}
        </tbody>
        </table>
      </div>
    )
  }

  private staffLevelEdit(index: number, staffLevel: string, entity: RotaStaffingTemplate, isEditingEntity: boolean, updateFn: (rotaStaffingTemplates: RotaStaffingTemplate) => void) {
    return <td key={index} className="rota-staffing-templates-input-wrapper staff-level">
      <div className={`staff-level-time`}>{timeFromHalfHoursPastStart(index)}</div>
      <input disabled={!isEditingEntity} type="number" pattern={integerPattern} value={staffLevel}
             onChange={ev => updateFn(entity.with({staffLevels: entity.inputs.staffLevels.map((sl, i) => i === index ? ev.target.value : sl)}))}/>
    </td>
  }

  private newRotaStaffingTemplates() {
    this.props.updateRotaStaffingTemplates(this.props.rotaStaffingTemplatesLocalState.withNewEntity(RotaStaffingTemplate.default()));
  }

  private updateRotaStaffingTemplates(rotaStaffingTemplates: RotaStaffingTemplate) {
    this.props.updateRotaStaffingTemplates(this.props.rotaStaffingTemplatesLocalState.withEntities([rotaStaffingTemplates], rotaStaffingTemplates.id));
  }

  private updateNewRotaStaffingTemplates(rotaStaffingTemplates: RotaStaffingTemplate) {
    this.props.updateRotaStaffingTemplates(this.props.rotaStaffingTemplatesLocalState.withNewEntity(rotaStaffingTemplates));
  }

  private cancelEdit() {
    this.props.updateRotaStaffingTemplates(this.props.rotaStaffingTemplatesLocalState.withEntities(this.props.rotaStaffingTemplatesExternalState.externalState.entities));
  }

  private saveRotaStaffingTemplates(rotaStaffingTemplates: RotaStaffingTemplate) {
    this.props.saveRotaStaffingTemplates(rotaStaffingTemplates);
  }

  private maintainStateWithUrl() {
    if (this.props.rotaStaffingTemplatesExternalState.isEmpty()) {
      this.props.fetchRotaStaffingTemplates();
      return;
    }
  }
}

export const RotaStaffingTemplatesDataEntry = connect<RotaStaffingTemplatesDataEntryStateProps, RotaStaffingTemplatesDataEntryDispatchProps, RotaStaffingTemplatesDataEntryOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RotaStaffingTemplatesDataEntryComponent);