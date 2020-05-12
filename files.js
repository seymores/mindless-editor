// load md files from disk

const { ipcRenderer } = require('electron');
const $ = require('jquery');
const fs = require('fs');

// const defaultDir = require('electron').remote.DEFAULT_DIR;

let defaultDir = '/Users/ping/Google Drive/Notes';

function getNotesDirectory() {
    ipcRenderer.invoke('get-notes-directory', null).then(dirPath => {
        defaultDir = dirPath;
    });
}

function loadFiles() {
    const sidebarList = $("ul#file-list")
    fs.readdir(defaultDir, (err, files) => {    
        files.forEach( f => {
            sidebarList.append(`<li class="file list-group-item" contenteditable="false"><a class="cm-file" href="#">${f}</a></li>`)
            console.log(">", f);
        });
    });

    $("ul#file-list").on("click", ".cm-file", (e) => {
        const fileItem = $(e.target);
        const file = fileItem.text();
        // console.log(">>>", file);        

        fileItem.dblclick( e => {
            fileItem.prop("contentEditable", true);
            console.log("toEditFile", file);
        });

        fileItem.blur( e => {
            fileItem.prop("contentEditable", false);
            // TODO: Save file name
            console.log("renameFile:", file);
        });

        load(file);
    });
}

function load(file) {
    const filepath = `${defaultDir}/${file}`
    fs.readFile(filepath, 'utf-8', (err, data) => {
        console.log(data);
        window.editor.setValue(data);
    });
    
}

ipcRenderer.on('new-file', (event, arg) => {
    console.log("Event new-file");
});

module.exports = {
    loadFiles,
    getNotesDirectory
}