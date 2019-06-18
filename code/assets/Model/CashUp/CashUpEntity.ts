import * as moment from 'moment';
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDate} from "../../Util/DateUtils";
import {validateCash} from "../../Util/Validation";
import {SafeFloatDenominations} from "../Denominations/SafeFloatDenominations";
import {TillDenominations} from "../Denominations/TillDenominations";
import {Receipt} from "../Receipt/Receipt";
import {CashUpEntityInputs} from "./CashUpEntityInputs";
import {CashUpEntityAbstract, CashUpEntityApiType, CashUpEntityUpdateType} from "./CashUpEntityTypes";

export class CashUpEntity extends CashUpEntityAbstract<number, TillDenominations, SafeFloatDenominations, Receipt> {
  public static default(date: moment.Moment): CashUpEntity {
    return new CashUpEntity(moment.utc(date).format(DateFormats.API_DATE), '', '', [
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
    ], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, '', 0, '', '', SafeFloatDenominations.default(), SafeFloatDenominations.default(), '', '', '', '', '', true, undefined, CashUpEntityInputs.default(date), 0, 0);
  }

  public static fromApi(obj: CashUpEntityApiType): CashUpEntity {
    const date = momentFromDate(obj.date);
    return new CashUpEntity(date.format(DateFormats.API_DATE), obj.mod, obj.dailyNotes, obj.tills.map(till => TillDenominations.fromApi(till))
      .filter((value: TillDenominations, index: number) => index < 7), obj.chargeToAccount, obj.depositRedeemed, obj.compsWet, obj.dStaffDry, obj.dCustomersWet, obj.dCustomersDry, obj.dCustomersCoffee, obj.fwtWet, obj.comoInDrawer, obj.amexTots, obj.visaMcTots, obj.receipts.map(receipt => Receipt.fromApi(receipt)), obj.spendStaffPts, obj.comoDiscAsset, obj.takeDry, obj.takeCoffee, obj.takeGiftCard, obj.takeDepositPaid, obj.paidOutAmount, obj.paidOutTo, obj.banked, obj.cashAdvantageBag, obj.cashAdvantageBagSeenBy, SafeFloatDenominations.fromApi(obj.sfdAm), SafeFloatDenominations.fromApi(obj.sfdPm), obj.sfdNotes, obj.pubSecuredBy, obj.barClosedBy, obj.floorClosedBy, obj.nextDoorBy, false, obj.id, CashUpEntityInputs.fromApi(obj), obj.paypal, obj.deliveroo);
  }

  public readonly id?: number;
  public readonly isDefault: boolean;
  public readonly inputs: CashUpEntityInputs;

  constructor(date: string, mod: string, dailyNotes: string, tills: TillDenominations[], chargeToAccount: number, depositRedeemed: number, compsWet: number, dStaffDry: number, dCustomersWet: number, dCustomersDry: number, dCustomersCoffee: number, fwtWet: number, comoInDrawer: number, amexTots: number, visaMcTots: number, receipts: Receipt[], spendStaffPts: number, comoDiscAsset: number, takeDry: number, takeCoffee: number, takeGiftCard: number, takeDepositPaid: number, paidOutAmnt: number, paidOutTo: string, banked: number, cashAdvantageBag: string, cashAdvantageBagSeenBy: string, sfdAm: SafeFloatDenominations, sfdPm: SafeFloatDenominations, sfdNotes: string, pubSecuredBy: string, barClosedBy: string, floorClosedBy: string, nextDoorBy: string, isDefault: boolean, id: number | undefined, inputs: CashUpEntityInputs, paypal: number, deliveroo: number) {
    super(date, mod, dailyNotes, tills, chargeToAccount, depositRedeemed, compsWet, dStaffDry, dCustomersWet, dCustomersDry, dCustomersCoffee, fwtWet, comoInDrawer, amexTots, visaMcTots, receipts, spendStaffPts, comoDiscAsset, takeDry, takeCoffee, takeGiftCard, takeDepositPaid, paidOutAmnt, paidOutTo, banked, cashAdvantageBag, cashAdvantageBagSeenBy, sfdAm, sfdPm, sfdNotes, pubSecuredBy, barClosedBy, floorClosedBy, nextDoorBy, paypal, deliveroo);
    this.isDefault = isDefault;
    this.id = id;
    this.inputs = inputs;
  }

