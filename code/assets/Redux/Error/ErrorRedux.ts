import * as log from "loglevel";
import {createAction, handleActions} from "redux-actions";
import {CASH_UP_CREATE_ERROR, CASH_UP_FETCH_ERROR} from "../CashUp/CashUpRedux";
import {CONSTANTS_CREATE_ERROR, CONSTANTS_FETCH_ERROR} from "../Constants/ConstantsRedux";
import {DefinedAction} from "../DefinedAction";
import {ROTA_CREATE_ERROR, ROTA_FETCH_ERROR, WEEKLY_ROTAS_CREATE_ERROR} from "../Rota/RotaRedux";
import {STAFF_MEMBERS_CREATE_ERROR, STAFF_MEMBERS_FETCH_ERROR} from "../StaffMember/StaffMembersRedux";
import {STAFF_ROLES_CREATE_ERROR, STAFF_ROLES_FETCH_ERROR} from "../StaffRole/StaffRolesRedux";
import {USERS_CREATE_ERROR, USERS_FETCH_ERROR} from "../User/UsersRedux";
import {USER_ROLES_CREATE_ERROR, USER_ROLES_FETCH_ERROR} from "../UserRole/UserRolesRedux";
import {ErrorWithDispatch} from "./Error";

const UPDATE_ERROR_STATE = 'UPDATE_ERROR_STATE';
export const setErrorState = createAction<ErrorState>(UPDATE_ERROR_STATE);

export interface ErrorPayload {
  appArea: string;
  error: Error;
  dispatch: () => void;
}

export class ErrorState {
  public static default(): ErrorState {
    return new ErrorState([]);
  }

  public readonly errors: ErrorWithDispatch[];

  constructor(errors: ErrorWithDispatch[]) {
    this.errors = errors;
  }

  public push(error: ErrorWithDispatch): ErrorState {
    log.error(error.error);
    const errors = this.errors.map(e => e.clone());
    errors.push(error);
    return new ErrorState(errors);
  }
}

const handleErrorAction = (state: ErrorState, action: DefinedAction<ErrorPayload>) => state.push(ErrorWithDispatch.fromPayload(action.payload));

export const errorReducers = handleActions<ErrorState, ErrorPayload|ErrorState>({
  [UPDATE_ERROR_STATE]: (state: ErrorState, action: DefinedAction<ErrorState>) => action.payload,

  [CASH_UP_FETCH_ERROR]: handleErrorAction,
  [CASH_UP_CREATE_ERROR]: handleErrorAction,

  [CONSTANTS_FETCH_ERROR]: handleErrorAction,
  [CONSTANTS_CREATE_ERROR]: handleErrorAction,

  [ROTA_FETCH_ERROR]: handleErrorAction,
  [ROTA_CREATE_ERROR]: handleErrorAction,
  [WEEKLY_ROTAS_CREATE_ERROR]: handleErrorAction,

  [STAFF_MEMBERS_FETCH_ERROR]: handleErrorAction,
  [STAFF_MEMBERS_CREATE_ERROR]: handleErrorAction,

  [STAFF_ROLES_FETCH_ERROR]: handleErrorAction,
  [STAFF_ROLES_CREATE_ERROR]: handleErrorAction,

  [USERS_FETCH_ERROR]: handleErrorAction,
  [USERS_CREATE_ERROR]: handleErrorAction,

  [USER_ROLES_FETCH_ERROR]: handleErrorAction,
  [USER_ROLES_CREATE_ERROR]: handleErrorAction,
}, ErrorState.default());