
class Point {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	equals(point) {
		return this.x == point.x && this.y == point.y;
	}

	// Pass in object so that order doesn't matter.
	draw(ctx, {size = 18, color = "black", outline = false, fill = false} = {}) {
		// To draw it as a circle
		const radius = size / 2;
		
		//  This starts a new path for drawing on the canvas. It's like lifting a pen off the paper to start drawing in a new place.
		ctx.beginPath();
		ctx.fillStyle = color;
		// We want a full circle so 0 deg to 2 PI = 360 deg.
		ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
		ctx.fill();

		if (outline) {
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "yellow";
			// ctx.arc(x, y, radius, startAngle, endAngle)
			ctx.arc(this.x, this.y, radius * 0.6, 0, Math.PI * 2);
			ctx.stroke();
		}

		if (fill) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, radius * 0.4, 0, Math.PI * 2);
			ctx.fillStyle = "yellow";
			ctx.fill();
		}
	}
}