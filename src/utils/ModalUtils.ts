export function cleanupAfterClosedModal() {
    document.body.className = document.body.className.replace("ReactModal__Body--open", "");
}
