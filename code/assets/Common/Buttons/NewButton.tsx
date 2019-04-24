import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";

interface NewButtonProps {
  mini: boolean;
  clickFn: () => void;
}

export class NewButton extends React.Component<NewButtonProps & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {}> {
  public render() {
    return <button type="button" className={`submit-button new${this.props.mini ? ' mini' : ''}`} onClick={this.props.clickFn} {...this.props}>
      <FontAwesomeIcon icon="plus-circle" /> {this.props.children ? this.props.children : 'New'}
    </button>
  }
}