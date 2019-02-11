import * as moment from "moment";
import {CashUpEntity} from "./CashUpEntity";
import {SafeFloatDenominations} from "./Denominations/SafeFloatDenominations";
import {TillDenominations} from "./Denominations/TillDenominations";

export class PlaceholderCashUp extends CashUpEntity {
  public static default(date: moment.Moment): PlaceholderCashUp {
    return new PlaceholderCashUp(
      moment.utc(date),
      '',
      'No cash up for today',
      [
        TillDenominations.default(),
        TillDenominations.default(),
        TillDenominations.default(),
        TillDenominations.default(),
        TillDenominations.default(),
        TillDenominations.default(),
        TillDenominations.default(),
      ],
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      [],
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      '',
      0,
      '',
      '',
      SafeFloatDenominations.default(),
      SafeFloatDenominations.default(),
      '',
      '',
      '',
      '',
      '',
      true,
    );
  }

  public isValid() {
    return false;
  }

  public getTotalRevenue(): number {
    return 0;
  }
}