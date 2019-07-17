import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {AppState} from "../../../redux";
import {Formatting} from "../../../Util/Formatting";

interface CashUpSummaryOwnProps {
  cashUp: CashUpEntity;
}

interface CashUpSummaryStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpSummaryOwnProps): CashUpSummaryStateProps => {
  return {}
};

interface CashUpSummaryDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpSummaryOwnProps): CashUpSummaryDispatchProps => {
  return {};
};

type CashUpSummaryProps = CashUpSummaryOwnProps & CashUpSummaryStateProps & CashUpSummaryDispatchProps;

class CashUpSummaryComponent extends React.Component<CashUpSummaryProps, {}> {
  public render() {
    return (
      <div className={`z-read-summary`}>
        <div className={`summary-stat`}>
          <div>Total in drawer inc receipts</div>
          <div>{Formatting.formatCashForDisplay(this.props.cashUp.getTotalRevenue())}</div>
        </div>
        <div className={`summary-stat`}>
          <div>Como in drawer</div>
          <div>{Formatting.formatCashForDisplay(this.props.cashUp.comoInDrawer)}</div>
        </div>
        <div className={`summary-stat`}>
          <div>Comps</div>
          <div>{Formatting.formatCashForDisplay(this.props.cashUp.getTotalComps())}</div>
        </div>

        <div className={`summary-stat`}>
          <div>Expected z read</div>
          <div>{Formatting.formatCashForDisplay(this.props.cashUp.getTotalRevenue() + this.props.cashUp.comoInDrawer)}</div>
        </div>
        <div className={`summary-stat`}>
          <div>Actual z read</div>
          <div>{Formatting.formatCashForDisplay(this.props.cashUp.getTotalZRead())}</div>
        </div>
        <div className={`summary-stat`}>
          <div>Variance</div>
          <div>{Formatting.formatCashForDisplay(this.props.cashUp.getZReadVariance())}</div>
        </div>

        <div className={`summary-stat`}>
          <div>Visa/Amex fill in total</div>
          <div>{Formatting.formatCashForDisplay(this.props.cashUp.amexTots + this.props.cashUp.visaMcTots)}</div>
        </div>
        <div className={`summary-stat`}>
          <div>Visa/Amex in tills</div>
          <div>{Formatting.formatCashForDisplay(this.props.cashUp.tills.reduce((prev, curr) => prev + curr.visa + curr.amex,0))}</div>
        </div>
        <div className={`summary-stat`}>
          <div>Variance</div>
          <div>{Formatting.formatCashForDisplay(this.props.cashUp.amexTots + this.props.cashUp.visaMcTots - this.props.cashUp.tills.reduce((prev, curr) => prev + curr.visa + curr.amex,0))}</div>
        </div>
      </div>
    )
  }
}

export const CashUpSummary = connect<CashUpSummaryStateProps, CashUpSummaryDispatchProps, CashUpSummaryOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpSummaryComponent);
