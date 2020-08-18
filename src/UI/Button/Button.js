import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from "./Button.module.css";

const button = (props) => {
    return (
        <button title={props.title} onClick={props.onClick} className={classes.Button}>
            <FontAwesomeIcon icon={props.icon} size="2x" spin={props.spin}  />
        </button>
    );
};

export default button;