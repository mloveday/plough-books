import {StaffMemberStatus} from "../../../Enum/StaffMemberStatus";
import {StaffRole} from "../../StaffRoles/State/StaffRole";
import {IStaffMemberApiObject, StaffMember} from "./StaffMember";

describe('StaffMember', () => {
  const object: IStaffMemberApiObject = {
    name: 'foo',
    currentHourlyRate: 6,
    status: 'inactive',
    role: StaffRole.placeholder(),
    id: 9,
  };
  const defaultStaffMember = () => StaffMember.fromResponse(object);
  it('fromResponse parses object correctly', () => {
    const actual = defaultStaffMember();

    expect(actual.name).toEqual(object.name);
    expect(actual.role).toEqual(object.role);
    expect(actual.currentHourlyRate).toEqual(object.currentHourlyRate);
    expect(actual.status).toEqual(object.status);
    expect(actual.id).toEqual(object.id);
    expect(actual.entityId).toEqual(object.id);
    expect(actual.isActive()).toBeFalsy();
  });
  it('with parses role in object correctly', () => {
    const actual = defaultStaffMember();
    const expectedRole = StaffRole.placeholder().with({role: 'bar'});

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

    expect(modified.role).toEqual(object.role);
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
    expect(modified.role).toEqual(object.role);
    expect(modified.currentHourlyRate).toEqual(object.currentHourlyRate);
    expect(modified.id).toEqual(object.id);
    expect(modified.entityId).toEqual(object.id);

    expect(modified.isActive()).toBeTruthy();
    expect(modified.status).toEqual(expectedStatus);
  });
  it('with parses currentHourlyRate in object correctly', () => {
    const actual = defaultStaffMember();
    const expectedHourlyRate = 5.43;

    const modified = actual.with({currentHourlyRate: expectedHourlyRate});

    expect(modified.name).toEqual(object.name);
    expect(modified.role).toEqual(object.role);
    expect(modified.id).toEqual(object.id);
    expect(modified.entityId).toEqual(object.id);
    expect(modified.isActive()).toBeFalsy();

    expect(modified.currentHourlyRate).toEqual(expectedHourlyRate);
  });
  it('with parses id in object correctly', () => {
    const actual = defaultStaffMember();
    const expectedId = 10;

    const modified = actual.with({id: expectedId});

    expect(modified.name).toEqual(object.name);
    expect(modified.role).toEqual(object.role);
    expect(modified.currentHourlyRate).toEqual(object.currentHourlyRate);
    expect(modified.isActive()).toBeFalsy();

    expect(modified.id).toEqual(expectedId);
    expect(modified.entityId).toEqual(expectedId);
  });
});