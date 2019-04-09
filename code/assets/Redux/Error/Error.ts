import {ErrorPayload} from "./ErrorRedux";

export class ErrorWithDispatch {
  public static fromPayload(payload: ErrorPayload) {
    return new ErrorWithDispatch(payload.error, payload.appArea, payload.dispatch);
  }

  public readonly error: Error;
  public readonly appArea: string;
  public readonly dispatch: () => void;

  constructor(error: Error, appArea: string, dispatch: () => void) {
    this.error = error;
    this.appArea = appArea;
    this.dispatch = dispatch;
  }

  public clone(): ErrorWithDispatch {
    return new ErrorWithDispatch(this.error, this.appArea, this.dispatch);
  }
}