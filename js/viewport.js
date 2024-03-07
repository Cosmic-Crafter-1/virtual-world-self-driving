
class Viewport {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		this.zoom = 1;
		// To zoom in from center. This defines center of viewport.
		this.center = new Point(canvas.width / 2, canvas.height / 2);
		// Defined in utils. Generates a new point multiplying the above with -1.
		this.offset = scale(this.center, -1);
		// Object notation.
		this.drag = {
			start: new Point(0, 0),
			end: new Point(0, 0),
			offset: new Point(0, 0),
			active: false
		};

		this.#addEventListeners();
	}

	reset() {
		this.ctx.restore();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.save();
		this.ctx.translate(this.center.x, this.center.y);
		// Scale along X and Y axes.
		this.ctx.scale(1 / this.zoom, 1 / this.zoom);
		// First get the center offset.
		const offset = this.getOffset();
		// Move the origin point of the canvas's coordinate system to a new position specified by the given horizontal (x) and vertical (y) offset.
		this.ctx.translate(offset.x, offset.y);
	}

	getMouse(evt, subtractDragOffset = false) {
		const p = new Point(
			// Calculate horizontal distance from canvas center to mouse cursor
			// Suppose the mouse cursor is at (evt.offsetX, evt.offsetY), and the center of your canvas content is at (this.center.x, this.center.y).
			// Subtracting the x-coordinate of the canvas center from the x-coordinate of the mouse cursor gives you how far the cursor is from the center horizontally.
			(evt.offsetX - this.center.x) * this.zoom - this.offset.x,
			(evt.offsetY - this.center.y) * this.zoom - this.offset.y
		);
		return subtractDragOffset ? subtract(p, this.drag.offset) : p;
	}

	// To make the scrolling smoother, we add this cumulative in real-time.
	getOffset() {
		return add(this.offset, this.drag.offset);
	}

	#addEventListeners() {
		this.canvas.addEventListener("mousewheel", this.#handleMouseWheel.bind(this));
		this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
		this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
		this.canvas.addEventListener("mouseup", this.#handleMouseUp.bind(this));

	}

	#handleMouseDown(evt) {
		// Check if it's the mid btn or not.
		if (evt.button == 1) {
			// Mouse start
			this.drag.start = this.getMouse(evt);
			this.drag.active = true;
		}
	}

	#handleMouseMove(evt) {
		if (this.drag.active) {
			// Mouse end.
			this.drag.end = this.getMouse(evt);
			// Distance btw start and end = offset.
			this.drag.offset = subtract(this.drag.end, this.drag.start);
		}
	}

	#handleMouseUp(evt) {
		if (this.drag.active) {
			// Add drag offset to existing offset.
			this.offset = add(this.offset, this.drag.offset);
			// Reset drag location.
			this.drag = {
				start: new Point(0, 0),
				end: new Point(0, 0),
				offset: new Point(0, 0),
				active: false
			};

		}
	}

	#handleMouseWheel(evt) {
		// Determine the direction of mouse wheel scroll
		// If scrolling up, deltaY is negative, so direction becomes -1
		// If scrolling down, deltaY is positive, so direction becomes 1
		const direction = Math.sign(evt.deltaY);

		// How much we want zoom to change.
		const step = 0.1;

		// Adjust the zoom level based on the scroll direction
		// If scrolling up, decrease zoom level by 1
		// If scrolling down, increase zoom level by 1
		this.zoom += direction * step;

		// Max cap the zoom.
		this.zoom = Math.max(1, Math.min(7, this.zoom));

	}

}