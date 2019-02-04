import {StaffRoleNotPersisted} from "./StaffRoleNotPersisted";

describe('StaffRoleNotPersisted', () => {
  it('fromResponse parses object correctly', () => {
    const object = {
      role: 'foo',
      orderInRota: 6,
      status: 'active',
      type: 'bar',
      id: 9,
    };

    const actual = StaffRoleNotPersisted.default().with(object);

    expect(actual.role).toEqual(object.role);
    expect(actual.orderInRota).toEqual(object.orderInRota);
    expect(actual.status).toEqual(object.status);
    expect(actual.type).toEqual(object.type);
    expect(actual.entityId).toEqual(-1);
    expect(actual.isValid()).toBeFalsy();
  });
  it('with parses role in object correctly', () => {
    const object = {
      role: 'foo',
      orderInRota: 6,
      status: 'active',
      type: 'bar',
      id: 9,
    };
    const actual = StaffRoleNotPersisted.default().with(object);
    const expectedRole = 'bar';

    const modified = actual.with({role: expectedRole});

    expect(modified.orderInRota).toEqual(object.orderInRota);
    expect(modified.status).toEqual(object.status);
    expect(modified.type).toEqual(object.type);
    expect(modified.entityId).toEqual(-1);
    expect(modified.isValid()).toBeFalsy();

    expect(modified.role).toEqual(expectedRole);
  });
  it('with parses orderInRota in object correctly', () => {
    const object = {
      role: 'foo',
      orderInRota: 6,
      status: 'active',
      type: 'bar',
      id: 9,
    };
    const actual = StaffRoleNotPersisted.default().with(object);
    const expectedOrderInRota = 7;

    const modified = actual.with({orderInRota: expectedOrderInRota});

    expect(modified.role).toEqual(object.role);
    expect(modified.status).toEqual(object.status);
    expect(modified.type).toEqual(object.type);
    expect(modified.entityId).toEqual(-1);
    expect(modified.isValid()).toBeFalsy();

    expect(modified.orderInRota).toEqual(expectedOrderInRota);
  });
  it('with parses status in object correctly', () => {
    const object = {
      role: 'foo',
      orderInRota: 6,
      status: 'active',
      type: 'bar',
      id: 9,
    };
    const actual = StaffRoleNotPersisted.default().with(object);
    const expectedStatus = 'inactive';

    const modified = actual.with({status: expectedStatus});

    expect(modified.role).toEqual(object.role);
    expect(modified.orderInRota).toEqual(object.orderInRota);
    expect(modified.type).toEqual(object.type);
    expect(modified.entityId).toEqual(-1);
    expect(modified.isValid()).toBeFalsy();

    expect(modified.status).toEqual(expectedStatus);
  });
  it('with parses type in object correctly', () => {
    const object = {
      role: 'foo',
      orderInRota: 6,
      status: 'active',
      type: 'bar',
      id: 9,
    };
    const actual = StaffRoleNotPersisted.default().with(object);
    const expectedType = 'kitchen';

    const modified = actual.with({type: expectedType});

    expect(modified.role).toEqual(object.role);
    expect(modified.orderInRota).toEqual(object.orderInRota);
    expect(modified.status).toEqual(object.status);
    expect(modified.entityId).toEqual(-1);
    expect(modified.isValid()).toBeFalsy();

    expect(modified.type).toEqual(expectedType);
  });
});