import * as moment from 'moment';
import {DateFormats} from "../../../Util/DateFormats";
import {validateCash} from "../../../Util/Validation";
import {CashUpEntityInputs} from "./CashUpEntityInputs";
import {CashUpEntityAbstract, CashUpEntityApiType, CashUpEntityUpdateType} from "./CashUpEntityTypes";
import {SafeFloatDenominations} from "./Denominations/SafeFloatDenominations";
import {TillDenominations} from "./Denominations/TillDenominations";
import {Receipt} from "./Receipt";

export class CashUpEntity extends CashUpEntityAbstract<number, TillDenominations, SafeFloatDenominations, Receipt> {
  public static default(date: moment.Moment): CashUpEntity {
    return new CashUpEntity(moment.utc(date).format(DateFormats.API), '', '', [
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
      TillDenominations.default(),
    ], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, '', 0, '', '', SafeFloatDenominations.default(), SafeFloatDenominations.default(), '', '', '', '', '', true, undefined, CashUpEntityInputs.default(date));
  }

  public static fromBackend(obj: CashUpEntityApiType): CashUpEntity {
    const date = moment.utc(obj.date);
    return new CashUpEntity(
      date.format(DateFormats.API),
      obj.mod,
      obj.dailyNotes,
      obj.tills.map(till => TillDenominations.parseApiResponse(till))
        .filter((value: TillDenominations, index: number) => index < 7),
      obj.chargeToAccount,
      obj.depositRedeemed,
      obj.compsWet,
      obj.dStaffDry,
      obj.dCustomersWet,
      obj.dCustomersDry,
      obj.dCustomersCoffee,
      obj.fwtWet,
      obj.comoInDrawer,
      obj.amexTots,
      obj.visaMcTots,
      obj.receipts.map(receipt => Receipt.default().with(receipt)),
      obj.spendStaffPts,
      obj.comoDiscAsset,
      obj.takeDry,
      obj.takeCoffee,
      obj.takeGiftCard,
      obj.takeDepositPaid,
      obj.paidOutAmnt,
      obj.paidOutTo,
      obj.banked,
      obj.cashAdvantageBag,
      obj.cashAdvantageBagSeenBy,
      SafeFloatDenominations.parseApiResponse(obj.sfdAm),
      SafeFloatDenominations.parseApiResponse(obj.sfdPm),
      obj.sfdNotes,
      obj.pubSecuredBy,
      obj.barClosedBy,
      obj.floorClosedBy,
      obj.nextDoorBy,
      false,
      obj.id,
      CashUpEntityInputs.fromBackend(obj),
    );
  }

  public readonly id?: number;
  public readonly isDefault: boolean;
  public readonly inputs: CashUpEntityInputs;

  constructor(date: string, mod: string, dailyNotes: string, tills: TillDenominations[], chargeToAccount: number, depositRedeemed: number, compsWet: number, dStaffDry: number, dCustomersWet: number, dCustomersDry: number, dCustomersCoffee: number, fwtWet: number, comoInDrawer: number, amexTots: number, visaMcTots: number, receipts: Receipt[], spendStaffPts: number, comoDiscAsset: number, takeDry: number, takeCoffee: number, takeGiftCard: number, takeDepositPaid: number, paidOutAmnt: number, paidOutTo: string, banked: number, cashAdvantageBag: string, cashAdvantageBagSeenBy: string, sfdAm: SafeFloatDenominations, sfdPm: SafeFloatDenominations, sfdNotes: string, pubSecuredBy: string, barClosedBy: string, floorClosedBy: string, nextDoorBy: string, isDefault: boolean, id: number|undefined, inputs: CashUpEntityInputs) {
    super(date, mod, dailyNotes, tills, chargeToAccount, depositRedeemed, compsWet, dStaffDry, dCustomersWet, dCustomersDry, dCustomersCoffee, fwtWet, comoInDrawer, amexTots, visaMcTots, receipts, spendStaffPts, comoDiscAsset, takeDry, takeCoffee, takeGiftCard, takeDepositPaid, paidOutAmnt, paidOutTo, banked, cashAdvantageBag, cashAdvantageBagSeenBy, sfdAm, sfdPm, sfdNotes, pubSecuredBy, barClosedBy, floorClosedBy, nextDoorBy);
    this.isDefault = isDefault;
    this.id = id;
    this.inputs = inputs;
  }

