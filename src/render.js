// $$ Initialize: Variables and Constants
import { ipcRenderer } from 'electron';
theme = require('electron').nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
root = document.children[0];
box = document.getElementById("kw");
modKeys = {};
mkCharset = {
    win: "⊞",
    cmd: "⌘",
    Control: "⌃",
    Alt: "⌥",
    Shift: "⇧",
    esc: "⎋",
    del: "⌫",
    Meta: "◆"
}

// $$ Initialize: Function
root.classList.add(theme);
ipcRenderer.on('drag', function () {
    let dragging = false;
    let mouseX = 0;
    let mouseY = 0;
    box.addEventListener('mousedown', (e) => {
        dragging = true;
        const { pageX, pageY } = e;
        mouseX = pageX;
        mouseY = pageY;
        window.addEventListener('mouseup', () => {
            dragging = false;
            window.removeEventListener('mouseup');
            window.removeEventListener('mousemove');
        });
        window.addEventListener('mousemove', (e) => {
            if (dragging) {
                const { pageX, pageY } = e;
                const win = require('electron').remote.getCurrentWindow();
                const pos = win.getPosition();
                pos[0] = pos[0] + pageX - mouseX;
                pos[1] = pos[1] + pageY - mouseY;
                win.setPosition(pos[0], pos[1], true);
            }
        });
    });

})

// $$ Main: Events
// $$$ Event: Input box update
kw.oninput = () => {

}

// $$$ Event: Non-character input processing
function ncProcesser(e) {
    // Modifier keys state update
    // if: Modifier keys pressed when it's not composing
    // Supported Keys: Control/Ctrl, Command/Win/Meta, Option/Alt, Shift
    if ((!e.isComposing) && (e.key in ['Control', 'Meta', 'Alt', 'Shift']))
        ipcRenderer.sendSync('platform', (e, a) => {
            // Keyword Replacement
            if (a = "win32") i = e.key.replace('Control', 'Ctrl').replace('Meta', 'Win');
            else if (a = "darwin") i = e.key.replace('Alt', 'Option').replace('Meta', 'Command');
            else i = e.key;
            modKeys[i] = (e.type == "keydown");
            syntaxUpdate();// Unfinished
        })
}
// Key down and key up event will be processed by ncProcesser
document.onkeydown = document.onkeyup = ncProcesser
// TODO: Syntax parsing, highlighting and Modifier keys visualization
// See the document for details of the function.
syntaxUpdate = () => {

}
