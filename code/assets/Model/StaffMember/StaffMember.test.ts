import {StaffMemberStatus} from "../Enum/StaffMemberStatus";
import {StaffRole} from "../StaffRole/StaffRole";
import {StaffMember} from "./StaffMember";
import {StaffMemberApiType} from "./StaffMemberTypes";

describe('StaffMember', () => {
  const object: StaffMemberApiType = {
    name: 'foo',
    currentHourlyRate: 6,
    status: 'inactive',
    role: {
      id: 8,
      role:'baz',
      orderInRota:4,
      status:'active',
      type:'bar',
    },
    id: 9,
  };
  const defaultStaffMember = () => StaffMember.fromResponse(object);
  const testRoleIsEqualToObject = (role: StaffRole) => {
    expect(role.id).toEqual(object.role.id);
    expect(role.role).toEqual(object.role.role);
    expect(role.status).toEqual(object.role.status);
    expect(role.type).toEqual(object.role.type);
  };

  it('fromResponse parses object correctly', () => {
    const actual = defaultStaffMember();

    expect(actual.name).toEqual(object.name);
    testRoleIsEqualToObject(actual.role);
    expect(actual.currentHourlyRate).toEqual(object.currentHourlyRate);
    expect(actual.status).toEqual(object.status);
    expect(actual.id).toEqual(object.id);
    expect(actual.entityId).toEqual(object.id);
    expect(actual.isActive()).toBeFalsy();
  });
  it('with parses role in object correctly', () => {
    const actual = defaultStaffMember();
    const expectedRole = StaffRole.default().with({role: 'bar'});

    const modified = actual.with({role: expectedRole});

    expect(modified.name).toEqual(object.name);
    expect(modified.currentHourlyRate).toEqual(object.currentHourlyRate);
    expect(modified.id).toEqual(object.id);
    expect(modified.entityId).toEqual(object.id);
    expect(modified.isActive()).toBeFalsy();

    expect(modified.role).toEqual(expectedRole);
  });
  it('with parses name in object correctly', () => {
    const actual = defaultStaffMember();
    const expectedName = 'gareth';

    const modified = actual.with({name: expectedName});

    testRoleIsEqualToObject(actual.role);
    expect(modified.currentHourlyRate).toEqual(object.currentHourlyRate);
    expect(modified.id).toEqual(object.id);
    expect(modified.entityId).toEqual(object.id);
    expect(modified.isActive()).toBeFalsy();

    expect(modified.name).toEqual(expectedName);
  });
  it('with parses status in object correctly', () => {
    const actual = defaultStaffMember();
    const expectedStatus = StaffMemberStatus.ACTIVE;

    const modified = actual.with({status: expectedStatus});

    expect(modified.name).toEqual(object.name);
    testRoleIsEqualToObject(actual.role);
    expect(modified.currentHourlyRate).toEqual(object.currentHourlyRate);
    expect(modified.id).toEqual(object.id);
    expect(modified.entityId).toEqual(object.id);

    expect(modified.isActive()).toBeTruthy();
    expect(modified.status).toEqual(expectedStatus);
  });
  it('with parses currentHourlyRate in object correctly', () => {
    const actual = defaultStaffMember();
    const expectedHourlyRate = 5.43;

    const modified = actual.with({currentHourlyRate: expectedHourlyRate.toString()});

    expect(modified.name).toEqual(object.name);
    testRoleIsEqualToObject(actual.role);
    expect(modified.id).toEqual(object.id);
    expect(modified.entityId).toEqual(object.id);
    expect(modified.isActive()).toBeFalsy();

    expect(modified.currentHourlyRate).toEqual(expectedHourlyRate);
  });
});