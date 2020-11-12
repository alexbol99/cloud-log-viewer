import React from "react";
import Files from "react-butterfiles";
// import readFiles from "../../models/readFile";
import styles from "./FileUploadButton.module.css";

async function getPresignedURL(selectedFile) {
    const url = "https://vm7sirnd04.execute-api.us-east-1.amazonaws.com/test/get-presigned-url/" +
    selectedFile.name;

    let presignedURL = null;
    try {
        let response = await fetch(url);
        let json = await response.json();
        presignedURL = json.url;
    }
    catch (err) {
        console.log(err.message)
    }
    return presignedURL;
};

async function uploadFileToS3(presignedURL, file) {
    let json = null;
    try {
        let response = await fetch(presignedURL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: file
        });
        json = await response.json();
    }
    catch (err) {
        console.log(err.message)
    }

    return json;
};

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

            // readFiles([selectedFile]);

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
            <button
                className={styles.FileUploadButtonButton}
                onClick={browseFiles}>Upload
            </button>}
    </Files>
);

export default FileUploadButton;