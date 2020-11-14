// not in use

export const readFile = (file) => {
    if (!(File && FileReader && FileList)) return;

    let reader = new FileReader();
    let string = ""
    reader.onload = (event) => {
        string = event.target.result;
        console.log(string);
    }
    reader.readAsText(file);
};

