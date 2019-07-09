import * as React from "react";
import {connect} from "react-redux";
import {CashUpEntity} from "../../../Model/CashUp/CashUpEntity";
import {CashUpEntityUpdateType} from "../../../Model/CashUp/CashUpEntityTypes";
import {TillDenominationsAbstract} from "../../../Model/Denominations/TillDenominationsTypes";
import {AppState} from "../../../redux";
import {Formatting} from "../../../Util/Formatting";
import {currencyPattern} from "../../../Util/Validation";
import {TillInputGroup} from "./TillInputGroup";

interface CashUpTillsOwnProps {
  cashUp: CashUpEntity;
  formUpdate: (obj: CashUpEntityUpdateType) => void;
}

interface CashUpTillsStateProps {
}

const mapStateToProps = (state: AppState, ownProps: CashUpTillsOwnProps): CashUpTillsStateProps => {
  return {}
};

interface CashUpTillsDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: CashUpTillsOwnProps): CashUpTillsDispatchProps => {
  return {};
};

type CashUpTillsProps = CashUpTillsOwnProps & CashUpTillsStateProps & CashUpTillsDispatchProps;

class CashUpTillsComponent extends React.Component<CashUpTillsProps, {}> {
  private tillRefs: Array<TillDenominationsAbstract<React.RefObject<{}>>> = [];

  constructor(props: CashUpTillsProps, context: any) {
    super(props, context);
    for (let i=0; i<7;i++) {
      this.tillRefs[i] = {
        fiftyPounds: React.createRef(),
        twentyPounds: React.createRef(),
        tenPounds: React.createRef(),
        fivePounds: React.createRef(),
        pounds: React.createRef(),
        fiftyPence: React.createRef(),
        twentyPence: React.createRef(),
        tenPence: React.createRef(),
        fivePence: React.createRef(),
        float_amnt: React.createRef(),
        visa: React.createRef(),
        amex: React.createRef(),
        zRead: React.createRef(),
      };
    }
  }

  public render() {
    return (
      <div className="form-group">
        <div className="form-row">
          <h4 className="group-label charge_deposit_label">Charge & deposit</h4>
          <div className="label-and-input charge_to_ac">
            <label htmlFor="charge_to_ac">Charge to account</label>
            <input id="charge_to_ac" type="text" pattern={currencyPattern}
                   value={this.props.cashUp.inputs.chargeToAccount}
                   onChange={ev => this.props.formUpdate({chargeToAccount: ev.target.value})}/>
          </div>
          <div className="label-and-input deposit_redeemed">
            <label htmlFor="deposit_redeemed">Deposit redeemed</label>
            <input id="deposit_redeemed" type="text" pattern={currencyPattern}
                   value={this.props.cashUp.inputs.depositRedeemed}
                   onChange={ev => this.props.formUpdate({depositRedeemed: ev.target.value})}/>
          </div>
        </div>

        <div className="form-row">
          <h4 className="group-label till_label">Tills</h4>
          <div className="per-till">
            <div className="till-label">1</div>
            <div className="till-label">2</div>
            <div className="till-label">3</div>
            <div className="till-label">4</div>
            <div className="till-label">5</div>
            <div className="till-label">6</div>
            <div className="till-label">7</div>
          </div>
        </div>

        <div className={`section-line`}/>

        <div className="form-row">
          <h4 className="group-label till_float_label">Till float</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'Till float'} tillRefs={this.tillRefs}
                          groupIdentifier={'till_float_tills'} tillProperty={'float_amnt'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className="form-row">
          <h4 className="group-label amex_label">AMEX</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'amex'} tillRefs={this.tillRefs}
                          groupIdentifier={'amex_tills'} tillProperty={'amex'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className="form-row">
          <h4 className="group-label visa_label">VISA</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'visa'} tillRefs={this.tillRefs}
                          groupIdentifier={'visa_tills'} tillProperty={'visa'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className="form-row">
          <h4 className="group-label fifty_label">£50</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'£50'} tillRefs={this.tillRefs}
                          groupIdentifier={'fifty_tills'} tillProperty={'fiftyPounds'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className="form-row">
          <h4 className="group-label twenty_label">£20</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'£20'} tillRefs={this.tillRefs}
                          groupIdentifier={'twenty_tills'} tillProperty={'twentyPounds'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className="form-row">
          <h4 className="group-label ten_label">£10</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'£10'} tillRefs={this.tillRefs}
                          groupIdentifier={'ten_tills'} tillProperty={'tenPounds'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className="form-row">
          <h4 className="group-label five_label">£5</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'£5'} tillRefs={this.tillRefs}
                          groupIdentifier={'five_tills'} tillProperty={'fivePounds'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className="form-row">
          <h4 className="group-label pounds_label">£1 &amp; £2</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'£1 & £2'} tillRefs={this.tillRefs}
                          groupIdentifier={'pounds_tills'} tillProperty={'pounds'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className="form-row">
          <h4 className="group-label fifty_p_label">50p</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'50p'} tillRefs={this.tillRefs}
                          groupIdentifier={'fifty_p_tills'} tillProperty={'fiftyPence'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className="form-row">
          <h4 className="group-label twenty_p_label">20p</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'20p'} tillRefs={this.tillRefs}
                          groupIdentifier={'twenty_p_tills'} tillProperty={'twentyPence'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className="form-row">
          <h4 className="group-label ten_p_label">10p</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'10p'} tillRefs={this.tillRefs}
                          groupIdentifier={'ten_p_tills'} tillProperty={'tenPence'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className="form-row">
          <h4 className="group-label five_p_label">5p</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'5p'} tillRefs={this.tillRefs}
                          groupIdentifier={'five_p_tills'} tillProperty={'fivePence'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className={`section-line`}/>
        <div className="form-row">
          <h4 className="group-label z_label">Z read</h4>
          <TillInputGroup formUpdate={obj => this.props.formUpdate(obj)} friendlyName={'Z'} tillRefs={this.tillRefs}
                          groupIdentifier={'z_tills'} tillProperty={'zRead'}
                          keyPressHandler={(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) => this.handleKeyPress(ev, tillIndex, tillProperty)}
                          tills={this.props.cashUp.tills}/>
        </div>

        <div className={`section-line`}/>
        <div className="form-row">
          <h4 className="group-label z_label">Z variance</h4>
          <div className={`per-till diff`}>
            {this.props.cashUp.tills.map((till, index) =>
              <div className="till-label-and-input" key={index}>
                <div>{Formatting.formatCashForDisplay(till.totalTaken() - till.zRead)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  private handleKeyPress(ev: React.KeyboardEvent<HTMLInputElement>, tillIndex: number, tillProperty: string) {
    const orderedInputs = [
      'float_amnt',
      'amex',
      'visa',
      'fiftyPounds',
      'twentyPounds',
      'tenPounds',
      'fivePounds',
      'pounds',
      'fiftyPence',
      'twentyPence',
      'tenPence',
      'fivePence',
      'zRead',
    ];
    const currentIndex = orderedInputs.indexOf(tillProperty);
    switch(ev.key) {
      case "ArrowDown":
        if (currentIndex < orderedInputs.length - 1) {
          this.tillRefs[tillIndex][orderedInputs[currentIndex+1]].current.focus();
        }
        break;
      case "ArrowUp":
        if (currentIndex > 0) {
          this.tillRefs[tillIndex][orderedInputs[currentIndex-1]].current.focus();
        }
        break;
      default:
        // do nothing
        break;
    }
  }
}

export const CashUpTills = connect<CashUpTillsStateProps, CashUpTillsDispatchProps, CashUpTillsOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CashUpTillsComponent);
