import {StaffMemberStatus} from "../../../Enum/StaffMemberStatus";
import {StaffRole} from "../../StaffRoles/State/StaffRole";
import {IStaffMemberNotPersistedUpdateObject, StaffMemberNotPersisted} from "./StaffMemberNotPersisted";

describe('StaffMemberNotPersisted', () => {
  const object: IStaffMemberNotPersistedUpdateObject = {
    name: 'foo',
    currentHourlyRate: 6,
    status: 'inactive',
    role: StaffRole.placeholder(),
  };
  const defaultStaffMember = () => StaffMemberNotPersisted.default();
  it('with parses object correctly', () => {
    const actual = defaultStaffMember().with(object);

    expect(actual.name).toEqual(object.name);
    expect(actual.role).toEqual(object.role);
    expect(actual.currentHourlyRate).toEqual(object.currentHourlyRate);
    expect(actual.status).toEqual(object.status);
    expect(actual.entityId).toEqual(-1);
    expect(actual.isActive()).toBeFalsy();
  });
  it('with parses role in object correctly', () => {
    const actual = defaultStaffMember().with(object);
    const expectedRole = StaffRole.placeholder().with({role: 'bar'});

    const modified = actual.with({role: expectedRole});

    expect(modified.name).toEqual(object.name);
    expect(modified.currentHourlyRate).toEqual(object.currentHourlyRate);
    expect(modified.entityId).toEqual(-1);
    expect(modified.isActive()).toBeFalsy();

    expect(modified.role).toEqual(expectedRole);
  });
  it('with parses name in object correctly', () => {
    const actual = defaultStaffMember().with(object);
    const expectedName = 'gareth';

    const modified = actual.with({name: expectedName});

    expect(modified.role).toEqual(object.role);
    expect(modified.currentHourlyRate).toEqual(object.currentHourlyRate);
    expect(modified.entityId).toEqual(-1);
    expect(modified.isActive()).toBeFalsy();

    expect(modified.name).toEqual(expectedName);
  });
  it('with parses status in object correctly', () => {
    const actual = defaultStaffMember().with(object);
    const expectedStatus = StaffMemberStatus.ACTIVE;

    const modified = actual.with({status: expectedStatus});

    expect(modified.name).toEqual(object.name);
    expect(modified.role).toEqual(object.role);
    expect(modified.currentHourlyRate).toEqual(object.currentHourlyRate);
    expect(modified.entityId).toEqual(-1);

    expect(modified.isActive()).toBeTruthy();
    expect(modified.status).toEqual(expectedStatus);
  });
  it('with parses currentHourlyRate in object correctly', () => {
    const actual = defaultStaffMember().with(object);
    const expectedHourlyRate = 5.43;

    const modified = actual.with({currentHourlyRate: expectedHourlyRate});

    expect(modified.name).toEqual(object.name);
    expect(modified.role).toEqual(object.role);
    expect(modified.entityId).toEqual(-1);
    expect(modified.isActive()).toBeFalsy();

    expect(modified.currentHourlyRate).toEqual(expectedHourlyRate);
  });
});