import * as React from 'react';

export class SignIn extends React.Component {
  public render() {
    return (
      <div>
        <h2>Sign in sheet data entry requirements</h2>
        <ul>
          <li>List of staff</li>
          <li>Hourly rate for staff</li>
          <li>Hours worked for day</li>
          <li>Breaks</li>
          <li>Fixed costs</li>
        </ul>
        <h3>DB</h3>
        <ul>
          <li>Staff (name, current hourly rate)</li>
          <li>Hours rotad on day (start, end, expected break)</li>
          <li>Hours worked on day (start, end, break duration, hourly rate [duplicate from staff on create])</li>
        </ul>
      </div>)
  }
}