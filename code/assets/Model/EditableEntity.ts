export interface EditableEntity {
  readonly entityId: number;
  with(obj: any): any; // we really want this to return the class extending EditableEntity
}