import * as moment from "moment";
import {DateFormats} from "../../../Util/DateFormats";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityInputs} from "../../../Model/CashUp/CashUpEntityInputs";
import {SafeFloatDenominations} from "../../../Model/Denominations/SafeFloatDenominations";
import {TillDenominations} from "../../../Model/Denominations/TillDenominations";

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