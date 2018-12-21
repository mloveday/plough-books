import * as React from "react";
import "./ForecastVsActual.scss";

interface ForecastVsActualOwnProps {
  label: string;
  showLabel?: boolean;
  forecast: number;
  actual: number;
  formatFn: (v: number) => string;
  compareFn: (forecast:number, actual:number) => number; // +1 => "actual good", -1 => "actual bad", <any other> => "neutral"
}

export class ForecastVsActual extends React.Component<ForecastVsActualOwnProps, {}> {
  public render() {
    const compare = this.props.compareFn(this.props.forecast, this.props.actual);
    const classModifier = (compare === -1 ? "bad" : (compare === 1 ? "good" : "neutral"));
    const showLabel = this.props.showLabel === undefined ? true : this.props.showLabel;
    const forecast = isNaN(this.props.forecast) ? "-" : this.props.formatFn(this.props.forecast);
    const actual = isNaN(this.props.actual) ? "-" : this.props.formatFn(this.props.actual);
    return (
      <div className="forecast-vs-actual">
        {showLabel && <div className="label">{this.props.label}</div> }
        <div className={`actual ${classModifier}`}>{actual}</div>
        <div className={`forecast ${classModifier}`}>{`(${forecast})`}</div>
      </div>
    )
  }
}