// const { ipcRenderer, remote } = require('electron');
const $ = require('jquery');
const fs = require('fs');
const { ipcRenderer } = require('electron');

let defaultDir = undefined;

function loadFiles(dir) {

    defaultDir = dir;

    const sidebarList = $("ul#file-list");

    fs.readdir(defaultDir, (err, files) => {    
        files.forEach( f => {
            const filename = f.replace(".md", '');
            sidebarList.append(`<li id="${generateFileId(filename)}" data-filename="${f}" class="file list-group-item" contenteditable="false"><a class="cm-file" href="#">${f}</a></li>`)
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
        
        ipcRenderer.invoke('select-file', file);
        load(`${defaultDir}/${file}`);
    });
}

function load(filepath) {

    console.log(">>>> filepath", filepath);

    fs.readFile(filepath, 'utf-8', (err, data) => {
        window.editor.setValue(data);
    });

    // console.log(">>>>>", remote.getGlobal('configuration'));
}

ipcRenderer.on('new-file', (event, filename) => {
    console.log("Event new-file>>", filename);
    const sidebarList = $("ul#file-list")
    sidebarList.prepend(`<li id="${generateFileId(filename)}" data-filename="${filename}" class="file list-group-item" contenteditable="false"><a class="cm-file" href="#">${filename}</a></li>`)
});

ipcRenderer.on('delete-file', (event, file) => {
    console.log("Event delete-file>>", file, " id=", generateFileId(file));

    const fileItem = $(`li#${generateFileId(file)}`);
    const nextItem = fileItem.next()
    
    console.log(nextItem);

    const nextFile = nextItem.attr('data-filename');

    console.log(fileItem);
    fileItem.remove();
    load(`${defaultDir}/${nextFile}`);
});

function generateFileId(filename) {
    if (typeof filename == 'undefined') return '';
    return filename.replace(/.md|.txt|\s+/ig, '');
}

module.exports = {
    loadFiles
}