  public with(obj: CashUpEntityUpdateType): CashUpEntity {
    return new CashUpEntity(obj.date !== undefined ? obj.date : this.date, obj.mod !== undefined ? obj.mod : this.mod, obj.dailyNotes !== undefined ? obj.dailyNotes : this.dailyNotes, obj.tills !== undefined ? obj.tills : this.tills.map(till => till.clone()), obj.chargeToAccount !== undefined ? validateCash(obj.chargeToAccount, this.chargeToAccount) : this.chargeToAccount, obj.depositRedeemed !== undefined ? validateCash(obj.depositRedeemed, this.depositRedeemed) : this.depositRedeemed, obj.compsWet !== undefined ? validateCash(obj.compsWet, this.compsWet) : this.compsWet, obj.dStaffDry !== undefined ? validateCash(obj.dStaffDry, this.dStaffDry) : this.dStaffDry, obj.dCustomersWet !== undefined ? validateCash(obj.dCustomersWet, this.dCustomersWet) : this.dCustomersWet, obj.dCustomersDry !== undefined ? validateCash(obj.dCustomersDry, this.dCustomersDry) : this.dCustomersDry, obj.dCustomersCoffee !== undefined ? validateCash(obj.dCustomersCoffee, this.dCustomersCoffee) : this.dCustomersCoffee, obj.fwtWet !== undefined ? validateCash(obj.fwtWet, this.fwtWet) : this.fwtWet, obj.comoInDrawer !== undefined ? validateCash(obj.comoInDrawer, this.comoInDrawer) : this.comoInDrawer, obj.amexTots !== undefined ? validateCash(obj.amexTots, this.amexTots) : this.amexTots, obj.visaMcTots !== undefined ? validateCash(obj.visaMcTots, this.visaMcTots) : this.visaMcTots, obj.receipts !== undefined ? obj.receipts : this.receipts.map(receipt => receipt.clone()), obj.spendStaffPts !== undefined ? validateCash(obj.spendStaffPts, this.spendStaffPts) : this.spendStaffPts, obj.comoDiscAsset !== undefined ? validateCash(obj.comoDiscAsset, this.comoDiscAsset) : this.comoDiscAsset, obj.takeDry !== undefined ? validateCash(obj.takeDry, this.takeDry) : this.takeDry, obj.takeCoffee !== undefined ? validateCash(obj.takeCoffee, this.takeCoffee) : this.takeCoffee, obj.takeGiftCard !== undefined ? validateCash(obj.takeGiftCard, this.takeGiftCard) : this.takeGiftCard, obj.takeDepositPaid !== undefined ? validateCash(obj.takeDepositPaid, this.takeDepositPaid) : this.takeDepositPaid, obj.paidOutAmount !== undefined ? validateCash(obj.paidOutAmount, this.paidOutAmount) : this.paidOutAmount, obj.paidOutTo !== undefined ? obj.paidOutTo : this.paidOutTo, obj.banked !== undefined ? validateCash(obj.banked, this.banked) : this.banked, obj.cashAdvantageBag !== undefined ? obj.cashAdvantageBag : this.cashAdvantageBag, obj.cashAdvantageBagSeenBy !== undefined ? obj.cashAdvantageBagSeenBy : this.cashAdvantageBagSeenBy, obj.sfdAm !== undefined ? obj.sfdAm : this.sfdAm.clone(), obj.sfdPm !== undefined ? obj.sfdPm : this.sfdPm.clone(), obj.sfdNotes !== undefined ? obj.sfdNotes : this.sfdNotes, obj.pubSecuredBy !== undefined ? obj.pubSecuredBy : this.pubSecuredBy, obj.barClosedBy !== undefined ? obj.barClosedBy : this.barClosedBy, obj.floorClosedBy !== undefined ? obj.floorClosedBy : this.floorClosedBy, obj.nextDoorBy !== undefined ? obj.nextDoorBy : this.nextDoorBy, this.isDefault, this.id, this.inputs.with(obj), obj.paypal !== undefined ? validateCash(obj.paypal, this.paypal) : this.paypal, obj.deliveroo !== undefined ? validateCash(obj.deliveroo, this.deliveroo) : this.deliveroo);
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
      + this.getDiffBetweenAmexTotsAndSumOfTills()
      + this.getDiffBetweenVisaTotsAndSumOfTills()
      + this.chargeToAccount + this.depositRedeemed;
  }

  public getTotalZRead(): number {
    return this.tills.reduce((prev, curr) => prev + curr.zRead, 0);
  }

  public getTotalComps(): number {
    return this.compsWet + this.dStaffDry + this.dCustomersCoffee + this.dCustomersDry + this.dCustomersWet + this.fwtWet;
  }

  public getZReadVariance(): number {
    return this.getTotalComps() + this.getTotalRevenue() + this.comoInDrawer - this.getTotalZRead();
  }

  private getDiffBetweenAmexTotsAndSumOfTills(): number {
    return this.amexTots === 0 ? 0 : this.amexTots - this.tills.reduce((prev, curr) => prev + curr.amex, 0);
  }

  private getDiffBetweenVisaTotsAndSumOfTills(): number {
    return this.visaMcTots === 0 ? 0 : this.visaMcTots - this.tills.reduce((prev, curr) => prev + curr.visa, 0);
  }
}