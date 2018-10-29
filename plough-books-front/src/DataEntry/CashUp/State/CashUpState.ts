import * as moment from 'moment';
import {Receipt} from "./Receipt";
import {SafeFloatDenominations} from "./SafeFloatDenominations";
import {TillDenominations} from "./TillDenominations";

export class CashUpState {
  public static default(date: moment.Moment): CashUpState {
    return new CashUpState(
      date,
      '',
      '',
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
      0,
      0,
      0,
      0,
      SafeFloatDenominations.default(),
      SafeFloatDenominations.default(),
      '',
      0,
      0,
      0,
      0,
    );
  }

  public readonly date: moment.Moment;

  public readonly mod: string;
  public readonly dailyNotes: string;

  public readonly tills: TillDenominations[];
  
  public readonly chargeToAccount: number;
  public readonly depositRedeemed: number;
  
  public readonly compsWet: number;
  public readonly dStaffDry: number;
  public readonly dCustomersWet: number;
  public readonly dCustomersDry: number;
  public readonly dCustomersCoffee: number;
  public readonly fwtWet: number;
  public readonly comoInDrawer: number;

  public readonly amexTots: number;
  public readonly visaMcTots: number;

  public readonly receipts: Receipt[];
  public readonly spendStaffPts: number;
  public readonly comoDiscAsset: number;

  public readonly takeDry: number;
  public readonly takeCoffee: number;
  public readonly takeGiftCard: number;
  public readonly takeDepositPaid: number;

  public readonly paidOutAmnt: number;
  public readonly paidOutTo: number;
  public readonly banked: number;
  public readonly cashAdvantageBag: number;
  public readonly cashAdvantageBagSeenBy: number;
  
  public readonly sfdAm: SafeFloatDenominations;
  public readonly sfdPm: SafeFloatDenominations;

  public readonly sfdNotes: string;
  public readonly pubSecuredBy: number;
  public readonly barClosedBy: number;
  public readonly floorClosedBy: number;
  public readonly nextDoorBy: number;

  constructor(date: moment.Moment, mod: string, dailyNotes: string, tills: TillDenominations[], chargeToAccount: number, depositRedeemed: number, compsWet: number, dStaffDry: number, dCustomersWet: number, dCustomersDry: number, dCustomersCoffee: number, fwtWet: number, comoInDrawer: number, amexTots: number, visaMcTots: number, receipts: Receipt[], spendStaffPts: number, comoDiscAsset: number, takeDry: number, takeCoffee: number, takeGiftCard: number, takeDepositPaid: number, paidOutAmnt: number, paidOutTo: number, banked: number, cashAdvantageBag: number, cashAdvantageBagSeenBy: number, sfdAm: SafeFloatDenominations, sfdPm: SafeFloatDenominations, sfdNotes: string, pubSecuredBy: number, barClosedBy: number, floorClosedBy: number, nextDoorBy: number) {
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
    this.paidOutAmnt = paidOutAmnt;
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

  public with(obj: any): CashUpState {
    return Object.assign(
      new CashUpState(this.date, this.mod, this.dailyNotes, this.tills.map(till => till.clone()), this.chargeToAccount, this.depositRedeemed, this.compsWet, this.dStaffDry, this.dCustomersWet, this.dCustomersDry, this.dCustomersCoffee, this.fwtWet, this.comoInDrawer, this.amexTots, this.visaMcTots, this.receipts.map(receipt => receipt.clone()), this.spendStaffPts, this.comoDiscAsset, this.takeDry, this.takeCoffee, this.takeGiftCard, this.takeDepositPaid, this.paidOutAmnt, this.paidOutTo, this.banked, this.cashAdvantageBag, this.cashAdvantageBagSeenBy, this.sfdAm.clone(), this.sfdPm.clone(), this.sfdNotes, this.pubSecuredBy, this.barClosedBy, this.floorClosedBy, this.nextDoorBy),
      obj
    );
  }
}