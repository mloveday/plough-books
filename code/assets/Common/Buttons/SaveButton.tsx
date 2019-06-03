import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import omit from 'lodash/omit';
import * as React from "react";

interface SaveButtonProps {
  mini: boolean;
  clickFn: () => void;
}

export class SaveButton extends React.Component<SaveButtonProps & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {}> {
  public render() {
    const props = omit(this.props, ['clickFn', 'mini']);
    return <button type="button" className={`submit-button save${this.props.mini ? ' mini' : ''}`} onClick={this.props.clickFn} {...props}>
      <FontAwesomeIcon icon="save" /> {this.props.children ? this.props.children : 'Save'}
    </button>
  }
}