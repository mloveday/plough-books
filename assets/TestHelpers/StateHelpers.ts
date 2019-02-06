import {AuthenticatedUserResponse} from "../Common/Auth/Model/AuthenticatedUserResponse";
import {User} from "../Common/Auth/Model/User";
import {AuthState} from '../Common/Auth/State/AuthState';
import {CashUpExternalState} from "../DataEntry/CashUp/State/CashUpExternalState";
import {CashUpsForWeek} from "../DataEntry/CashUp/State/CashUpsForWeek";
import {Constants} from '../DataEntry/Constants/State/Constants';
import {ConstantsExternalState} from '../DataEntry/Constants/State/ConstantsExternalState';
import {ConstantsLocalState} from "../DataEntry/Constants/State/ConstantsLocalState";
import {RolesExternalState} from "../DataEntry/Role/State/RolesExternalState";
import {RolesLocalState} from "../DataEntry/Role/State/RolesLocalState";
import {RotaExternalState} from "../DataEntry/Rota/State/RotaExternalState";
import {RotasForWeek} from "../DataEntry/Rota/State/RotasForWeek";
import {StaffMemberFilters} from "../DataEntry/StaffMembers/State/StaffMemberFilters";
import {StaffMembersExternalState} from "../DataEntry/StaffMembers/State/StaffMembersExternalState";
import {StaffMembersLocalState} from "../DataEntry/StaffMembers/State/StaffMembersLocalState";
import {StaffRolesExternalState} from "../DataEntry/StaffRoles/State/StaffRolesExternalState";
import {StaffRolesLocalState} from '../DataEntry/StaffRoles/State/StaffRolesLocalState';
import {UsersExternalState} from "../DataEntry/User/State/UsersExternalState";
import {UsersLocalState} from "../DataEntry/User/State/UsersLocalState";
import {FetchStatus} from "../Enum/FetchStatus";
import {AppState} from "../redux";
import {UiState} from "../State/UiState";

export interface AppStateUpdate {
  authState?: AuthState;
  cashUpExternalState?: CashUpExternalState;
  cashUpLocalStates?: CashUpsForWeek;
  constantsExternalState?: ConstantsExternalState;
  constantsLocalState?: ConstantsLocalState;
  rotaExternalState?: RotaExternalState;
  rotaLocalStates?: RotasForWeek;
  staffMembersExternalState?: StaffMembersExternalState;
  staffMembersLocalState?: StaffMembersLocalState;
  staffMemberFilters?: StaffMemberFilters;
  staffRolesExternalState?: StaffRolesExternalState;
  staffRolesLocalState?: StaffRolesLocalState;
  usersExternalState?: UsersExternalState;
  usersLocalState?: UsersLocalState;
  rolesExternalState?: RolesExternalState;
  rolesLocalState?: RolesLocalState;
  uiState?: UiState;
}

export class StateHelpers {
  public static blankAppState(): AppState {
    return {
      authState: AuthState.cleared(),
      cashUpExternalState: new CashUpExternalState(),
      cashUpLocalStates: new CashUpsForWeek(),
      constantsExternalState: (new ConstantsExternalState()).with(new ConstantsLocalState(), new Map<string, FetchStatus>()),
      constantsLocalState: new ConstantsLocalState(),
      rotaExternalState: new RotaExternalState(),
      rotaLocalStates: new RotasForWeek([]),
      staffMembersExternalState: new StaffMembersExternalState(),
      staffMembersLocalState: new StaffMembersLocalState(),
      staffMemberFilters: new StaffMemberFilters(),
      staffRolesExternalState: (new StaffRolesExternalState()).with(new StaffRolesLocalState(), new Map<string, FetchStatus>()),
      staffRolesLocalState: new StaffRolesLocalState(),
      usersExternalState: new UsersExternalState(),
      usersLocalState: new UsersLocalState(),
      rolesExternalState: new RolesExternalState(),
      rolesLocalState: new RolesLocalState(),
      uiState: new UiState()
    };
  }

  public static appStateWith(obj: AppStateUpdate) {
    return Object.assign({}, this.blankAppState(), obj);
  }

  public static authState() {
    return AuthState.cleared().withAuthentication(AuthenticatedUserResponse.fromResponse({
      El: '115549802405448388321',
      Zi: {
        token_type: 'Bearer',
        access_token: 'e',
        scope: 'openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email',
        login_hint: 'd',
        expires_in: 3599,
        id_token: 'c',
        session_state: {extraQueryParams: {authuser: '1'}},
        first_issued_at: 1549315028420,
        expires_at: 1549318627420,
        idpId: 'google'
      },
      w3: {
        Eea: '1',
        ig: 'A Person',
        ofa: 'A',
        wea: 'Person',
        Paa: 'http://a.website.com/photo.jpg',
        U3: 'person@theploughharborne.co.uk'
      },
      googleId: '1',
      tokenObj: {
        token_type: 'Bearer',
        access_token: 'e',
        scope: 'openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email',
        login_hint: 'd',
        expires_in: 3599,
        id_token: 'c',
        session_state: {extraQueryParams: {authuser: '1'}},
        first_issued_at: 1549315028420,
        expires_at: 1549318627420,
        idpId: 'google'
      },
      tokenId: 'b',
      accessToken: 'a',
      profileObj: {
        googleId: '1',
        imageUrl: 'http://a.website.com/photo.jpg',
        email: 'person@theploughharborne.co.uk',
        name: 'Miles Loveday',
        givenName: 'A',
        familyName: 'Person'
      }
    }))
      .withUser(User.fromResponse({
        email: 'person@theploughharborne.co.uk',
        whitelisted: true,
        blacklisted: false,
        role: {role: 'admin', managesUsers: true, id: 1},
        id: 1
      }));
  }

  public static constantsState() {
    return (new ConstantsExternalState()).externalState.withEntities([Constants.fromResponse({
      date: '2014-04-21T00:00:00.000Z',
      fixedCosts: 4946.23,
      labourRate: 0.28,
      vatMultiplier: 1.2,
      barProportionOfRevenue: 0.5,
      hoursPerShortBreak: 6,
      shortBreakDuration: 0.5,
      hoursPerLongBreak: 10.5,
      longBreakDuration: 1,
      ersThreshold: 144,
      ersPercentAboveThreshold: 0.138,
      holidayLinearPercent: 0.12086,
      pensionLinearPercent: 0,
      id: 1
    })]);
  }

  public static staffRolesState() {
    return (new StaffRolesLocalState()).withEntities([{role: 'Bar back', orderInRota: 4, status: 'active', type: 'bar', id: 3}, {
        role: 'Barista',
        orderInRota: 3,
        status: 'active',
        type: 'bar',
        id: 4
      }, {role: 'Ops Manager', orderInRota: 2, status: 'active', type: 'bar', id: 5}, {
        role: 'bar import',
        orderInRota: 0,
        status: 'imported',
        type: 'bar',
        id: 1
      }, {role: 'kitchen import', orderInRota: 0, status: 'imported', type: 'kitchen', id: 2}]
    );
  }
}