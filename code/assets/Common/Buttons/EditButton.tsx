import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";

interface EditButtonProps {
  mini: boolean;
  clickFn: () => void;
}

export class EditButton extends React.Component<EditButtonProps & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {}> {
  public render() {
    return <button type="button" className={`submit-button edit${this.props.mini ? ' mini' : ''}`} onClick={this.props.clickFn} {...this.props}>
      <FontAwesomeIcon icon="edit" /> {this.props.children ? this.props.children : 'Edit'}
    </button>
  }
}