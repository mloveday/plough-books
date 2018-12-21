import * as React from "react";
import {ComparisonFunctions} from "./ComparisonFunctions";
import {ForecastVsActual} from "./ForecastVsActual";

interface ForecastVsActualOwnProps {
  label: string;
  showLabel?: boolean;
  forecast: number;
  actual: number;
}

export class CostRateCompare extends React.Component<ForecastVsActualOwnProps, {}> {
  public render() {
    return (
      <ForecastVsActual label={this.props.label}
                        showLabel={this.props.showLabel}
                        forecast={this.props.forecast*100}
                        actual={this.props.actual*100}
                        compareFn={ComparisonFunctions.smallerBetter}
                        formatFn={v => `${v.toFixed(2)}%`} />
    )
  }
}