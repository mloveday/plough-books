import * as moment from "moment";
import {DateFormats} from "../../../Util/DateFormats";
import {CashUpEntity} from "./CashUpEntity";
import {cashUpDataEntry, cashUpInternalReducers} from "./CashUpRedux";
import {CashUpsForWeek} from "./CashUpsForWeek";

describe('CashUpRedux', () => {
  describe('internal reducer', () => {
    it('DATA_ENTRY returns new state object from given object', () => {
      const entity = CashUpEntity.default(moment.utc()).with({mod: 'some MOD'});
      const inputState = CashUpsForWeek.default();

      const outputState = cashUpInternalReducers(inputState, cashUpDataEntry([entity]));

      expect(Array.from(outputState.cashUps.values()).length).toEqual(1);
      expect(outputState.cashUps.has(entity.date.format(DateFormats.API))).toBeTruthy();
      const outputEntity = outputState.cashUps.get(entity.date.format(DateFormats.API));
      if (outputEntity === undefined) {
        expect(outputEntity).toBeDefined();
        return;
      }
      expect(outputEntity.mod).toEqual(entity.mod);
    });

    it('DATA_ENTRY replaces existing entity with given entity', () => {
      const date = moment.utc();
      const entity = CashUpEntity.default(date).with({mod: 'the expected MOD'});
      const inputState = CashUpsForWeek.default().with([CashUpEntity.default(date).with({mod: 'Not the expected mod'})]);

      const outputState = cashUpInternalReducers(inputState, cashUpDataEntry([entity]));

      expect(Array.from(outputState.cashUps.values()).length).toEqual(1);
      expect(outputState.cashUps.has(entity.date.format(DateFormats.API))).toBeTruthy();
      const outputEntity = outputState.cashUps.get(entity.date.format(DateFormats.API));
      if (outputEntity === undefined) {
        expect(outputEntity).toBeDefined();
        return;
      }
      expect(outputEntity.mod).toEqual(entity.mod);
    });

    it('DATA_ENTRY does not remove existing entity when adding new entries', () => {
      const date = moment.utc();
      const otherDate = moment.utc().subtract(1, 'week');
      const entity = CashUpEntity.default(otherDate).with({mod: 'the expected MOD'});
      const existingEntity = CashUpEntity.default(date).with({mod: 'Not the expected mod'});
      const inputState = CashUpsForWeek.default().with([existingEntity]);

      const outputState = cashUpInternalReducers(inputState, cashUpDataEntry([entity]));
      expect(Array.from(outputState.cashUps.values()).length).toEqual(2);

      // expect existing entity to be correct
      expect(outputState.cashUps.has(existingEntity.date.format(DateFormats.API))).toBeTruthy();
      const existingOutputEntity = outputState.cashUps.get(existingEntity.date.format(DateFormats.API));
      if (existingOutputEntity === undefined) {
        expect(existingOutputEntity).toBeDefined();
        return;
      }
      expect(existingOutputEntity.mod).toEqual(existingEntity.mod);

      // expect new entity to be correct
      expect(outputState.cashUps.has(entity.date.format(DateFormats.API))).toBeTruthy();
      const newOutputEntity = outputState.cashUps.get(entity.date.format(DateFormats.API));
      if (newOutputEntity === undefined) {
        expect(newOutputEntity).toBeDefined();
        return;
      }
      expect(newOutputEntity.mod).toEqual(entity.mod);
    });
  });
});