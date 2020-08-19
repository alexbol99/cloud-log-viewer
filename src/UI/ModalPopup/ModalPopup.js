import React, { useEffect } from "react";
import Modal from "../Modal";
import classes from "./ModalPopup.module.css";

let offsetX;
let offsetY;
let dragX;
let dragY;

const ModalPopup = (props) => {

    const onBackDropClicked = (ev) => {
        if (ev.target.id === "backDrop") {
            props.closePopup();
        }
    };

    const handleKeyDown = (ev) => {
        if (ev.code === "Escape") {
            props.closePopup();
        }
    };

    const elementDrag = (ev) => {
        ev = ev || window.event;
        // calculate the new cursor position:
        offsetX = dragX - ev.clientX;
        offsetY = dragY - ev.clientY;
        dragX = ev.clientX;
        dragY = ev.clientY;
        // set the element's new position:
        let element = ev.target;
        element.style.top = (element.offsetTop - offsetY) + "px";
        element.style.left = (element.offsetLeft - offsetX) + "px";
    };

    const closeDragElement = (ev) => {
        /* stop moving when mouse button is released:*/
        ev.target.onmouseup = null;
        ev.target.onmousemove = null;
    };

    const dragMouseDown = (ev) => {
        ev = ev || window.event;
        // get the mouse cursor position at startup:
        dragX = ev.clientX;
        dragY = ev.clientY;
        ev.target.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        ev.target.onmousemove = elementDrag;
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    } );

    return props.showPopup ? (
        <Modal>
            <div
                id="backDrop"
                className={classes.BackDrop}
                onClick={onBackDropClicked}
            >
                <div className={classes.ModalPopup}
                     onMouseDown={dragMouseDown}
                >
                    <header>{props.header}</header>
                    {props.children}
                </div>
            </div>
        </Modal>
    ) : null;
};

export default ModalPopup;
