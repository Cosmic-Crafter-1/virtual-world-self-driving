
class Point {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	draw(ctx, size = 18, color = "black") {
		// To draw it as a circle
		const radius = size/2;
		
		//  This starts a new path for drawing on the canvas. It's like lifting a pen off the paper to start drawing in a new place.
		ctx.beginPath();
		ctx.fillStyle = color;
		// We want a full circle so 0 deg to 2 PI = 360 deg.
		ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
		ctx.fill();
	}
}