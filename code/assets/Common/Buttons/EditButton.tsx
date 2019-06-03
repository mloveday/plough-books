import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import omit from 'lodash/omit';
import * as React from "react";

interface EditButtonProps {
  mini: boolean;
  clickFn: () => void;
}

export class EditButton extends React.Component<EditButtonProps & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {}> {
  public render() {
    const props = omit(this.props, ['clickFn', 'mini']);
    return <button type="button" className={`submit-button edit${this.props.mini ? ' mini' : ''}`} onClick={this.props.clickFn} {...props}>
      <FontAwesomeIcon icon="edit" /> {this.props.children ? this.props.children : 'Edit'}
    </button>
  }
}