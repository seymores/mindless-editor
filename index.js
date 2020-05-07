const $ = require('jquery')
const { shell } = require('electron')
const {loadFiles} = require('./files')


// editor.on("mousedown", (instance, event) => {
        
//     const target = $(event.target)
//     console.log(target);

//     switch(event.target.className) {
//         case 'cm-tag': console.log(">>> tag=", event.target.textContent)
//         break;
//         case 'cm-link': console.log(">>> link=", event.target.textContent)
//         break;
//         case 'cm-url': console.log(">>> url=", event.target.textContent)
//         break;
//         case 'cm-page': console.log(">>> page=", event.target.textContent)
//         break;
//         default: // do nothing
//     }
// });

function setupEditor() {
    const editorDiv = document.getElementById("codemirror-editor"); // || document.getElementById("mindlessEditor") || document.body;
    const editor = CodeMirror(editorDiv, {
        mode: "gfm-mindless",
        theme: "mindless",
        lineWrapping: true
    });

    editor.onkeyup = () => {
        localStorage.setItem("content", editor.textContent);
    };

    const previousContent = localStorage.getItem("content");
    editor.on("blur", () => {
        // console.log("text changed?", editor.getValue());
        const savedLength = previousContent ? previousContent.length : 0;
        if (savedLength != editor.getValue().length) {
            localStorage.setItem("content", editor.getValue());
        }
    });

    if (previousContent) {
        editor.setValue(previousContent);
    };

    return editor;
}

function setupMindlessEventHandler() {
    $(".CodeMirror").on("click", ".cm-link", (e) => {
        const url = $(e.target).next('.cm-url').text().replace(/[\(\)]+/g, '') || $(e.target).text().replace(/[\(\)]+/g, '');
        shell.openExternal(url);  
    });
    
    $(".CodeMirror").on("click", ".cm-url", (e) => {
        const url = $(e.target).text().replace(/[\(\)]+/g, '');
        shell.openExternal(url);  
    });
    
    $(".CodeMirror").on("click", ".cm-page", (e) => {
        const page = $(e.target).text().replace(/[\[|\]]+/g, '')
        console.log(">>>", page);
        search(page);
    });
    
    $(".CodeMirror").on("click", ".cm-tag", (e) => {
        const tag = $(e.target).text();
        console.log(">>>", tag);
        search(tag);
    });    
}

function setTheme(name, editor) {

    if (typeof name == 'undefined') return;

    let editorCurrentTheme = localStorage.getItem("editorTheme") || undefined;
    const currentLinkTheme = document.getElementById(editorCurrentTheme);
    if (currentLinkTheme) currentLinkTheme.parentNode.removeChild(currentLinkTheme);
    editorCurrentTheme = `theme-${name}`;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    // link.type = "text/stylesheet";
    link.href = `theme/${name}.css`;
    link.id = editorCurrentTheme;

    link.onload = () => {
        editor.setOption("theme", name);
        console.log("XXXX");
    }

    document.head.appendChild(link);

    link.onerror = (err) => {
        console.log("Error loading theme: ", err);
    }

    localStorage.setItem("editorTheme", name);
}

function search(search) {
    const searchInput = document.getElementById("searchinput")
    searchInput.value = search;
}

function loadSidebarContent() {
    loadFiles()
}

// function setMode(name, editor) {

//     if (typeof name == 'undefined') return;

//     let editorCurrentMode = localStorage.getItem("editorMode") || undefined;

//     const currentScriptMode = document.getElementById(editorCurrentMode);
//     if (currentScriptMode) currentScriptMode.parentNode.removeChild(currentScriptMode);

//     editorCurrentMode = `mode-${name}`;

//     const src = document.createElement("script");
//     src.type = "text/javascript";
//     src.src = `mode/${name}/${name}.js`;
//     src.id = editorCurrentMode;
//     document.body.appendChild(src);

//     src.onload = () => {
//         editor.setOption("mode", name);
//     };

//     src.onerror = function (err) {
//         console.log("Error loading language mode: ", err);
//     }

//     localStorage.setItem("editorMode", name);
// }

const editor = window.editor = setupEditor();
setupMindlessEventHandler();
loadSidebarContent();