import {EditableEntity} from "../Model/EditableEntity";

export interface IApiEditableLocalState<T extends EditableEntity> {
  editingEntityId?: number;
  isCreatingEntity?: boolean;
  newEntity?: T;
  entities?: T[];
}

export interface IEditableLocalState<T extends EditableEntity> extends IApiEditableLocalState<T> {
  with(obj: IApiEditableLocalState<T>): IEditableLocalState<T>; // we really want this to return the class extending EditableLocalState
}

export abstract class EditableLocalState<T extends EditableEntity> implements IEditableLocalState<T> {
  protected static NOT_EDITING_ID = -1;

  public readonly editingEntityId: number = EditableLocalState.NOT_EDITING_ID;
  public readonly isCreatingEntity: boolean = false;
  public readonly newEntity: T;
  public readonly entities: T[] = [];

  protected readonly fromObjFn: (obj: any) => T;
  private readonly compareFn: (a: T, b: T) => number;

  protected constructor(cloneFn: (obj: any) => T, compareFn: (a: T, b: T) => number) {
    this.fromObjFn = cloneFn;
    this.compareFn = compareFn;
  }

  public isEditing() {
    return this.editingEntityId !== EditableLocalState.NOT_EDITING_ID;
  }

  // TODO we really want these to return the class extending EditableLocalState
  public abstract with(obj: IApiEditableLocalState<T>): IEditableLocalState<T>;
  public abstract withEntities(obj: T[], editingEntityId: number): IEditableLocalState<T>;
  public abstract withEntity(obj: T): IEditableLocalState<T>;
  public abstract withNewEntity(obj: T): IEditableLocalState<T>;

  protected getUpdatedEntitiesObject(obj: T[], editingEntityId: number): IApiEditableLocalState<T> {
    const newEntities = new Map<number, T>();
    obj.forEach(v => {
      newEntities.set(v.entityId, this.fromObjFn(v))
    });
    const entities = new Map<number, T>();
    this.entities.forEach(v => {
      const entity = newEntities.get(v.entityId);
      entities.set(v.entityId, entity ? entity : v.with({}));
    });
    newEntities.forEach((v,k) => entities.set(k, v));
    return {
      isCreatingEntity: false,
      editingEntityId,
      entities: Array.from(entities.values()).sort(this.compareFn)
    };
  }

  protected getNewEntityObject(entity: T): IApiEditableLocalState<T> {
    return {
      isCreatingEntity: true,
      newEntity: entity,
      entities: this.entities.map(r => r.with({})),
    };
  }

  protected getUpdatedEntityObject(obj: T): IApiEditableLocalState<T> {
    const entities = this.entities.map(entity => entity.entityId === obj.entityId ? obj : entity.with({}));
    return {
      isCreatingEntity: false,
      editingEntityId: obj.entityId,
      entities: entities.sort(this.compareFn)
    };
  }
}