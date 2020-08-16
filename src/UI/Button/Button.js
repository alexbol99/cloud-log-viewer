import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import classes from "./Button.module.css";

const button = (props) => {
    // eslint-disable-next-line
    // let buttonStyle = props.mobileOnly ? classes["Button","DrawerButton"] : classes["Button"];
    return (
        <button title={props.title} onClick={props.onClick} className={classes.Button}>
            <FontAwesomeIcon icon={faSyncAlt} size="2x" spin={props.spin} />
        </button>
    );
};

export default button;