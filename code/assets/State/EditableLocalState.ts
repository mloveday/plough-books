import {EditableEntity} from "./EditableEntity";

export interface IApiEditableLocalState<N extends EditableEntity, T extends N> {
  editingEntityId?: number;
  isCreatingEntity?: boolean;
  newEntity?: N;
  entities?: T[];

  with(obj: IApiEditableLocalState<N,T>): IApiEditableLocalState<N,T>; // we really want this to return the class extending EditableLocalState
}

export abstract class EditableLocalState<N extends EditableEntity, T extends N> implements IApiEditableLocalState<N, T> {
  private static NOT_EDITING_ID = -1;

  public readonly editingEntityId: number = EditableLocalState.NOT_EDITING_ID;
  public readonly isCreatingEntity: boolean = false;
  public readonly newEntity: N;
  public readonly entities: T[] = [];

  private readonly fromObjFn: (obj: any) => T;
  private readonly compareFn: (a: T, b: T) => number;

  protected constructor(cloneFn: (obj: any) => T, compareFn: (a: T, b: T) => number) {
    this.fromObjFn = cloneFn;
    this.compareFn = compareFn;
  }

  public withNewEntity(entity: N) {
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