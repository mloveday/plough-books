import {ApiType, EntityType, InputType, UpdateType} from "../../../State/TypeWithNumericalInputs";
import {SafeFloatDenominations} from "./Denominations/SafeFloatDenominations";
import {SafeFloatDenominationsApiType} from "./Denominations/SafeFloatDenominationsTypes";
import {TillDenominations} from "./Denominations/TillDenominations";
import {TillDenominationsApiType} from "./Denominations/TillDenominationsTypes";
import {Receipt} from "./Receipt";
import {ReceiptApiType} from "./ReceiptTypes";

export abstract class CashUpEntityAbstract<T, Till, Sfd, Rcpt> {
  public readonly date: string;

  public readonly mod: string;
  public readonly dailyNotes: string;

  public readonly tills: Till[];
  
  public readonly chargeToAccount: T;
  public readonly depositRedeemed: T;
  
  public readonly compsWet: T;
  public readonly dStaffDry: T;
  public readonly dCustomersWet: T;
  public readonly dCustomersDry: T;
  public readonly dCustomersCoffee: T;
  public readonly fwtWet: T;
  public readonly comoInDrawer: T;

  public readonly amexTots: T;
  public readonly visaMcTots: T;

  public readonly receipts: Rcpt[];
  public readonly spendStaffPts: T;
  public readonly comoDiscAsset: T;

  public readonly takeDry: T;
  public readonly takeCoffee: T;
  public readonly takeGiftCard: T;
  public readonly takeDepositPaid: T;

  public readonly paidOutAmount: T;
  public readonly paidOutTo: string;
  public readonly banked: T;
  public readonly cashAdvantageBag: string;
  public readonly cashAdvantageBagSeenBy: string;
  
  public readonly sfdAm: Sfd;
  public readonly sfdPm: Sfd;

  public readonly sfdNotes: string;
  public readonly pubSecuredBy: string;
  public readonly barClosedBy: string;
  public readonly floorClosedBy: string;
  public readonly nextDoorBy: string;

  constructor(date: string, mod: string, dailyNotes: string, tills: Till[], chargeToAccount: T, depositRedeemed: T, compsWet: T, dStaffDry: T, dCustomersWet: T, dCustomersDry: T, dCustomersCoffee: T, fwtWet: T, comoInDrawer: T, amexTots: T, visaMcTots: T, receipts: Rcpt[], spendStaffPts: T, comoDiscAsset: T, takeDry: T, takeCoffee: T, takeGiftCard: T, takeDepositPaid: T, paidOutAmnt: T, paidOutTo: string, banked: T, cashAdvantageBag: string, cashAdvantageBagSeenBy: string, sfdAm: Sfd, sfdPm: Sfd, sfdNotes: string, pubSecuredBy: string, barClosedBy: string, floorClosedBy: string, nextDoorBy: string) {
    this.date = date;
    this.mod = mod;
    this.dailyNotes = dailyNotes;
    this.tills = tills;
    this.chargeToAccount = chargeToAccount;
    this.depositRedeemed = depositRedeemed;
    this.compsWet = compsWet;
    this.dStaffDry = dStaffDry;
    this.dCustomersWet = dCustomersWet;
    this.dCustomersDry = dCustomersDry;
    this.dCustomersCoffee = dCustomersCoffee;
    this.fwtWet = fwtWet;
    this.comoInDrawer = comoInDrawer;
    this.amexTots = amexTots;
    this.visaMcTots = visaMcTots;
    this.receipts = receipts;
    this.spendStaffPts = spendStaffPts;
    this.comoDiscAsset = comoDiscAsset;
    this.takeDry = takeDry;
    this.takeCoffee = takeCoffee;
    this.takeGiftCard = takeGiftCard;
    this.takeDepositPaid = takeDepositPaid;
    this.paidOutAmount = paidOutAmnt;
    this.paidOutTo = paidOutTo;
    this.banked = banked;
    this.cashAdvantageBag = cashAdvantageBag;
    this.cashAdvantageBagSeenBy = cashAdvantageBagSeenBy;
    this.sfdAm = sfdAm;
    this.sfdPm = sfdPm;
    this.sfdNotes = sfdNotes;
    this.pubSecuredBy = pubSecuredBy;
    this.barClosedBy = barClosedBy;
    this.floorClosedBy = floorClosedBy;
    this.nextDoorBy = nextDoorBy;
  }
}

export type CashUpEntityApiType = ApiType<CashUpEntityAbstract<number, TillDenominationsApiType, SafeFloatDenominationsApiType, ReceiptApiType>>;
export type CashUpEntityUpdateType = UpdateType<CashUpEntityAbstract<string, TillDenominations, SafeFloatDenominations, Receipt>>;
export type CashUpEntityInputType = InputType<CashUpEntityAbstract<string, undefined, undefined, undefined>>;
export type CashUpEntityType = EntityType<CashUpEntityAbstract<number, TillDenominations, SafeFloatDenominations, Receipt>, CashUpEntityAbstract<string, undefined, undefined, undefined>>;