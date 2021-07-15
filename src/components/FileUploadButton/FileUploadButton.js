import Files from "react-butterfiles";
// import readFiles from "../../models/readFile";
// import styles from "./FileUploadButton.module.css";
import Button from "../../UI/Button/Button"
import {uploadFileToS3} from "../../models/aws_api";

/**
 * Component renders a simple "Select file..." button which opens a file browser.
 * Once a valid file has been selected, the upload process will start.
 * @returns {*}
 * @constructor
 */
const FileUploadButton = (props) => {
    const uploadFiles = async (selectedFiles) => {
        let promises = selectedFiles.map( selectedFile => uploadFileToS3(selectedFile) );
        let selectedFileNames = selectedFiles.map( selectedFile => selectedFile.name );

        try {
            let respArray = await Promise.all(promises);
            // let json_promises = respArray.map(resp => resp.json())
            // json = await Promise.all(json_promises);
            props.onUploadSucceed(selectedFileNames);
            return respArray;
        }
        catch (err) {
            console.log(err);
            return err.message;
        }
    }

    return  (
        <Files
            multiple={true}
            multipleMaxCount={300}
            onSuccess={selectedFiles => uploadFiles(selectedFiles)}
        >
            {({ browseFiles }) =>
                <Button
                    title="Upload log files"
                    text="Upload"
                    onClick={browseFiles}>
                </Button>}
        </Files>
    );
}

export default FileUploadButton;