import {CashUpSection} from "../../../Enum/CashUpSection";

export class SectionPosition {
  public readonly section: CashUpSection;
  public readonly previous: CashUpSection;
  public readonly next: CashUpSection;

  constructor(section: CashUpSection, previous: CashUpSection, next: CashUpSection) {
    this.section = section;
    this.previous = previous;
    this.next = next;
  }
}