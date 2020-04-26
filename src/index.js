// import Quill from 'quill';
import {Markup, MarkupMode} from 'quill-markup';

let keybindings = {
    tab: {
        key: 9,
        handler: function(range) {
            this.quill.insertText(range.index, '    ');
            return false;
        }
    },
    'indent code-block': null,
    'outdent code-block': null,
    'code exit': null,
    'embed left': null,
    'embed right': null,
    'embed left shift': null,
    'embed right shift': null,
    'list autofill': null
};

Quill.register('modules/markup', Markup);

let quill = new Quill('#editor', {
    clipboard: true,
    modules: {
        history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
        },
        keyboard: {
            bindings: keybindings
        },
        markup: {
            followLinks: true,
            onChange: (text) => {
                // console.log(`Changing text: ${text}`);
            },
            onClick: (pos) => {
                console.log(`clicked pos: ${pos}`);
            },
            onClickLink: (link) => {
                console.log(`clicked link: ${link.text}`);
            }
        },
        syntax: {
            delay: 100
        },
        toolbar: null
    },
    theme: 'snow'
});

let markup = quill.getModule('markup');
markup.set({
    content: 'Hello World',
    custom: {
        background: 'black',
        foreground: 'white'
    },
    mode: MarkupMode.markdown
});