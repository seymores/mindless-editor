
$(".CodeMirror").on("click", ".cm-link", (e) => {
    const url = $(e.target).next('.cm-url').text().replace(/[\(\)]+/g, '') || $(e.target).text().replace(/[\(\)]+/g, '');
    window.open(url, "_blank");
});

$(".CodeMirror").on("click", ".cm-url", (e) => {
    const url = $(e.target).text().replace(/[\(\)]+/g, '');
    // window.open(url, "_blank");  
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

function search(search) {
    const searchInput = document.getElementById("searchinput")
    searchInput.value = search;
}