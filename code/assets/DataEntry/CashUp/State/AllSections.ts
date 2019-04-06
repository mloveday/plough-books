import {CashUpSection} from "../../../Model/Enum/CashUpSection";
import {SectionPosition} from "./SectionPosition";

export const sectionOrder = new Map([
  [CashUpSection.TILLS, new SectionPosition(CashUpSection.TILLS, CashUpSection.DISCOUNTS, CashUpSection.SUMMARY)],
  [CashUpSection.DISCOUNTS, new SectionPosition(CashUpSection.DISCOUNTS, CashUpSection.CARDS, CashUpSection.TILLS)],
  [CashUpSection.CARDS, new SectionPosition(CashUpSection.CARDS, CashUpSection.RECEIPTS, CashUpSection.DISCOUNTS)],
  [CashUpSection.RECEIPTS, new SectionPosition(CashUpSection.RECEIPTS, CashUpSection.SPEND_STAFF_PTS_COMO, CashUpSection.CARDS)],
  [CashUpSection.SPEND_STAFF_PTS_COMO, new SectionPosition(CashUpSection.SPEND_STAFF_PTS_COMO, CashUpSection.NETT_TAKES, CashUpSection.RECEIPTS)],
  [CashUpSection.NETT_TAKES, new SectionPosition(CashUpSection.NETT_TAKES, CashUpSection.BANKING, CashUpSection.SPEND_STAFF_PTS_COMO)],
  [CashUpSection.BANKING, new SectionPosition(CashUpSection.BANKING, CashUpSection.SAFE_FLOAT, CashUpSection.NETT_TAKES)],
  [CashUpSection.SAFE_FLOAT, new SectionPosition(CashUpSection.SAFE_FLOAT, CashUpSection.SUMMARY, CashUpSection.BANKING)],
  [CashUpSection.SUMMARY, new SectionPosition(CashUpSection.SUMMARY, CashUpSection.TILLS, CashUpSection.SAFE_FLOAT)],
]);