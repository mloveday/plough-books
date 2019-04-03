import {CashUpSection} from "../../../Enum/CashUpSection";

export class SectionPosition {
  public readonly section: CashUpSection;
  public readonly previous: CashUpSection;
  public readonly next: CashUpSection;

  constructor(section: CashUpSection, next: CashUpSection, previous: CashUpSection) {
    this.section = section;
    this.previous = previous;
    this.next = next;
  }
}