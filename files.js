// load md files from disk

const $ = require('jquery')
const fs = require('fs')

const defaultDir = '/Users/ping/Google Drive/Notes';

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
        });

        fileItem.blur( e => {
            fileItem.prop("contentEditable", false);
            // TODO: Save file name
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

module.exports = {
    loadFiles
}