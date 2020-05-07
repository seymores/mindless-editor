// load md files from disk

const $ = require('jquery')
const fs = require('fs')

const defaultDir = '/Users/ping/Google Drive/Notes';

// load from directory
// 
// fs.opendirSync()


function loadFiles() {
    const sidebarList = $("ul#file-list")
    fs.readdir(defaultDir, (err, files) => {    
        files.forEach( f => {
            sidebarList.append(`<li class="file list-group-item"><a class="cm-file" href="#">${f}</a></li>`)
            console.log(">", f);
        });
    });

    $("ul#file-list").on("click", ".cm-file", (e) => {
        const file = $(e.target).text();
        console.log(">>>", file);
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