import {EditableEntity} from "./EditableEntity";


export abstract class EditableLocalState<T extends EditableEntity> {
  private static NOT_EDITING_ID = -1;

  public readonly editingEntityId: number = EditableLocalState.NOT_EDITING_ID;
  public readonly isCreatingEntity: boolean = false;
  public readonly newEntity: T;
  public readonly entities: T[] = [];

  private fromObjFn: (obj: any) => T;
  private compareFn: (a: T, b: T) => number;

  protected constructor(cloneFn: (obj: any) => T, compareFn: (a: T, b: T) => number) {
    this.fromObjFn = cloneFn;
    this.compareFn = compareFn;
  }

  public withNewEntity(entity: T) {
    return this.with({
      isCreatingEntity: true,
      newEntity: entity,
      entities: this.entities.map(r => r.with({})),
    })
  }

  public withEntities(obj: any[], editingEntityId: number = EditableLocalState.NOT_EDITING_ID) {
    const newEntities = new Map<number, T>();
    obj.forEach(v => {
      newEntities.set(v.id, this.fromObjFn(v))
    });
    const entities = new Map<number, T>();
    this.entities.forEach(v => {
      const entity = newEntities.get(v.entityId);
      entities.set(v.entityId, entity ? entity : v.with({}));
    });
    newEntities.forEach((v,k) => entities.set(k, v));
    return this.with(
      {
        isCreatingEntity: false,
        editingEntityId,
        entities: Array.from(entities.values()).sort(this.compareFn)
      }
    );
  }

  public isEditing() {
    return this.editingEntityId !== EditableLocalState.NOT_EDITING_ID;
  }

  public abstract with(obj: any): any; // we really want this to return the class extending EditableLocalState
}