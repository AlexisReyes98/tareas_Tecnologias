/*========================= CAPTURE MOUSE EVENTS ========================= */

function Events_Handler() { };

Events_Handler.prototype.mouseDown = function (e) {
    drag = true;
    old_x = e.pageX, old_y = e.pageY;
    e.preventDefault();
    return false;
};

Events_Handler.prototype.mouseUp = function (e) {
    drag = false;
};

Events_Handler.prototype.mouseMove = function (e) {
    if (!drag) {
        return false;
    }
    dX = (e.pageX - old_x) * 2 * Math.PI / CANVAS.width,
        dY = (e.pageY - old_y) * 2 * Math.PI / CANVAS.height;
    THETA += dX;
    PHI += dY;
    old_x = e.pageX, old_y = e.pageY;
    e.preventDefault();
};

Events_Handler.prototype.init = function (canvas) {
    canvas.addEventListener("mousedown", this.mouseDown, false);
    canvas.addEventListener("mouseup", this.mouseUp, false);
    canvas.addEventListener("mouseout", this.mouseUp, false);
    canvas.addEventListener("mousemove", this.mouseMove, false);
}
