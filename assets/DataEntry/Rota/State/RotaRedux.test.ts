import * as moment from "moment";
import {Action, ActionFunction1} from "redux-actions";
import {Constants} from "../../Constants/State/Constants";
import {IRotaApiObject, RotaEntity} from "./RotaEntity";
import {
  rotaCreateSuccess,
  rotaDataEntry,
  rotaFetchSuccess,
  rotaInternalReducers,
  weeklyRotasCreateSuccess
} from "./RotaRedux";
import {RotasForWeek} from "./RotasForWeek";

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
      const existingRota = RotaEntity.default(existingDate).update({forecastRevenue: 5});
      const newRota = RotaEntity.default(newDate).update({forecastRevenue: 7});
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
      const newRota = RotaEntity.default(moment.utc());

      const testSuccessFunction = (fn: ActionFunction1<{date: moment.Moment, response: IRotaApiObject[]}, Action<{date: moment.Moment, response: IRotaApiObject[]}>>) => {
        const modified = rotaInternalReducers(existingState, fn({date: newRota.getDate(), response: [newRota]}));

        expect(modified.hasRotaForDate(newRota.getDate())).toBeTruthy();
        expect(modified.getRotaForDate(newRota.getDate())).toEqual(newRota);
      };
      testSuccessFunction(rotaCreateSuccess);
      testSuccessFunction(rotaFetchSuccess);
      testSuccessFunction(weeklyRotasCreateSuccess);
    });
    it('Parses date & API response into new rota', () => {
      const existingDate = moment.utc();
      const newDate = moment.utc().add(1, 'day');
      const existingRota = RotaEntity.default(existingDate).update({id: 3, forecastRevenue: 5, constants: Constants.placeholder()});
      const newRota = RotaEntity.default(newDate).update({id: 4, forecastRevenue: 6, constants: Constants.placeholder()});
      const existingState = RotasForWeek.default().update([existingRota]);
      expect(existingState.hasRotaForDate(existingRota.getDate()));

      const testSuccessFunction = (fn: ActionFunction1<{date: moment.Moment, response: IRotaApiObject[]}, Action<{date: moment.Moment, response: IRotaApiObject[]}>>) => {
        const modified = rotaInternalReducers(existingState, fn({date: newRota.getDate(), response: [newRota]}));

        expect(modified.hasRotaForDate(existingRota.getDate())).toBeTruthy();
        expect(modified.getRotaForDate(existingRota.getDate())).toEqual(existingRota);

        expect(modified.hasRotaForDate(newRota.getDate())).toBeTruthy();
        expect(modified.getRotaForDate(newRota.getDate())).toEqual(newRota);

      };
      testSuccessFunction(rotaCreateSuccess);
      testSuccessFunction(rotaFetchSuccess);
      testSuccessFunction(weeklyRotasCreateSuccess);
    });
  });
});