import * as moment from "moment";
import {Action, ActionFunction1} from "redux-actions";
import {RotaEntity} from "../../Model/Rota/RotaEntity";
import {RotasForWeek} from "../../Model/Rota/RotasForWeek";
import {RotaApiType} from "../../Model/Rota/RotaTypes";
import {rotaObject} from "../../TestHelpers/ApiResponseHelpers";
import {momentFromDate} from "../../Util/DateUtils";
import {
  rotaCreateSuccess,
  rotaDataEntry,
  rotaFetchSuccess,
  rotaInternalReducers,
  weeklyRotasCreateSuccess
} from "./RotaRedux";

describe('RotaRedux internal reducer', () => {
  describe('data entry action', () => {
    it('updates empty state with rota', () => {
      const existingState = RotasForWeek.default();
      const newRota = RotaEntity.default(moment.utc());

      const modified = rotaInternalReducers(existingState, rotaDataEntry([newRota]));

      expect(modified.hasRotaForDate(newRota.getDate())).toBeTruthy();
      expect(modified.getRotaForDate(newRota.getDate())).toEqual(newRota);
    });
    it('does not delete existing rotas when adding new rotas', () => {
      const existingDate = moment.utc();
      const newDate = moment.utc().add(1, 'day');
      const existingRota = RotaEntity.default(existingDate).update({forecastRevenue: '5'});
      const newRota = RotaEntity.default(newDate).update({forecastRevenue: '7'});
      const existingState = RotasForWeek.default().update([existingRota]);
      expect(existingState.hasRotaForDate(existingRota.getDate()));


      const modified = rotaInternalReducers(existingState, rotaDataEntry([newRota]));

      expect(modified.hasRotaForDate(existingRota.getDate())).toBeTruthy();
      expect(modified.getRotaForDate(existingRota.getDate())).toEqual(existingRota);

      expect(modified.hasRotaForDate(newRota.getDate())).toBeTruthy();
      expect(modified.getRotaForDate(newRota.getDate())).toEqual(newRota);
    });
  });
  describe('fetch success actions', () => {
    it('Parses date & API response into new rota', () => {
      const existingState = RotasForWeek.default();
      const newRota = rotaObject(moment.utc());

      const testSuccessFunction = (fn: ActionFunction1<{date: moment.Moment, response: RotaApiType[]}, Action<{date: moment.Moment, response: RotaApiType[]}>>) => {
        const modified = rotaInternalReducers(existingState, fn({date: momentFromDate(newRota.date), response: [newRota]}));

        expect(modified.hasRotaForDate(momentFromDate(newRota.date))).toBeTruthy();
        expect(modified.getRotaForDate(momentFromDate(newRota.date))).toEqual(RotaEntity.fromApi(newRota));
      };
      testSuccessFunction(rotaCreateSuccess);
      testSuccessFunction(rotaFetchSuccess);
      testSuccessFunction(weeklyRotasCreateSuccess);
    });
    it('Parses date & API response into new rota', () => {
      const existingDate = moment.utc();
      const newDate = moment.utc().add(1, 'day');
      const existingRota = RotaEntity.fromApi(Object.assign(rotaObject(existingDate), {id: 3, forecastRevenue: '5'}));
      const newRota = Object.assign(rotaObject(newDate), {id: 4, forecastRevenue: 6});
      const existingState = RotasForWeek.default().update([existingRota]);
      expect(existingState.hasRotaForDate(existingRota.getDate()));

      const testSuccessFunction = (fn: ActionFunction1<{date: moment.Moment, response: RotaApiType[]}, Action<{date: moment.Moment, response: RotaApiType[]}>>) => {
        const modified = rotaInternalReducers(existingState, fn({date: momentFromDate(newRota.date), response: [newRota]}));

        expect(modified.hasRotaForDate(existingRota.getDate())).toBeTruthy();
        expect(modified.getRotaForDate(existingRota.getDate())).toEqual(existingRota);

        expect(modified.hasRotaForDate(momentFromDate(newRota.date))).toBeTruthy();
        expect(modified.getRotaForDate(momentFromDate(newRota.date))).toEqual(RotaEntity.fromApi(newRota));

      };
      testSuccessFunction(rotaCreateSuccess);
      testSuccessFunction(rotaFetchSuccess);
      testSuccessFunction(weeklyRotasCreateSuccess);
    });
  });
});