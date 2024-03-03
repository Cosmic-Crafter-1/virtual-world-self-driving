
class Segment {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}

	// How thick the lines should be = 2
	draw(ctx, width = 2, color = "black") {
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		// Moves the pen to the starting point of the line.
		ctx.moveTo(this.p1.x, this.p1.y);
		// Draws a line from the current pen position to the ending point.
		ctx.lineTo(this.p2.x, this.p2.y);
		// Actually draws the line on the canvas.
		// Before stroke() is called, moveTo() and lineTo() define an invisible path, like planning out a route on a map, and stroke() is what actually makes that path visible by drawing it on the canvas.
		ctx.stroke();
	}
}