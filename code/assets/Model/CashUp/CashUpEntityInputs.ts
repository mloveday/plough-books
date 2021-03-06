import * as moment from "moment";
import {DateFormats} from "../../Util/DateFormats";
import {
  CashUpEntityAbstract,
  CashUpEntityApiType,
  CashUpEntityInputType,
  CashUpEntityUpdateType
} from "./CashUpEntityTypes";

export class CashUpEntityInputs extends CashUpEntityAbstract<string, undefined, undefined, undefined, undefined, undefined> implements CashUpEntityInputType {
  public static default(date: moment.Moment): CashUpEntityInputs {
    return new CashUpEntityInputs(moment.utc(date).format(DateFormats.API_DATE), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','','','', '', '', '','', '', '', '');
  }

  public static fromApi(obj: CashUpEntityApiType): CashUpEntityInputs {
    return new CashUpEntityInputs(obj.date, obj.mod, obj.dailyNotes, obj.chargeToAccount.toString(), obj.depositRedeemed.toString(), obj.compsWet.toString(), obj.dStaffDry.toString(), obj.dCustomersWet.toString(), obj.dCustomersDry.toString(), obj.dCustomersCoffee.toString(), obj.fwtWet.toString(), obj.comoInDrawer.toString(), obj.amexTots.toString(), obj.visaMcTots.toString(), obj.spendStaffPts.toString(), obj.comoDiscAsset.toString(), obj.takeDry.toString(), obj.takeCoffee.toString(), obj.takeGiftCard.toString(), obj.takeDepositPaid.toString(), obj.paidOutAmount.toString(), obj.paidOutTo, obj.banked.toString(), obj.cashAdvantageBag, obj.cashAdvantageBagSeenBy, obj.bankedPm.toString(), obj.cashAdvantageBagPm, obj.cashAdvantageBagSeenByPm, obj.sfdNotes, obj.pubSecuredBy, obj.barClosedBy, obj.floorClosedBy, obj.nextDoorBy, obj.paypal.toString(), obj.deliveroo.toString(), obj.takeVouchersWet.toString(), obj.takeVouchersDry.toString(), obj.takeVouchersHot.toString());
  }

  constructor(date: string, mod: string, dailyNotes: string, chargeToAccount: string, depositRedeemed: string, compsWet: string, dStaffDry: string, dCustomersWet: string, dCustomersDry: string, dCustomersCoffee: string, fwtWet: string, comoInDrawer: string, amexTots: string, visaMcTots: string, spendStaffPts: string, comoDiscAsset: string, takeDry: string, takeCoffee: string, takeGiftCard: string, takeDepositPaid: string, paidOutAmnt: string, paidOutTo: string, banked: string, cashAdvantageBag: string, cashAdvantageBagSeenBy: string, bankedPm: string, cashAdvantageBagPm: string, cashAdvantageBagSeenByPm: string, sfdNotes: string, pubSecuredBy: string, barClosedBy: string, floorClosedBy: string, nextDoorBy: string, paypal: string, deliveroo: string, takeVouchersWet: string, takeVouchersDry: string, takeVouchersHot: string) {
    super(date, mod, dailyNotes, [], chargeToAccount, depositRedeemed, compsWet, dStaffDry, dCustomersWet,
          dCustomersDry, dCustomersCoffee, fwtWet, comoInDrawer, amexTots, visaMcTots, [], [], [], spendStaffPts,
          comoDiscAsset, takeDry, takeCoffee, takeGiftCard, takeDepositPaid, paidOutAmnt, paidOutTo, banked,
          cashAdvantageBag, cashAdvantageBagSeenBy, bankedPm, cashAdvantageBagPm, cashAdvantageBagSeenByPm, undefined,
          undefined, sfdNotes, pubSecuredBy, barClosedBy, floorClosedBy, nextDoorBy, paypal, deliveroo, takeVouchersWet,
          takeVouchersDry, takeVouchersHot, [], []);
  }

  public with(obj: CashUpEntityUpdateType): CashUpEntityInputs {
    return new CashUpEntityInputs(obj.date !== undefined ? obj.date : this.date, obj.mod !== undefined ? obj.mod : this.mod, obj.dailyNotes !== undefined ? obj.dailyNotes : this.dailyNotes, obj.chargeToAccount !== undefined ? obj.chargeToAccount : this.chargeToAccount, obj.depositRedeemed !== undefined ? obj.depositRedeemed : this.depositRedeemed, obj.compsWet !== undefined ? obj.compsWet : this.compsWet, obj.dStaffDry !== undefined ? obj.dStaffDry : this.dStaffDry, obj.dCustomersWet !== undefined ? obj.dCustomersWet : this.dCustomersWet, obj.dCustomersDry !== undefined ? obj.dCustomersDry : this.dCustomersDry, obj.dCustomersCoffee !== undefined ? obj.dCustomersCoffee : this.dCustomersCoffee, obj.fwtWet !== undefined ? obj.fwtWet : this.fwtWet, obj.comoInDrawer !== undefined ? obj.comoInDrawer : this.comoInDrawer, obj.amexTots !== undefined ? obj.amexTots : this.amexTots, obj.visaMcTots !== undefined ? obj.visaMcTots : this.visaMcTots, obj.spendStaffPts !== undefined ? obj.spendStaffPts : this.spendStaffPts, obj.comoDiscAsset !== undefined ? obj.comoDiscAsset : this.comoDiscAsset, obj.takeDry !== undefined ? obj.takeDry : this.takeDry, obj.takeCoffee !== undefined ? obj.takeCoffee : this.takeCoffee, obj.takeGiftCard !== undefined ? obj.takeGiftCard : this.takeGiftCard, obj.takeDepositPaid !== undefined ? obj.takeDepositPaid : this.takeDepositPaid, obj.paidOutAmount !== undefined ? obj.paidOutAmount : this.paidOutAmount, obj.paidOutTo !== undefined ? obj.paidOutTo : this.paidOutTo, obj.banked !== undefined ? obj.banked : this.banked, obj.cashAdvantageBag !== undefined ? obj.cashAdvantageBag : this.cashAdvantageBag, obj.cashAdvantageBagSeenBy !== undefined ? obj.cashAdvantageBagSeenBy : this.cashAdvantageBagSeenBy, obj.bankedPm !== undefined ? obj.bankedPm : this.bankedPm, obj.cashAdvantageBagPm !== undefined ? obj.cashAdvantageBagPm : this.cashAdvantageBagPm, obj.cashAdvantageBagSeenByPm !== undefined ? obj.cashAdvantageBagSeenByPm : this.cashAdvantageBagSeenByPm, obj.sfdNotes !== undefined ? obj.sfdNotes : this.sfdNotes, obj.pubSecuredBy !== undefined ? obj.pubSecuredBy : this.pubSecuredBy, obj.barClosedBy !== undefined ? obj.barClosedBy : this.barClosedBy, obj.floorClosedBy !== undefined ? obj.floorClosedBy : this.floorClosedBy, obj.nextDoorBy !== undefined ? obj.nextDoorBy : this.nextDoorBy, obj.paypal !== undefined ? obj.paypal : this.paypal, obj.deliveroo !== undefined ? obj.deliveroo : this.deliveroo, obj.takeVouchersWet !== undefined ? obj.takeVouchersWet : this.takeVouchersWet, obj.takeVouchersDry !== undefined ? obj.takeVouchersDry : this.takeVouchersDry, obj.takeVouchersHot !== undefined ? obj.takeVouchersHot : this.takeVouchersHot);
  }
}