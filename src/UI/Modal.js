import { useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({children}) => {
    const mount = document.getElementById("modal-root");
    const el = document.createElement("div");

    useEffect(() => {
        mount.appendChild(el);
        return () => mount.removeChild(el);
    }, [el, mount]);

    return createPortal(children, el)
};

export default Modal;
