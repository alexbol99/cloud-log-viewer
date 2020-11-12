// Closure to capture file information and parameters
const readAsText = (reader, file) => {

    let promise = new Promise( (resolve, reject) => {
        reader.onload = (function(theFile, resolve, reject) {
            return (event) => {
                let string = event.target.result;

                resolve(true);
            }
        })(file, resolve, reject);

        reader.readAsText(file);
    });

    return promise
};

const readFile = (file) => {
    if (file.type !== "") return;   // file has no extension

    let reader = new FileReader();

    let p;
    try {
        p = readAsText(reader, file);
    }
    catch (err) {
        return Promise.reject("not supported file");
    }
};

export const readFiles = (files) => {
    return () => {

        // Load and parse files
        // in MS Edge FilesList is not array. It is indexable but not iterable
        // for (let i=0; i < action.files.length; i++) {
        //     readFile(action.files[i], stage, layers, dispatch, action.files);
        // }
        let promises = [];
        // Array.from(files)
        for (let file of files) {
            let promise = readFile(file);
            promises.push(promise);
        }

        return Promise.all(promises)
            // .then( (values) => {
            //     console.log(values)
            // })
            //
            // .catch(error => {
            //     alert(error.message);
            // })
    }
};

export default readFiles;

