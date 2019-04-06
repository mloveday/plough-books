export interface EditableEntity {
  readonly entityId: number;
  // we really want these methods to return the class extending EditableEntity
  with(obj: any): any;
  clone(): any;
}