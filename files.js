// const { ipcRenderer, remote } = require('electron');
const $ = require('jquery');
const fs = require('fs');


function loadFiles(defaultDir) {

    const sidebarList = $("ul#file-list");

    fs.readdir(defaultDir, (err, files) => {    
        files.forEach( f => {
            sidebarList.append(`<li class="file list-group-item" contenteditable="false"><a class="cm-file" href="#">${f}</a></li>`)
        });
    });

    $("ul#file-list").on("click", ".cm-file", (e) => {
        const fileItem = $(e.target);
        const file = fileItem.text();

        fileItem.dblclick( e => {
            fileItem.prop("contentEditable", true);
            console.log("toEditFile", file);
        });

        fileItem.blur( e => {
            fileItem.prop("contentEditable", false);
            // TODO: Save file name
            console.log("renameFile:", file);
        });

        load(`${defaultDir}/${file}`);
    });
}

function load(filepath) {
    fs.readFile(filepath, 'utf-8', (err, data) => {
        window.editor.setValue(data);
    });

    // console.log(">>>>>", remote.getGlobal('configuration'));
}

ipcRenderer.on('new-file', (event, filename) => {
    console.log("Event new-file>>", filename);
    const sidebarList = $("ul#file-list")
    sidebarList.prepend(`<li class="file list-group-item" contenteditable="false"><a class="cm-file" href="#">${filename}</a></li>`)
});

module.exports = {
    loadFiles
}