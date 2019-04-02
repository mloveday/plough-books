interface Identified {
  readonly id: number;
}

interface HasInputs<T> {
  readonly inputs: T;
}

type RequiredType<T> = {
  readonly [P in keyof T]: T[P];
}

// numerical properties, for parsing responses. Always has an id property. Requires properties.
export type ApiType<T> = RequiredType<T> & Identified;

// string properties, for passing raw input values as updates. May or may not have an id property. Partial properties.
export type UpdateType<T> = Readonly<Partial<T>>;

// string properties, for holding raw input values. No id. Requires properties.
export type InputType<T> = Readonly<T>;

// numerical properties with input field for holding raw inputs. May or may not have an id property.
export type EntityType<A, I> = RequiredType<A> & Partial<Identified> & HasInputs<InputType<I>>;