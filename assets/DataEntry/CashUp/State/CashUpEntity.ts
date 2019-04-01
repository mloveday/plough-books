import * as moment from 'moment';
import {DateFormats} from "../../../Util/DateFormats";
import {ISafeFloatDenominationsApiObject, SafeFloatDenominations} from "./Denominations/SafeFloatDenominations";
import {TillDenominations} from "./Denominations/TillDenominations";
import {TillDenominationsApiType} from "./Denominations/TillDenominationsTypes";
import {IReceiptApiObject, Receipt} from "./Receipt";

export interface ICashUpEntityApiObject {
  id: number;
  date: string;
  mod: string;
  dailyNotes: string;
  tills: TillDenominationsApiType[];
  chargeToAccount: number;
  depositRedeemed: number;
  compsWet: number;
  dStaffDry: number;
  dCustomersWet: number;
  dCustomersDry: number;
  dCustomersCoffee: number;
  fwtWet: number;
  comoInDrawer: number;
  amexTots: number;
  visaMcTots: number;
  receipts: IReceiptApiObject[];
  spendStaffPts: number;
  comoDiscAsset: number;
  takeDry: number;
  takeCoffee: number;
  takeGiftCard: number;
  takeDepositPaid: number;
  paidOutAmnt: number;
  paidOutTo: string;
  banked: number;
  cashAdvantageBag: string;
  cashAdvantageBagSeenBy: string;
  sfdAm: ISafeFloatDenominationsApiObject<number>;
  sfdPm: ISafeFloatDenominationsApiObject<number>;
  sfdNotes: string;
  pubSecuredBy: string;
  barClosedBy: string;
  floorClosedBy: string;
  nextDoorBy: string;
}

export interface ICashUpEntityUpdateObject {
  id?: number;
  isDefault?: boolean;
  date?: string;
  mod?: string;
  dailyNotes?: string;
  tills?: TillDenominations[];
  chargeToAccount?: number;
  depositRedeemed?: number;
  compsWet?: number;
  dStaffDry?: number;
  dCustomersWet?: number;
  dCustomersDry?: number;
  dCustomersCoffee?: number;
  fwtWet?: number;
  comoInDrawer?: number;
  amexTots?: number;
  visaMcTots?: number;
  receipts?: Receipt[];
  spendStaffPts?: number;
  comoDiscAsset?: number;
  takeDry?: number;
  takeCoffee?: number;
  takeGiftCard?: number;
  takeDepositPaid?: number;
  paidOutAmnt?: number;
  paidOutTo?: string;
  banked?: number;
  cashAdvantageBag?: string;
  cashAdvantageBagSeenBy?: string;
  sfdAm?: SafeFloatDenominations;
  sfdPm?: SafeFloatDenominations;
  sfdNotes?: string;
  pubSecuredBy?: string;
  barClosedBy?: string;
  floorClosedBy?: string;
  nextDoorBy?: string;
}

export class CashUpEntity {
  public static default(date: moment.Moment): CashUpEntity {
    return new CashUpEntity(moment.utc(date).format(DateFormats.API), '', '', [
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
    ], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, '', 0, '', '', SafeFloatDenominations.default(), SafeFloatDenominations.default(), '', '', '', '', '', true, undefined);
  }

  public static fromBackend(obj: ICashUpEntityApiObject): CashUpEntity {
    const date = moment.utc(obj.date);
    const newObj: ICashUpEntityUpdateObject = Object.assign({}, obj, {date: date.format(DateFormats.API), isDefault: false});
    if (obj.hasOwnProperty('tills')) {
      newObj.tills = obj.tills.map(till => TillDenominations.parseApiResponse(till))
        .filter((value: TillDenominations, index: number) => index < 7);
    }
    if (obj.hasOwnProperty('receipts')) {
      newObj.receipts = obj.receipts.map(receipt => Receipt.default().with(receipt));
    }
    newObj.sfdAm = SafeFloatDenominations.parseApiResponse(obj.sfdAm);
    newObj.sfdPm = SafeFloatDenominations.parseApiResponse(obj.sfdPm);
    return CashUpEntity.default(date).with(newObj);
  }

  public readonly id?: number;
  public readonly isDefault: boolean;
  public readonly date: string;

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
  public readonly paidOutTo: string;
  public readonly banked: number;
  public readonly cashAdvantageBag: string;
  public readonly cashAdvantageBagSeenBy: string;
  
  public readonly sfdAm: SafeFloatDenominations;
  public readonly sfdPm: SafeFloatDenominations;

  public readonly sfdNotes: string;
  public readonly pubSecuredBy: string;
  public readonly barClosedBy: string;
  public readonly floorClosedBy: string;
  public readonly nextDoorBy: string;

