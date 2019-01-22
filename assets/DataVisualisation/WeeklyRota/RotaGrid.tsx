import * as React from "react";
import {RotaEntity} from "../../DataEntry/Rota/State/RotaEntity";
import {StaffMember} from "../../DataEntry/Rota/State/StaffMember";
import {StaffRole} from "../../DataEntry/Rota/State/StaffRole";
import {DateFormats} from "../../Util/DateFormats";

interface RotaGridOwnProps {
  staff: StaffMember[];
  rotas: RotaEntity[];
  roles: StaffRole[];
}

export class RotaGridComponent extends React.Component<RotaGridOwnProps, {}> {
  public render() {
    let firstNonEmptyRoleFound = false;
    return (
      <div className="rota-grid">
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
          const staffNamesColumn = <div key={-1} className="rota-column">
            {showDateRow && <div className="date-header"/>}
            <div className="staff-role">{role.role}</div>
            {staffForRole.map((staffMember, key) => (
              <div key={key} className="staff-member">{staffMember.name}</div>
            ))}
          </div>;
          const rotaColumns = this.props.rotas
            .map((rota, key) => (
              <div key={key} className="rota-column">
                {showDateRow && <div className="date-header">{rota.getDate().format(DateFormats.READABLE_NO_YEAR)}</div>}
                {showDateRow && <div className="staff-role staff-role-shift">
                  <div>Start</div>
                  <div>End</div>
                  <div>Breaks</div>
                </div>}
                {!showDateRow && <div className={"staff-role"}/>}
                {staffForRole.map((staffMember, staffKey) => {
                    const shift = rota.plannedShifts.find(plannedShift => plannedShift.staffMember.id === staffMember.id);
                    return shift ? (<div key={staffKey} className="shift">
                      <div>{shift.getStartTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.getEndTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                      <div>{shift.totalBreaks * 60}</div>
                    </div>) : <div key={staffKey} className="shift"/>;
                  }
                )}
              </div>
            ));
          const totalHoursColumn = <div key={-3} className="rota-column">
            {showDateRow && <div className="date-header">Total hours</div>}
            <div className="staff-role" />
            {staffForRole.map((staffMember, staffKey) => {
                const totalHours = this.props.rotas.reduce((prev, curr) => {
                  const shift = curr.plannedShifts.find(plannedShift => plannedShift.staffMember.id === staffMember.id);
                  return prev + (shift ? shift.getEndTime().diff(shift.getStartTime(), 'minutes') - shift.totalBreaks*60 : 0);
                }, 0);
                return <div key={staffKey} className="shift">{(totalHours/60).toFixed(2)}</div>;
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
