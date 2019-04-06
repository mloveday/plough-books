import {authReducer} from "./Common/Auth/State/AuthReducer";
import {AuthState} from "./Common/Auth/State/AuthState";
import {CashUpExternalState} from "./Redux/CashUp/CashUpExternalState";
import {cashUpExternalReducers, cashUpInternalReducers} from "./Redux/CashUp/CashUpRedux";
import {CashUpsForWeek} from "./Model/CashUp/CashUpsForWeek";
import {ConstantsExternalState} from "./Redux/Constants/ConstantsExternalState";
import {ConstantsLocalState} from "./Redux/Constants/ConstantsLocalState";
import {constantsExternalReducers, constantsInternalReducers} from "./Redux/Constants/ConstantsRedux";
import {UserRolesExternalState} from "./Redux/UserRole/UserRolesExternalState";
import {UserRolesLocalState} from "./Redux/UserRole/UserRolesLocalState";
import {userRolesExternalReducers, userRolesInternalReducers} from "./Redux/UserRole/UserRolesRedux";
import {RotaExternalState} from "./Redux/Rota/RotaExternalState";
import {rotaExternalReducers, rotaInternalReducers} from "./Redux/Rota/RotaRedux";
import {RotasForWeek} from "./Model/Rota/RotasForWeek";
import {StaffMemberFilters} from "./DataEntry/StaffMembers/State/StaffMemberFilters";
import {StaffMembersExternalState} from "./Redux/StaffMember/StaffMembersExternalState";
import {StaffMembersLocalState} from "./Redux/StaffMember/StaffMembersLocalState";
import {
  staffMemberFiltersReducer,
  staffMembersExternalReducers,
  staffMembersInternalReducers
} from "./Redux/StaffMember/StaffMembersRedux";
import {StaffRolesExternalState} from "./Redux/StaffRole/StaffRolesExternalState";
import {StaffRolesLocalState} from "./Redux/StaffRole/StaffRolesLocalState";
import {staffRolesExternalReducers, staffRolesInternalReducers} from "./Redux/StaffRole/StaffRolesRedux";
import {UsersExternalState} from "./Redux/User/UsersExternalState";
import {UsersLocalState} from "./Redux/User/UsersLocalState";
import {usersExternalReducers, usersInternalReducers} from "./Redux/User/UsersRedux";
import {uiReducers} from "./State/UiRedux";
import {UiState} from "./State/UiState";

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
  rolesExternalState: UserRolesExternalState;
  rolesLocalState: UserRolesLocalState;
  uiState: UiState;
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
  rolesExternalState: userRolesExternalReducers,
  rolesLocalState: userRolesInternalReducers,
  uiState: uiReducers,
};