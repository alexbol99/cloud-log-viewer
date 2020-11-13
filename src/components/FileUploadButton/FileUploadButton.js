import React from "react";
import Files from "react-butterfiles";
// import readFiles from "../../models/readFile";
// import styles from "./FileUploadButton.module.css";
import Button from "../../UI/Button/Button"
import {getPresignedURL, uploadFileToS3} from "../../models/aws_api";

/**
 * Component renders a simple "Select file..." button which opens a file browser.
 * Once a valid file has been selected, the upload process will start.
 * @returns {*}
 * @constructor
 */
const FileUploadButton = (props) => (
    <Files
        onSuccess={async ([selectedFile]) => {
            // Step 1 - validate that files ok
            if (!(File && FileReader && FileList)) return;
            // let files = event.target.files; // FileList object

            let reader = new FileReader();
            let string = ""
            reader.onload = (event) => {
                string = event.target.result;
                console.log(string);
            }
            reader.readAsText(selectedFile.src.file);

            // Step 1 - get pre-signed POST data.
            const presignedURL = await getPresignedURL(selectedFile);
            // Step 2 - upload the file to S3.
            try {
                const { file } = selectedFile.src;
                const resp = await uploadFileToS3(presignedURL, file);
                console.log("File was successfully uploaded! " + resp);
                props.onUploadSucceed([selectedFile.name]);
            } catch (e) {
                console.log("An error occurred!", e.message);
            }
        }}
    >
        {({ browseFiles }) =>
            <Button
                title="Upload file to S3"
                text="Upload"
                onClick={browseFiles}>
            </Button>}
    </Files>
);

export default FileUploadButton;