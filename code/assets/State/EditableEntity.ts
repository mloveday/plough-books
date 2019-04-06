export interface EditableEntity {
  readonly entityId: number;
  with(obj: any): EditableEntity; // we really want this to return the class extending EditableEntity
}