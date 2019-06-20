import * as React from "react";
import {Formatting} from "../../Util/Formatting";
import {ComparisonFunctions} from "./ComparisonFunctions";
import {ForecastVsActual} from "./ForecastVsActual";

interface HoursCompareOwnProps {
  label: string;
  showLabel?: boolean;
  forecast: number;
  actual: number;
}

export class HoursCompare extends React.Component<HoursCompareOwnProps, {}> {
  public render() {
    return (
      <ForecastVsActual label={this.props.label}
                        showLabel={this.props.showLabel}
                        forecast={this.props.forecast}
                        actual={this.props.actual}
                        compareFn={ComparisonFunctions.smallerBetter}
                        formatFn={v => `${Formatting.formatNumber(v)} hrs`} />
    )
  }
}