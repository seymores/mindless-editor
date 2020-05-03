
const editorDiv = document.getElementById("mindlessEditor") || document.body;
const editor = CodeMirror(editorDiv, {
    mode: "gfm-mindless",
    theme: "mindless",
    lineWrapping: true
});

function setupEditor(editor) {

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

setupEditor(editor);