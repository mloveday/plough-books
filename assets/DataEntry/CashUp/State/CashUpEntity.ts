import * as moment from 'moment';
import {IReceiptApiObject, IReceiptUpdateObject, Receipt} from "./Receipt";
import {
  ISafeFloatDenominationsApiObject,
  ISafeFloatDenominationsUpdateObject,
  SafeFloatDenominations
} from "./Denominations/SafeFloatDenominations";
import {ITillDenominationsApiObject, ITillDenominationsUpdateObject, TillDenominations} from "./Denominations/TillDenominations";

export interface ICashUpEntityApiObject {
  id: number;
  date: string|moment.Moment;
  mod: string;
  dailyNotes: string;
  tills: ITillDenominationsApiObject[];
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
  sfdAm: ISafeFloatDenominationsApiObject;
  sfdPm: ISafeFloatDenominationsApiObject;
  sfdNotes: string;
  pubSecuredBy: string;
  barClosedBy: string;
  floorClosedBy: string;
  nextDoorBy: string;
}

export interface ICashUpEntityUpdateObject {
  id?: number;
  isDefault?: boolean;
  date?: moment.Moment;
  mod?: string;
  dailyNotes?: string;
  tills?: ITillDenominationsUpdateObject[];
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
  receipts?: IReceiptUpdateObject[];
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
  sfdAm?: ISafeFloatDenominationsUpdateObject;
  sfdPm?: ISafeFloatDenominationsUpdateObject;
  sfdNotes?: string;
  pubSecuredBy?: string;
  barClosedBy?: string;
  floorClosedBy?: string;
  nextDoorBy?: string;
}

export class CashUpEntity {
  public static default(date: moment.Moment): CashUpEntity {
    return new CashUpEntity(moment.utc(date), '', '', [
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
    const newObj: ICashUpEntityUpdateObject = Object.assign({}, obj, {date, isDefault: false});
    if (obj.hasOwnProperty('tills')) {
      newObj.tills = obj.tills.map((till: any) => TillDenominations.default().with(till))
        .filter((value: TillDenominations, index: number) => index < 7);
    }
    if (obj.hasOwnProperty('receipts')) {
      newObj.receipts = obj.receipts.map((receipt: any) => Receipt.default().with(receipt));
    }
    newObj.sfdAm = SafeFloatDenominations.default().with(obj.sfdAm);
    newObj.sfdPm = SafeFloatDenominations.default().with(obj.sfdPm);
    return CashUpEntity.default(date).with(newObj);
  }

  public readonly id?: number;
  public readonly isDefault: boolean;
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

  constructor(date: moment.Moment, mod: string, dailyNotes: string, tills: TillDenominations[], chargeToAccount: number, depositRedeemed: number, compsWet: number, dStaffDry: number, dCustomersWet: number, dCustomersDry: number, dCustomersCoffee: number, fwtWet: number, comoInDrawer: number, amexTots: number, visaMcTots: number, receipts: Receipt[], spendStaffPts: number, comoDiscAsset: number, takeDry: number, takeCoffee: number, takeGiftCard: number, takeDepositPaid: number, paidOutAmnt: number, paidOutTo: string, banked: number, cashAdvantageBag: string, cashAdvantageBagSeenBy: string, sfdAm: SafeFloatDenominations, sfdPm: SafeFloatDenominations, sfdNotes: string, pubSecuredBy: string, barClosedBy: string, floorClosedBy: string, nextDoorBy: string, isDefault: boolean, id?: number) {
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
    return Object.assign(
      new CashUpEntity(this.date, this.mod, this.dailyNotes, this.tills.map(till => till.clone()), this.chargeToAccount, this.depositRedeemed, this.compsWet, this.dStaffDry, this.dCustomersWet, this.dCustomersDry, this.dCustomersCoffee, this.fwtWet, this.comoInDrawer, this.amexTots, this.visaMcTots, this.receipts.map(receipt => receipt.clone()), this.spendStaffPts, this.comoDiscAsset, this.takeDry, this.takeCoffee, this.takeGiftCard, this.takeDepositPaid, this.paidOutAmnt, this.paidOutTo, this.banked, this.cashAdvantageBag, this.cashAdvantageBagSeenBy, this.sfdAm.clone(), this.sfdPm.clone(), this.sfdNotes, this.pubSecuredBy, this.barClosedBy, this.floorClosedBy, this.nextDoorBy, this.isDefault, this.id),
      obj
    );
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