import * as React from "react";
import {ComparisonFunctions} from "./ComparisonFunctions";
import {ForecastVsActual} from "./ForecastVsActual";

interface ForecastVsActualOwnProps {
  label: string;
  showLabel?: boolean;
  forecast: number;
  actual: number;
}

export class RevenueCompare extends React.Component<ForecastVsActualOwnProps, {}> {
  public render() {
    return (
      <ForecastVsActual label={this.props.label}
                        showLabel={this.props.showLabel}
                        forecast={this.props.forecast}
                        actual={this.props.actual}
                        compareFn={ComparisonFunctions.biggerBetter}
                        formatFn={v => `£${v.toFixed(2)}`} />
    )
  }
}