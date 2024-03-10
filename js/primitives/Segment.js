
class Segment {

	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}

	length() {
		return distance(this.p1,this.p2);
	}

	directionVector() {
		// Normalize means without signs, since it's just a direction.
		return normalize(subtract(this.p2, this.p1));
	}

	equals(seg) {
		return this.includes(seg.p1) && this.includes(seg.p2);
	}

	// 2 segments are same if they include same points
	// So a helper method.
	includes(point) {
		return this.p1.equals(point) || this.p2.equals(point);
	}

	// How thick the lines should be = 2
	// Sets default values for the width, color, and dash properties of an object passed as an argument to the draw function. If no argument is provided or if it's undefined, an empty object is used as the default value to prevent errors.

	draw(ctx, {width = 2, color = "black", dash =[] } = {}) {
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		// Built in function.
		ctx.setLineDash(dash);
		// Moves the pen to the starting point of the line.
		ctx.moveTo(this.p1.x, this.p1.y);
		// Draws a line from the current pen position to the ending point.
		ctx.lineTo(this.p2.x, this.p2.y);
		// Actually draws the line on the canvas.
		// Before stroke() is called, moveTo() and lineTo() define an invisible path, like planning out a route on a map, and stroke() is what actually makes that path visible by drawing it on the canvas.
		ctx.stroke();
		// Use empty array[] to reset the dash to a solid line.
		ctx.setLineDash([]);
	}
}