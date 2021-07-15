import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from "./Button.module.css";

const button = (props) => {
    return (
        <button title={props.title} onClick={props.onClick} className={classes.Button}>
            {props.icon ?
            <FontAwesomeIcon icon={props.icon} size="1x" spin={props.spin}  /> :
                null}
            {props.text}
        </button>
    );
};

export default button;