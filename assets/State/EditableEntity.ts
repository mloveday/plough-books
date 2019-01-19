export abstract class EditableEntity {
  public abstract with(obj: any): any; // we really want this to return the class extending EditableEntity
  public abstract get entityId(): number;
}