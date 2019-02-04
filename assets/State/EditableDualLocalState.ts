import {EditableEntity} from "./EditableEntity";

// TODO Rename this to IApiEditableLocalState when current IApiEditableLocalState is not used
export interface IApiEditableDualLocalState<N extends EditableEntity, T extends N> {
  editingEntityId?: number;
  isCreatingEntity?: boolean;
  newEntity?: N;
  entities?: T[];

  with(obj: IApiEditableDualLocalState<N,T>): IApiEditableDualLocalState<N,T>; // we really want this to return the class extending EditableDualLocalState
}

// TODO Rename this to EditableLocalState when current EditableLocalState is not used
export abstract class EditableDualLocalState<N extends EditableEntity, T extends N> implements IApiEditableDualLocalState<N, T> {
  private static NOT_EDITING_ID = -1;

  public readonly editingEntityId: number = EditableDualLocalState.NOT_EDITING_ID;
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

  public withEntities(obj: any[], editingEntityId: number = EditableDualLocalState.NOT_EDITING_ID) {
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
    return this.editingEntityId !== EditableDualLocalState.NOT_EDITING_ID;
  }

  public abstract with(obj: any): any; // we really want this to return the class extending EditableDualLocalState
}