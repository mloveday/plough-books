import {CashUpPage} from "./CashUpPage";

const discounts = 'discounts';
const pettyCash = 'petty-cash';
const accounts = 'accounts';
const deposits = 'deposits';
const spendStaffPts = 'spend-staff-pts';
const nettTakes = 'nett-takes';
const banking = 'banking';
const safeFloat = 'safe-float';
const security = 'security';
const tills = 'tills';
const skims = 'skims';
const changes = 'changes';

export const cashUpPageUrlParamFor = (section: CashUpPage): string => {
  switch (section) {
    case CashUpPage.DISCOUNTS:
      return discounts;
    case CashUpPage.RECEIPTS:
      return pettyCash;
    case CashUpPage.ACCOUNTS:
      return accounts;
    case CashUpPage.DEPOSITS:
      return deposits;
    case CashUpPage.SPEND_STAFF_PTS_COMO:
      return spendStaffPts;
    case CashUpPage.NETT_TAKES:
      return nettTakes;
    case CashUpPage.BANKING:
      return banking;
    case CashUpPage.SAFE_FLOAT:
      return safeFloat;
    case CashUpPage.SECURITY:
      return security;
    case CashUpPage.SKIMS:
      return skims;
    case CashUpPage.CHANGES:
      return changes;
    case CashUpPage.TILLS:
    default:
      return tills;
  }
};

export const cashUpPageFrom = (param: string): CashUpPage => {
  switch (param) {
    case discounts:
      return CashUpPage.DISCOUNTS;
    case pettyCash:
      return CashUpPage.RECEIPTS;
    case accounts:
      return CashUpPage.ACCOUNTS;
    case deposits:
      return CashUpPage.DEPOSITS;
    case spendStaffPts:
      return CashUpPage.SPEND_STAFF_PTS_COMO;
    case nettTakes:
      return CashUpPage.NETT_TAKES;
    case banking:
      return CashUpPage.BANKING;
    case safeFloat:
      return CashUpPage.SAFE_FLOAT;
    case security:
      return CashUpPage.SECURITY;
    case skims:
      return CashUpPage.SKIMS;
    case changes:
      return CashUpPage.CHANGES;
    case tills:
    default:
      return CashUpPage.TILLS;
  }
};