  public with(obj: CashUpEntityUpdateType): CashUpEntity {
    return new CashUpEntity(
      obj.date ? obj.date : this.date,
      obj.mod ? obj.mod : this.mod,
      obj.dailyNotes ? obj.dailyNotes : this.dailyNotes,
      obj.tills ? obj.tills.map(till => TillDenominations.default().with(till)) : this.tills.map(till => till.clone()),
      obj.chargeToAccount ? validateCash(obj.chargeToAccount, this.chargeToAccount) : this.chargeToAccount,
      obj.depositRedeemed ? validateCash(obj.depositRedeemed, this.depositRedeemed) : this.depositRedeemed,
      obj.compsWet ? validateCash(obj.compsWet, this.compsWet) : this.compsWet,
      obj.dStaffDry ? validateCash(obj.dStaffDry, this.dStaffDry) : this.dStaffDry,
      obj.dCustomersWet ? validateCash(obj.dCustomersWet, this.dCustomersWet) : this.dCustomersWet,
      obj.dCustomersDry ? validateCash(obj.dCustomersDry, this.dCustomersDry) : this.dCustomersDry,
      obj.dCustomersCoffee ? validateCash(obj.dCustomersCoffee, this.dCustomersCoffee) : this.dCustomersCoffee,
      obj.fwtWet ? validateCash(obj.fwtWet, this.fwtWet) : this.fwtWet,
      obj.comoInDrawer ? validateCash(obj.comoInDrawer, this.comoInDrawer) : this.comoInDrawer,
      obj.amexTots ? validateCash(obj.amexTots, this.amexTots) : this.amexTots,
      obj.visaMcTots ? validateCash(obj.visaMcTots, this.visaMcTots) : this.visaMcTots,
      obj.receipts ? obj.receipts.map(r => Receipt.default().with(r)) : this.receipts.map(receipt => receipt.clone()),
      obj.spendStaffPts ? validateCash(obj.spendStaffPts, this.spendStaffPts) : this.spendStaffPts,
      obj.comoDiscAsset ? validateCash(obj.comoDiscAsset, this.comoDiscAsset) : this.comoDiscAsset,
      obj.takeDry ? validateCash(obj.takeDry, this.takeDry) : this.takeDry,
      obj.takeCoffee ? validateCash(obj.takeCoffee, this.takeCoffee) : this.takeCoffee,
      obj.takeGiftCard ? validateCash(obj.takeGiftCard, this.takeGiftCard) : this.takeGiftCard,
      obj.takeDepositPaid ? validateCash(obj.takeDepositPaid, this.takeDepositPaid) : this.takeDepositPaid,
      obj.paidOutAmnt ? validateCash(obj.paidOutAmnt, this.paidOutAmnt) : this.paidOutAmnt,
      obj.paidOutTo ? obj.paidOutTo : this.paidOutTo,
      obj.banked ? validateCash(obj.banked, this.banked) : this.banked,
      obj.cashAdvantageBag ? obj.cashAdvantageBag : this.cashAdvantageBag,
      obj.cashAdvantageBagSeenBy ? obj.cashAdvantageBagSeenBy : this.cashAdvantageBagSeenBy,
      obj.sfdAm ? this.sfdAm.with(obj.sfdAm) : this.sfdAm.clone(),
      obj.sfdPm ? this.sfdPm.with(obj.sfdPm) : this.sfdPm.clone(),
      obj.sfdNotes ? obj.sfdNotes : this.sfdNotes,
      obj.pubSecuredBy ? obj.pubSecuredBy : this.pubSecuredBy,
      obj.barClosedBy ? obj.barClosedBy : this.barClosedBy,
      obj.floorClosedBy ? obj.floorClosedBy : this.floorClosedBy,
      obj.nextDoorBy ? obj.nextDoorBy : this.nextDoorBy,
      this.isDefault,
      this.id,
      this.inputs.with(obj)
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