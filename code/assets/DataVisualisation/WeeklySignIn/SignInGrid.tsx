import * as React from "react";
import {RotaEntity} from "../../Model/Rota/RotaEntity";
import {StaffMember} from "../../Model/StaffMember/StaffMember";
import {StaffRole} from "../../Model/StaffRole/StaffRole";
import {DateFormats} from "../../Util/DateFormats";

interface SignInGridOwnProps {
  staff: StaffMember[];
  rotas: RotaEntity[];
  roles: StaffRole[];
}

export class SignInGridComponent extends React.Component<SignInGridOwnProps, {}> {
  public render() {
    let firstNonEmptyRoleFound = false;
    return (
      <div className="sign-in-grid">
        {this.props.roles.map((role, roleKey) => {
          const staffForRole = this.props.staff.filter(staff => staff.role.id === role.id);
          if (staffForRole.length === 0) {
            return null;
          }
          let showDateRow = false;
          if (!firstNonEmptyRoleFound) {
            showDateRow = true;
            firstNonEmptyRoleFound = true;
          }
          const staffNamesColumn = <div key={-1} className="sign-in-column">
            {showDateRow && <div className="date-header"/>}
            <div className="staff-role sign-in-grid-header">{role.role}</div>
            {staffForRole.map((staffMember, key) => (
              <div key={key} className="staff-member">{staffMember.name}</div>
            ))}
          </div>;
          const rotaColumns = this.props.rotas
            .map((rota, key) => (
              <div key={key} className="sign-in-column">
                {showDateRow && <div className="date-header">{rota.getDate().format(DateFormats.READABLE_NO_YEAR)}</div>}
                {showDateRow && <div className="staff-role staff-role-shift sign-in-grid-header">
                  <div>Start</div>
                  <div>End</div>
                  <div>Breaks</div>
                </div>}
                {!showDateRow && <div className={"staff-role"}/>}
                {staffForRole.map((staffMember, staffKey) => {
                    const shift = rota.actualShifts.find(actualShift => actualShift.staffMember.id === staffMember.id);
                    return shift ? (<div key={staffKey} className="shift">
                      <div>{shift.getStartTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.getEndTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.totalBreaks * 60}</div>
                    </div>) : <div key={staffKey} className="shift"/>;
                  }
                )}
              </div>
            ));
          const totalHoursColumn = <div key={-3} className="sign-in-column">
            {showDateRow && <div className="date-header">Total hours</div>}
            <div className="sign-in-grid-header" />
            {staffForRole.map((staffMember, staffKey) => {
                const totalHours = this.props.rotas.reduce((prev, curr) => {
                  const shift = curr.actualShifts.find(actualShift => actualShift.staffMember.id === staffMember.id);
                  return prev + (shift ? shift.getEndTime().diff(shift.getStartTime(), 'minutes') - shift.totalBreaks*60 : 0);
                }, 0);
                return <div key={staffKey} className="total-hours">{(totalHours/60).toFixed(2)}</div>;
              }
            )}
          </div>;
          return [
            staffNamesColumn,
            ...rotaColumns,
            totalHoursColumn
          ];
        })}

      </div>
    )
  }
}
