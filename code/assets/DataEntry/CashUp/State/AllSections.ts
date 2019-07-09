import {CashUpSection} from "../../../Model/Enum/CashUpSection";
import {SectionPosition} from "./SectionPosition";

export const sectionOrder = new Map([
  [CashUpSection.TILLS, new SectionPosition(CashUpSection.TILLS, CashUpSection.RECEIPTS, CashUpSection.SECURITY)],
  [CashUpSection.RECEIPTS, new SectionPosition(CashUpSection.RECEIPTS, CashUpSection.SPEND_STAFF_PTS_COMO, CashUpSection.TILLS)],
  [CashUpSection.SPEND_STAFF_PTS_COMO, new SectionPosition(CashUpSection.SPEND_STAFF_PTS_COMO, CashUpSection.NETT_TAKES, CashUpSection.RECEIPTS)],
  [CashUpSection.NETT_TAKES, new SectionPosition(CashUpSection.NETT_TAKES, CashUpSection.BANKING, CashUpSection.SPEND_STAFF_PTS_COMO)],
  [CashUpSection.BANKING, new SectionPosition(CashUpSection.BANKING, CashUpSection.SAFE_FLOAT, CashUpSection.NETT_TAKES)],
  [CashUpSection.SAFE_FLOAT, new SectionPosition(CashUpSection.SAFE_FLOAT, CashUpSection.SECURITY, CashUpSection.BANKING)],
  [CashUpSection.SECURITY, new SectionPosition(CashUpSection.SECURITY, CashUpSection.TILLS, CashUpSection.SAFE_FLOAT)],
]);