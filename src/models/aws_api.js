// let awsRegion = "eu-central-1";
// let api_uri = "https://bah2tkltg6.execute-api.eu-central-1.amazonaws.com/test/list";
let api_uri = "https://vm7sirnd04.execute-api.us-east-1.amazonaws.com/test";

// Fetch keys list (filenames) from s3 bucket using given api
export const fetchKeysList = async() => {
    let response = await fetch(`${api_uri}/list`);
    let json = await response.json();
    let keysList = JSON.parse(json.body).keys;
    return keysList;
}

// Fetch content of files from s3 bucket by given list of keys
export const fetchFileContentByKeysList = async (keysList) => {
    let promises = keysList.map (key => fetch(`${api_uri}/list/${key}`))
    let respArray = await Promise.all(promises)
    let json_promises = respArray.map(resp => resp.json())
    let textArray = await Promise.all(json_promises);
    return textArray;
}

export const getPresignedURL = async (selectedFile) => {
    const url = `${api_uri}/get-presigned-url/${selectedFile.name}`
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

export const uploadFileToS3 = async (presignedURL, file) => {
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

export const deleteFilesFromS3 = async (keysToDelete) => {
    const url = `${api_uri}/delete`;
    let deletedKeys = [];
    try {
        let response = await fetch(url,{
            method:"DELETE",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify( {keys: keysToDelete})
        });
        let json = await response.json();
        console.log(json.keys);
        deletedKeys = json.keys;
    }
    catch (e) {
        alert("error delete files")
    }
    return deletedKeys;
}
