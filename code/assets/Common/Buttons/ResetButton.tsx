import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";

interface ResetButtonProps {
  mini: boolean;
  clickFn: () => void;
}

export class ResetButton extends React.Component<ResetButtonProps & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {}> {
  public render() {
    return <button type="button" className={`submit-button reset${this.props.mini ? ' mini' : ''}`} onClick={this.props.clickFn} {...this.props}>
      <FontAwesomeIcon icon="history" /> {this.props.children ? this.props.children : 'Reset'}
    </button>
  }
}