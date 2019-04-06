import * as moment from "moment";
import {CashUpEntity} from "./CashUpEntity";
import {CashUpEntityInputs} from "./CashUpEntityInputs";
import {SafeFloatDenominations} from "../Denominations/SafeFloatDenominations";
import {TillDenominations} from "../Denominations/TillDenominations";
import {DateFormats} from "../../Util/DateFormats";

export class PlaceholderCashUp extends CashUpEntity {
  public static default(date: moment.Moment): PlaceholderCashUp {
    return new PlaceholderCashUp(
      moment.utc(date).format(DateFormats.API),
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
      undefined,
      CashUpEntityInputs.default(date),
    );
  }

  public isValid() {
    return false;
  }

  public getTotalRevenue(): number {
    return 0;
  }
}