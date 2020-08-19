/**
 * Created by alexanderbol on 13/04/2017.
 */

import React from 'react';
import classes from './FileContentPopup.module.css';
import ModalPopup from "../../UI/ModalPopup/ModalPopup";

const FileContentPopup = (props) => {
    const row_lines = props.content.split('\n');
    return (
        <ModalPopup
            showPopup={props.showFileContentPopup}
            closePopup={props.closeFileContentPopup}
            header="Log File Content"
        >
            <div className={classes.FileContentPopup}>
                {
                    row_lines.map( line =>
                        <p>{line}</p>
                    )
                }
            </div>
        </ModalPopup>
    )
};

export default FileContentPopup;
