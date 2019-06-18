import * as moment from "moment";
import {CashUpEntity} from "../../Model/CashUp/CashUpEntity";
import {CashUpsForWeek} from "../../Model/CashUp/CashUpsForWeek";
import {cashUpObject} from '../../TestHelpers/ApiResponseHelpers';
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDate} from "../../Util/DateUtils";
import {cashUpCreateSuccess, cashUpDataEntry, cashUpFetchSuccess, cashUpInternalReducers} from "./CashUpRedux";

describe('CashUpRedux', () => {
  describe('internal reducer', () => {
    describe('DATA_ENTRY', () => {
      it('returns new state object from given object', () => {
        const entity = CashUpEntity.default(moment.utc()).with({mod: 'some MOD'});
        const inputState = CashUpsForWeek.default();

        const outputState = cashUpInternalReducers(inputState, cashUpDataEntry([entity]));

        expect(outputState.cashUps.length).toEqual(1);
        expect(outputState.cashUps.find(cashUp => momentFromDate(cashUp.date).isSame(moment.utc(entity.date), 'day'))).toBeTruthy();
        const outputEntity = outputState.getCashUpForDay(momentFromDate(entity.date));
        if (outputEntity === undefined) {
          expect(outputEntity).toBeDefined();
          return;
        }
        expect(outputEntity.mod).toEqual(entity.mod);
      });

      it('replaces existing entity fromApi given entity', () => {
        const date = moment.utc();
        const entity = CashUpEntity.default(date).with({mod: 'the expected MOD'});
        const inputState = CashUpsForWeek.default().update([CashUpEntity.default(date).with({mod: 'Not the expected mod'})]);

        const outputState = cashUpInternalReducers(inputState, cashUpDataEntry([entity]));

        expect(outputState.cashUps.length).toEqual(1);
        expect(outputState.cashUps.find(cashUp => momentFromDate(cashUp.date).isSame(momentFromDate(entity.date), 'day'))).toBeTruthy();
        const outputEntity = outputState.getCashUpForDay(momentFromDate(entity.date));
        if (outputEntity === undefined) {
          expect(outputEntity).toBeDefined();
          return;
        }
        expect(outputEntity.mod).toEqual(entity.mod);
      });

      it('does not remove existing entity when adding new entries', () => {
        const date = moment.utc();
        const otherDate = moment.utc().subtract(1, 'week');
        const entity = CashUpEntity.default(otherDate).with({mod: 'the expected MOD'});
        const existingEntity = CashUpEntity.default(date).with({mod: 'Not the expected mod'});
        const inputState = CashUpsForWeek.default().update([existingEntity]);

        const outputState = cashUpInternalReducers(inputState, cashUpDataEntry([entity]));
        expect(outputState.cashUps.length).toEqual(2);

        // expect existing entity to be correct
        expect(outputState.cashUps.find(cashUp => momentFromDate(cashUp.date).isSame(momentFromDate(entity.date), 'day'))).toBeTruthy();
        const existingOutputEntity = outputState.getCashUpForDay(momentFromDate(existingEntity.date));
        if (existingOutputEntity === undefined) {
          expect(existingOutputEntity).toBeDefined();
          return;
        }
        expect(existingOutputEntity.mod).toEqual(existingEntity.mod);

        // expect new entity to be correct
        expect(outputState.cashUps.find(cashUp => momentFromDate(cashUp.date).isSame(momentFromDate(entity.date), 'day'))).toBeTruthy();
        const newOutputEntity = outputState.getCashUpForDay(momentFromDate(entity.date));
        if (newOutputEntity === undefined) {
          expect(newOutputEntity).toBeDefined();
          return;
        }
        expect(newOutputEntity.mod).toEqual(entity.mod);
      });
    });
    describe('FETCH_SUCCESS', () => {
      it('creates blank cash ups for given week', () => {
        const date = moment.utc();
        const inputState = CashUpsForWeek.default();

        const outputState = cashUpInternalReducers(inputState, cashUpFetchSuccess({date, response: []}));

        expect(outputState.cashUps.length).toEqual(7);
        [
          date.clone().startOf('isoWeek'),
          date.clone().startOf('isoWeek').add(1, "days"),
          date.clone().startOf('isoWeek').add(2, "days"),
          date.clone().startOf('isoWeek').add(3, "days"),
          date.clone().startOf('isoWeek').add(4, "days"),
          date.clone().startOf('isoWeek').add(5, "days"),
          date.clone().startOf('isoWeek').add(6, "days"),
        ].forEach(dateInWeek => {
          expect(outputState.cashUps.find(cashUp => cashUp.date === dateInWeek.format(DateFormats.API_DATE))).toBeTruthy();
          const outputEntity = outputState.getCashUpForDay(dateInWeek.clone());
          if (outputEntity === undefined) {
            expect(outputEntity).toBeDefined();
            return;
          }
        });
      });
      it('populates with received response', () => {
        const date = moment.utc();
        const entity = cashUpObject(date.clone().add(1, 'month'));
        const inputState = CashUpsForWeek.default();

        const outputState = cashUpInternalReducers(inputState, cashUpFetchSuccess({date, response: [entity]}));

        expect(outputState.cashUps.length).toEqual(8); // number in input + new entity
        expect(outputState.cashUps.find(cashUp => cashUp.date === entity.date)).toBeTruthy();
        const outputEntity = outputState.getCashUpForDay(momentFromDate(entity.date));
        if (outputEntity === undefined) {
          expect(outputEntity).toBeDefined();
          return;
        }
        expect(outputEntity.mod).toEqual(entity.mod);
      });
      it('does not remove existing entity when adding new entries', () => {
        const date = moment.utc();
        const entity = cashUpObject(date.clone().add(1, 'month'));
        const inputState = CashUpsForWeek.default();

        const outputState = cashUpInternalReducers(inputState, cashUpFetchSuccess({date, response: [entity]}));

        expect(outputState.cashUps.length).toEqual(8); // number in input + new entity
        [
          date.clone().startOf('isoWeek'),
          date.clone().startOf('isoWeek').add(1, "days"),
          date.clone().startOf('isoWeek').add(2, "days"),
          date.clone().startOf('isoWeek').add(3, "days"),
          date.clone().startOf('isoWeek').add(4, "days"),
          date.clone().startOf('isoWeek').add(5, "days"),
          date.clone().startOf('isoWeek').add(6, "days"),
        ].forEach(dateInWeek => {
          expect(outputState.cashUps.find(cashUp => cashUp.date === dateInWeek.format(DateFormats.API_DATE))).toBeTruthy();
          const outputEntity = outputState.getCashUpForDay(dateInWeek.clone());
          if (outputEntity === undefined) {
            expect(outputEntity).toBeDefined();
            return;
          }
        });
      });
    });
    describe('CREATE_SUCCESS', () => {
      it('populates with received response', () => {
        const date = moment.utc();
        const entity = cashUpObject(date.clone().add(1, 'month'));
        const inputState = CashUpsForWeek.default();

        const outputState = cashUpInternalReducers(inputState, cashUpCreateSuccess({date, response: [entity]}));

        expect(outputState.cashUps.length).toEqual(1); // just new entity
        expect(outputState.cashUps.find(cashUp => cashUp.date === entity.date)).toBeTruthy();
        const outputEntity = outputState.getCashUpForDay(momentFromDate(entity.date));
        if (outputEntity === undefined) {
          expect(outputEntity).toBeDefined();
          return;
        }
        expect(outputEntity.mod).toEqual(entity.mod);
      });
      it('does not remove existing entity when adding new entries', () => {
        const date = moment.utc();
        const entity = cashUpObject(date.clone().add(1, 'month'));
        const inputState = CashUpsForWeek.defaultForWeek(date);

        const outputState = cashUpInternalReducers(inputState, cashUpCreateSuccess({date, response: [entity]}));

        expect(outputState.cashUps.length).toEqual(8); // number in input + new entity
        [
          date.clone().startOf('isoWeek'),
          date.clone().startOf('isoWeek').add(1, "days"),
          date.clone().startOf('isoWeek').add(2, "days"),
          date.clone().startOf('isoWeek').add(3, "days"),
          date.clone().startOf('isoWeek').add(4, "days"),
          date.clone().startOf('isoWeek').add(5, "days"),
          date.clone().startOf('isoWeek').add(6, "days"),
        ].forEach(dateInWeek => {
          expect(outputState.cashUps.find(cashUp => cashUp.date === dateInWeek.format(DateFormats.API_DATE))).toBeTruthy();
          const outputEntity = outputState.getCashUpForDay(dateInWeek.clone());
          if (outputEntity === undefined) {
            expect(outputEntity).toBeDefined();
            return;
          }
        });
      });
    });
  });
});