import React from "react";
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from "./SearchInputComponent.module.css";

const SearchInputComponent = (props) => {
    return (
        <div className={styles.SearchInputComponent}>
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" name="searchJobName" placeholder="job name" onChange={props.onChange} />
        </div>
    )
}

export default SearchInputComponent;