  constructor(date: string, mod: string, dailyNotes: string, tills: TillDenominations[], chargeToAccount: number, depositRedeemed: number, compsWet: number, dStaffDry: number, dCustomersWet: number, dCustomersDry: number, dCustomersCoffee: number, fwtWet: number, comoInDrawer: number, amexTots: number, visaMcTots: number, receipts: Receipt[], spendStaffPts: number, comoDiscAsset: number, takeDry: number, takeCoffee: number, takeGiftCard: number, takeDepositPaid: number, paidOutAmnt: number, paidOutTo: string, banked: number, cashAdvantageBag: string, cashAdvantageBagSeenBy: string, sfdAm: SafeFloatDenominations, sfdPm: SafeFloatDenominations, sfdNotes: string, pubSecuredBy: string, barClosedBy: string, floorClosedBy: string, nextDoorBy: string, isDefault: boolean, id?: number) {
    this.id = id;
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
    this.isDefault = isDefault;
  }

  public with(obj: ICashUpEntityUpdateObject): CashUpEntity {
    return new CashUpEntity(
      obj.date ? obj.date : this.date,
      obj.mod ? obj.mod : this.mod,
      obj.dailyNotes ? obj.dailyNotes : this.dailyNotes,
      obj.tills ? obj.tills.map(till => till.clone()) : this.tills.map(till => till.clone()),
      obj.chargeToAccount ? obj.chargeToAccount : this.chargeToAccount,
      obj.depositRedeemed ? obj.depositRedeemed : this.depositRedeemed,
      obj.compsWet ? obj.compsWet : this.compsWet,
      obj.dStaffDry ? obj.dStaffDry : this.dStaffDry,
      obj.dCustomersWet ? obj.dCustomersWet : this.dCustomersWet,
      obj.dCustomersDry ? obj.dCustomersDry : this.dCustomersDry,
      obj.dCustomersCoffee ? obj.dCustomersCoffee : this.dCustomersCoffee,
      obj.fwtWet ? obj.fwtWet : this.fwtWet,
      obj.comoInDrawer ? obj.comoInDrawer : this.comoInDrawer,
      obj.amexTots ? obj.amexTots : this.amexTots,
      obj.visaMcTots ? obj.visaMcTots : this.visaMcTots,
      obj.receipts ? obj.receipts : this.receipts.map(receipt => receipt.clone()),
      obj.spendStaffPts ? obj.spendStaffPts : this.spendStaffPts,
      obj.comoDiscAsset ? obj.comoDiscAsset : this.comoDiscAsset,
      obj.takeDry ? obj.takeDry : this.takeDry,
      obj.takeCoffee ? obj.takeCoffee : this.takeCoffee,
      obj.takeGiftCard ? obj.takeGiftCard : this.takeGiftCard,
      obj.takeDepositPaid ? obj.takeDepositPaid : this.takeDepositPaid,
      obj.paidOutAmnt ? obj.paidOutAmnt : this.paidOutAmnt,
      obj.paidOutTo ? obj.paidOutTo : this.paidOutTo,
      obj.banked ? obj.banked : this.banked,
      obj.cashAdvantageBag ? obj.cashAdvantageBag : this.cashAdvantageBag,
      obj.cashAdvantageBagSeenBy ? obj.cashAdvantageBagSeenBy : this.cashAdvantageBagSeenBy,
      obj.sfdAm ? obj.sfdAm : this.sfdAm.clone(),
      obj.sfdPm ? obj.sfdPm : this.sfdPm.clone(),
      obj.sfdNotes ? obj.sfdNotes : this.sfdNotes,
      obj.pubSecuredBy ? obj.pubSecuredBy : this.pubSecuredBy,
      obj.barClosedBy ? obj.barClosedBy : this.barClosedBy,
      obj.floorClosedBy ? obj.floorClosedBy : this.floorClosedBy,
      obj.nextDoorBy ? obj.nextDoorBy : this.nextDoorBy,
      obj.isDefault ? obj.isDefault : this.isDefault,
      this.id
    );
  }

  public clone() {
    return this.with({});
  }

  public isValid() {
    return true;
  }

  public getTotalRevenue(): number {
    return this.tills.reduce((prev, curr) => prev + curr.totalTaken(), 0)
      - this.receipts.reduce((prev, curr) => prev + curr.amount, 0)
      + this.amexTots - this.tills.reduce((prev, curr) => prev + curr.amex,0)
      + this.visaMcTots - this.tills.reduce((prev, curr) => prev + curr.visa,0)
      + this.chargeToAccount + this.depositRedeemed;
  }

  public getTotalZRead(): number {
  return this.tills.reduce((prev, curr) => prev + curr.zRead, 0);
  }

  public getTotalComps(): number {
    return this.compsWet + this.dCustomersCoffee + this.dCustomersDry + this.dCustomersWet + this.fwtWet;
  }

  public getZReadVariance(): number {
    return this.getTotalComps() + this.getTotalRevenue() + this.comoInDrawer - this.getTotalZRead();
  }
}