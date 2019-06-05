import {StaffMemberFilters} from "../DataEntry/StaffMembers/State/StaffMemberFilters";
import {CashUpsForWeek} from "../Model/CashUp/CashUpsForWeek";
import {Constants} from '../Model/Constants/Constants';
import {FetchStatus} from "../Model/Enum/FetchStatus";
import {RotasForWeek} from "../Model/Rota/RotasForWeek";
import {StaffRole} from "../Model/StaffRole/StaffRole";
import {User} from "../Model/User/User";
import {AppState} from "../redux";
import {AuthState} from '../Redux/Auth/AuthState';
import {AuthenticatedUserResponse} from "../Redux/Auth/Model/AuthenticatedUserResponse";
import {CashUpExternalState} from "../Redux/CashUp/CashUpExternalState";
import {ConstantsExternalState} from '../Redux/Constants/ConstantsExternalState';
import {ConstantsLocalState} from "../Redux/Constants/ConstantsLocalState";
import {ErrorState} from "../Redux/Error/ErrorRedux";
import {RotaExternalState} from "../Redux/Rota/RotaExternalState";
import {RotaStaffingTemplatesExternalState} from "../Redux/RotaStaffingTemplates/RotaStaffingTemplatesExternalState";
import {RotaStaffingTemplatesLocalState} from "../Redux/RotaStaffingTemplates/RotaStaffingTemplatesLocalState";
import {StaffMembersExternalState} from "../Redux/StaffMember/StaffMembersExternalState";
import {StaffMembersLocalState} from "../Redux/StaffMember/StaffMembersLocalState";
import {StaffRolesExternalState} from "../Redux/StaffRole/StaffRolesExternalState";
import {StaffRolesLocalState} from '../Redux/StaffRole/StaffRolesLocalState';
import {UiState} from "../Redux/UI/UiState";
import {UsersExternalState} from "../Redux/User/UsersExternalState";
import {UsersLocalState} from "../Redux/User/UsersLocalState";
import {UserRolesExternalState} from "../Redux/UserRole/UserRolesExternalState";
import {UserRolesLocalState} from "../Redux/UserRole/UserRolesLocalState";

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
  rolesExternalState?: UserRolesExternalState;
  rolesLocalState?: UserRolesLocalState;
  uiState?: UiState;
}

export class StateHelpers {
  public static normalUser() {
    return User.fromApi({
      email: 'user@theploughharborne.co.uk',
      whitelisted: true,
      blacklisted: false,
      role: {role: 'normal user', managesUsers: false, id: 1},
      id: 1
    });
  }
  public static adminUser() {
    return User.fromApi({
      email: 'admin@theploughharborne.co.uk',
      whitelisted: true,
      blacklisted: false,
      role: {role: 'admin', managesUsers: true, id: 1},
      id: 1
    });
  }

  public static blankAppState(): AppState {
    return {
      authState: AuthState.cleared(),
      cashUpExternalState: new CashUpExternalState(),
      cashUpLocalStates: new CashUpsForWeek([]),
      constantsExternalState: (new ConstantsExternalState()).with(new ConstantsLocalState(), new Map<string, FetchStatus>()),
      constantsLocalState: new ConstantsLocalState(),
      errors: ErrorState.default(),
      rotaExternalState: new RotaExternalState(),
      rotaLocalStates: new RotasForWeek([]),
      rotaStaffingTemplatesLocalState: RotaStaffingTemplatesLocalState.default(),
      rotaStaffingTemplatesExternalState: new RotaStaffingTemplatesExternalState(),
      staffMembersExternalState: new StaffMembersExternalState(),
      staffMembersLocalState: new StaffMembersLocalState(),
      staffMemberFilters: new StaffMemberFilters(),
      staffRolesExternalState: (new StaffRolesExternalState()).with(new StaffRolesLocalState(), new Map<string, FetchStatus>()),
      staffRolesLocalState: new StaffRolesLocalState(),
      usersExternalState: new UsersExternalState(),
      usersLocalState: new UsersLocalState(),
      rolesExternalState: new UserRolesExternalState(),
      rolesLocalState: new UserRolesLocalState(),
      uiState: new UiState()
    };
  }

  public static appStateWith(obj: AppStateUpdate) {
    return Object.assign({}, this.blankAppState(), obj);
  }

  public static authState(user: User = this.adminUser()) {
    return AuthState.cleared().withAuthentication(AuthenticatedUserResponse.fromApi({
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
      .withUser(user);
  }

  public static constantsState() {
    return (new ConstantsExternalState()).externalState.withEntities([Constants.fromApi({
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
    return (new StaffRolesLocalState()).withEntities([
      StaffRole.fromApi({role: 'Bar back', orderInRota: 4, status: 'active', type: 'bar', id: 3}),
      StaffRole.fromApi({role: 'Barista', orderInRota: 3, status: 'active', type: 'bar', id: 4}),
      StaffRole.fromApi({role: 'Ops Manager', orderInRota: 2, status: 'active', type: 'bar', id: 5}),
      StaffRole.fromApi({role: 'bar import', orderInRota: 0, status: 'imported', type: 'bar', id: 1}),
      StaffRole.fromApi({role: 'kitchen import', orderInRota: 0, status: 'imported', type: 'kitchen', id: 2})]
    );
  }
}