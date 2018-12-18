import {authReducer} from "./Auth/State/AuthReducer";
import {AuthState} from "./Auth/State/AuthState";
import {CashUpExternalState} from "./DataEntry/CashUp/State/CashUpExternalState";
import {cashUpExternalReducers, cashUpInternalReducers} from "./DataEntry/CashUp/State/CashUpRedux";
import {CashUpsForWeek} from "./DataEntry/CashUp/State/CashUpsForWeek";
import {ConstantsExternalState} from "./DataEntry/Constants/State/ConstantsExternalState";
import {ConstantsLocalState} from "./DataEntry/Constants/State/ConstantsLocalState";
import {constantsExternalReducers, constantsInternalReducers} from "./DataEntry/Constants/State/ConstantsRedux";
import {RolesExternalState} from "./DataEntry/Role/State/RolesExternalState";
import {RolesLocalState} from "./DataEntry/Role/State/RolesLocalState";
import {rolesExternalReducers, rolesInternalReducers} from "./DataEntry/Role/State/RolesRedux";
import {RotaExternalState} from "./DataEntry/Rota/State/RotaExternalState";
import {rotaExternalReducers, rotaInternalReducers} from "./DataEntry/Rota/State/RotaRedux";
import {RotasForWeek} from "./DataEntry/Rota/State/RotasForWeek";
import {StaffMemberFilters} from "./DataEntry/StaffMembers/State/StaffMemberFilters";
import {StaffMembersExternalState} from "./DataEntry/StaffMembers/State/StaffMembersExternalState";
import {StaffMembersLocalState} from "./DataEntry/StaffMembers/State/StaffMembersLocalState";
import {
  staffMemberFiltersReducer,
  staffMembersExternalReducers,
  staffMembersInternalReducers
} from "./DataEntry/StaffMembers/State/StaffMembersRedux";
import {StaffRolesExternalState} from "./DataEntry/StaffRoles/State/StaffRolesExternalState";
import {StaffRolesLocalState} from "./DataEntry/StaffRoles/State/StaffRolesLocalState";
import {staffRolesExternalReducers, staffRolesInternalReducers} from "./DataEntry/StaffRoles/State/StaffRolesRedux";
import {UsersExternalState} from "./DataEntry/User/State/UsersExternalState";
import {UsersLocalState} from "./DataEntry/User/State/UsersLocalState";
import {usersExternalReducers, usersInternalReducers} from "./DataEntry/User/State/UsersRedux";

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
  staffMemberFilters: StaffMemberFilters;
  staffRolesExternalState: StaffRolesExternalState;
  staffRolesLocalState: StaffRolesLocalState;
  usersExternalState: UsersExternalState;
  usersLocalState: UsersLocalState;
  rolesExternalState: RolesExternalState;
  rolesLocalState: RolesLocalState;
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
  staffMemberFilters: staffMemberFiltersReducer,
  staffRolesExternalState: staffRolesExternalReducers,
  staffRolesLocalState: staffRolesInternalReducers,
  usersExternalState: usersExternalReducers,
  usersLocalState: usersInternalReducers,
  rolesExternalState: rolesExternalReducers,
  rolesLocalState: rolesInternalReducers,
};