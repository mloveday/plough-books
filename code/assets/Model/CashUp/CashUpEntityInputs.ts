import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {
  CashUpEntityAbstract,
  CashUpEntityApiType,
  CashUpEntityInputType,
  CashUpEntityUpdateType
} from "./CashUpEntityTypes";

export class CashUpEntityInputs extends CashUpEntityAbstract<string, undefined, undefined, undefined> implements CashUpEntityInputType {
  public static default(date: moment.Moment): CashUpEntityInputs {
    return new CashUpEntityInputs(moment.utc(date).format(DateFormats.API), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
  }

  public static fromBackend(obj: CashUpEntityApiType): CashUpEntityInputs {
    return new CashUpEntityInputs(
      obj.date,
      obj.mod,
      obj.dailyNotes,
      obj.chargeToAccount.toString(),
      obj.depositRedeemed.toString(),
      obj.compsWet.toString(),
      obj.dStaffDry.toString(),
      obj.dCustomersWet.toString(),
      obj.dCustomersDry.toString(),
      obj.dCustomersCoffee.toString(),
      obj.fwtWet.toString(),
      obj.comoInDrawer.toString(),
      obj.amexTots.toString(),
      obj.visaMcTots.toString(),
      obj.spendStaffPts.toString(),
      obj.comoDiscAsset.toString(),
      obj.takeDry.toString(),
      obj.takeCoffee.toString(),
      obj.takeGiftCard.toString(),
      obj.takeDepositPaid.toString(),
      obj.paidOutAmount.toString(),
      obj.paidOutTo,
      obj.banked.toString(),
      obj.cashAdvantageBag,
      obj.cashAdvantageBagSeenBy,
      obj.sfdNotes,
      obj.pubSecuredBy,
      obj.barClosedBy,
      obj.floorClosedBy,
      obj.nextDoorBy,
    );
  }

  constructor(date: string, mod: string, dailyNotes: string, chargeToAccount: string, depositRedeemed: string, compsWet: string, dStaffDry: string, dCustomersWet: string, dCustomersDry: string, dCustomersCoffee: string, fwtWet: string, comoInDrawer: string, amexTots: string, visaMcTots: string, spendStaffPts: string, comoDiscAsset: string, takeDry: string, takeCoffee: string, takeGiftCard: string, takeDepositPaid: string, paidOutAmnt: string, paidOutTo: string, banked: string, cashAdvantageBag: string, cashAdvantageBagSeenBy: string, sfdNotes: string, pubSecuredBy: string, barClosedBy: string, floorClosedBy: string, nextDoorBy: string) {
    super(date, mod, dailyNotes, [], chargeToAccount, depositRedeemed, compsWet, dStaffDry, dCustomersWet, dCustomersDry, dCustomersCoffee, fwtWet, comoInDrawer, amexTots, visaMcTots, [], spendStaffPts, comoDiscAsset, takeDry, takeCoffee, takeGiftCard, takeDepositPaid, paidOutAmnt, paidOutTo, banked, cashAdvantageBag, cashAdvantageBagSeenBy, undefined, undefined, sfdNotes, pubSecuredBy, barClosedBy, floorClosedBy, nextDoorBy);
  }

  public with(obj: CashUpEntityUpdateType): CashUpEntityInputs {
    return new CashUpEntityInputs(
      obj.date ? obj.date : this.date,
      obj.mod ? obj.mod : this.mod,
      obj.dailyNotes ? obj.dailyNotes : this.dailyNotes,
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
      obj.spendStaffPts ? obj.spendStaffPts : this.spendStaffPts,
      obj.comoDiscAsset ? obj.comoDiscAsset : this.comoDiscAsset,
      obj.takeDry ? obj.takeDry : this.takeDry,
      obj.takeCoffee ? obj.takeCoffee : this.takeCoffee,
      obj.takeGiftCard ? obj.takeGiftCard : this.takeGiftCard,
      obj.takeDepositPaid ? obj.takeDepositPaid : this.takeDepositPaid,
      obj.paidOutAmount ? obj.paidOutAmount : this.paidOutAmount,
      obj.paidOutTo ? obj.paidOutTo : this.paidOutTo,
      obj.banked ? obj.banked : this.banked,
      obj.cashAdvantageBag ? obj.cashAdvantageBag : this.cashAdvantageBag,
      obj.cashAdvantageBagSeenBy ? obj.cashAdvantageBagSeenBy : this.cashAdvantageBagSeenBy,
      obj.sfdNotes ? obj.sfdNotes : this.sfdNotes,
      obj.pubSecuredBy ? obj.pubSecuredBy : this.pubSecuredBy,
      obj.barClosedBy ? obj.barClosedBy : this.barClosedBy,
      obj.floorClosedBy ? obj.floorClosedBy : this.floorClosedBy,
      obj.nextDoorBy ? obj.nextDoorBy : this.nextDoorBy,
    );
  }
}