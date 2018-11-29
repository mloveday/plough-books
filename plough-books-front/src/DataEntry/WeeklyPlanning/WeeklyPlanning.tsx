import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";

interface WeeklyPlanningOwnProps {
}

interface WeeklyPlanningStateProps {
}

const mapStateToProps = (state: AppState, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningStateProps => {
  return {}
};

interface WeeklyPlanningDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: WeeklyPlanningOwnProps): WeeklyPlanningDispatchProps => {
  return {};
};

type WeeklyPlanningProps = WeeklyPlanningOwnProps & WeeklyPlanningStateProps & WeeklyPlanningDispatchProps;

class WeeklyPlanningComponent extends React.Component<WeeklyPlanningProps, {}> {
  public render() {
    return (
      <div>Weekly planning</div>
    )
  }
}

export const WeeklyPlanning = connect<WeeklyPlanningStateProps, WeeklyPlanningDispatchProps, WeeklyPlanningOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyPlanningComponent);