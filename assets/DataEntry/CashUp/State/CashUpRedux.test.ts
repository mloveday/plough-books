import * as moment from "moment";
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
      expect(outputState.cashUps.find(cashUp => moment.utc(cashUp.date).isSame(entity.date, 'day'))).toBeTruthy();
      const outputEntity = outputState.getCashUpForDay(moment.utc(entity.date));
      if (outputEntity === undefined) {
        expect(outputEntity).toBeDefined();
        return;
      }
      expect(outputEntity.mod).toEqual(entity.mod);
    });

    it('DATA_ENTRY replaces existing entity fromApi given entity', () => {
      const date = moment.utc();
      const entity = CashUpEntity.default(date).with({mod: 'the expected MOD'});
      const inputState = CashUpsForWeek.default().update([CashUpEntity.default(date).with({mod: 'Not the expected mod'})]);

      const outputState = cashUpInternalReducers(inputState, cashUpDataEntry([entity]));

      expect(Array.from(outputState.cashUps.values()).length).toEqual(1);
      expect(outputState.cashUps.find(cashUp => moment.utc(cashUp.date).isSame(entity.date, 'day'))).toBeTruthy();
      const outputEntity = outputState.getCashUpForDay(moment.utc(entity.date));
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
      const inputState = CashUpsForWeek.default().update([existingEntity]);

      const outputState = cashUpInternalReducers(inputState, cashUpDataEntry([entity]));
      expect(Array.from(outputState.cashUps.values()).length).toEqual(2);

      // expect existing entity to be correct
      expect(outputState.cashUps.find(cashUp => moment.utc(cashUp.date).isSame(entity.date, 'day'))).toBeTruthy();
      const existingOutputEntity = outputState.getCashUpForDay(moment.utc(entity.date));
      if (existingOutputEntity === undefined) {
        expect(existingOutputEntity).toBeDefined();
        return;
      }
      expect(existingOutputEntity.mod).toEqual(existingEntity.mod);

      // expect new entity to be correct
      expect(outputState.cashUps.find(cashUp => moment.utc(cashUp.date).isSame(entity.date, 'day'))).toBeTruthy();
      const newOutputEntity = outputState.getCashUpForDay(moment.utc(entity.date));
      if (newOutputEntity === undefined) {
        expect(newOutputEntity).toBeDefined();
        return;
      }
      expect(newOutputEntity.mod).toEqual(entity.mod);
    });
  });
});