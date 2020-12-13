// const { ipcRenderer, remote } = require('electron');
const $ = require('jquery');
const fs = require('fs').promises;
const { ipcRenderer } = require('electron');

let defaultDir = undefined;
let selectedFile = undefined;


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
        
        // ipcRenderer.invoke('select-file', file);
        load(file);
    });
}

function load(file) {
    selectedFile = file;

    const filepath = `${defaultDir}/${file}`;

    console.log(">>>> filepath", filepath);

    fs.readFile(filepath, 'utf-8', (err, data) => {
        console.log(filepath, "Err=", err);
        console.log(">>>", data);

        window.editor.setValue(data);
    });

    ipcRenderer.invoke('select-file', file);
}

async function saveContent(file, content) {
    try {
        const filepath = `${defaultDir}/${file}`;
        await fs.writeFile(filepath, content);
        ipcRenderer.invoke('saved-file', file);
    } catch (err) {
        console.warn("Error saving file: ", err);
    }
}

async function saveCurrentContent(content) {
    saveContent(selectedFile, content);
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
    load(nextFile);
});

function generateFileId(filename) {
    if (typeof filename == 'undefined') return '';
    return filename.replace(/.md|.txt|\s+/ig, '');
}

module.exports = {
    loadFiles,
    saveContent,
    saveCurrentContent
}
