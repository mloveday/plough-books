import * as moment from "moment";
import {CashUpEntityApiType} from "../DataEntry/CashUp/State/CashUpEntityTypes";
import {DateFormats} from "../Util/DateFormats";

export const cashUpObject = (date: moment.Moment): CashUpEntityApiType => {
  return {
    id: 1,
    date: date.format(DateFormats.API),
    mod: 'mod',
    dailyNotes: 'dailyNotes',
    tills: [],
    chargeToAccount: 0,
    depositRedeemed: 0,
    compsWet: 0,
    dStaffDry: 0,
    dCustomersWet: 0,
    dCustomersDry: 0,
    dCustomersCoffee: 0,
    fwtWet: 0,
    comoInDrawer: 0,
    amexTots: 0,
    visaMcTots: 0,
    receipts: [],
    spendStaffPts: 0,
    comoDiscAsset: 0,
    takeDry: 0,
    takeCoffee: 0,
    takeGiftCard: 0,
    takeDepositPaid: 0,
    paidOutAmnt: 0,
    paidOutTo: 'paidOutTo',
    banked: 0,
    cashAdvantageBag: 'cashAdvantageBag',
    cashAdvantageBagSeenBy: 'cashAdvantageBagSeenBy',
    sfdAm: {
      id: 1,
      fiftyPounds: 0,
      twentyPounds: 0,
      tenPounds: 0,
      fivePounds: 0,
      pounds: 0,
      fiftyPence: 0,
      twentyPence: 0,
      tenPence: 0,
      fivePence: 0,
      initials: 'initials',
    },
    sfdPm: {
      id: 2,
      fiftyPounds: 0,
      twentyPounds: 0,
      tenPounds: 0,
      fivePounds: 0,
      pounds: 0,
      fiftyPence: 0,
      twentyPence: 0,
      tenPence: 0,
      fivePence: 0,
      initials: 'initials',
    },
    sfdNotes: 'sfdNotes',
    pubSecuredBy: 'pubSecuredBy',
    barClosedBy: 'barClosedBy',
    floorClosedBy: 'floorClosedBy',
    nextDoorBy: 'nextDoorBy',
  };
};