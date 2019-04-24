import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";

interface SaveButtonProps {
  mini: boolean;
  clickFn: () => void;
}

export class SaveButton extends React.Component<SaveButtonProps & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {}> {
  public render() {
    return <button type="button" className={`submit-button save${this.props.mini ? ' mini' : ''}`} onClick={this.props.clickFn} {...this.props}>
      <FontAwesomeIcon icon="save" /> {this.props.children ? this.props.children : 'Save'}
    </button>
  }
}