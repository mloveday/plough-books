import {authReducer} from "./Auth/State/AuthReducer";
import {AuthState} from "./Auth/State/AuthState";
import {CashUpExternalState} from "./DataEntry/CashUp/State/CashUpExternalState";
import {cashUpExternalReducers, cashUpInternalReducers} from "./DataEntry/CashUp/State/CashUpRedux";
import {CashUpsForWeek} from "./DataEntry/CashUp/State/CashUpsForWeek";
import {ConstantsExternalState} from "./DataEntry/Constants/State/ConstantsExternalState";
import {ConstantsLocalState} from "./DataEntry/Constants/State/ConstantsLocalState";
import {constantsExternalReducers, constantsInternalReducers} from "./DataEntry/Constants/State/ConstantsRedux";
import {RotaExternalState} from "./DataEntry/Rota/State/RotaExternalState";
import {rotaExternalReducers, rotaInternalReducers} from "./DataEntry/Rota/State/RotaRedux";
import {RotasForWeek} from "./DataEntry/Rota/State/RotasForWeek";
import {StaffMembersExternalState} from "./DataEntry/StaffMembers/State/StaffMembersExternalState";
import {StaffMembersLocalState} from "./DataEntry/StaffMembers/State/StaffMembersLocalState";
import {
  staffMembersExternalReducers,
  staffMembersInternalReducers
} from "./DataEntry/StaffMembers/State/StaffMembersRedux";
import {StaffRolesExternalState} from "./DataEntry/StaffRoles/State/StaffRolesExternalState";
import {StaffRolesLocalState} from "./DataEntry/StaffRoles/State/StaffRolesLocalState";
import {staffRolesExternalReducers, staffRolesInternalReducers} from "./DataEntry/StaffRoles/State/StaffRolesRedux";

export interface AppState {
  authState: AuthState;
  cashUpExternalState: CashUpExternalState;
  cashUpLocalStates: CashUpsForWeek;
  constantsExternalState: ConstantsExternalState;
  constantsLocalState: ConstantsLocalState;
  rotaExternalState: RotaExternalState;
  rotaLocalStates: RotasForWeek;
  staffMembersExternalState: StaffMembersExternalState;
  staffMembersLocalState: StaffMembersLocalState;
  staffRolesExternalState: StaffRolesExternalState;
  staffRolesLocalState: StaffRolesLocalState;
}

export const reducers = {
  authState: authReducer,
  cashUpExternalState: cashUpExternalReducers,
  cashUpLocalStates: cashUpInternalReducers,
  constantsExternalState: constantsExternalReducers,
  constantsLocalState: constantsInternalReducers,
  rotaExternalState: rotaExternalReducers,
  rotaLocalStates: rotaInternalReducers,
  staffMembersExternalState: staffMembersExternalReducers,
  staffMembersLocalState: staffMembersInternalReducers,
  staffRolesExternalState: staffRolesExternalReducers,
  staffRolesLocalState: staffRolesInternalReducers,
};