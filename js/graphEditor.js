
class GraphEditor {

	constructor(viewport, graph) {
		this.viewport = viewport;
		this.canvas = viewport.canvas;
		this.graph = graph;

		this.ctx = this.canvas.getContext("2d");

		this.selected = null;
		this.hovered = null;
		this.dragging = false;
		this.mouse = null;
		// # indicates that it's private method.
		this.#addEventListeners();
	}

	#addEventListeners() {

		// Event to generate a point on click.
		// We bind this, because it was referring to canvas before and now it binds to this/GraphEditor.
		// When attaching event listeners to DOM elements, such as buttons or canvases, it's crucial to ensure that 'this' inside the event handler functions refers to the instance of the corresponding class, rather than the DOM element itself. Without proper binding using 'bind(this)', 'this' inside the event handlers would default to referring to the DOM element, leading to confusion and incorrect access to properties and methods of the class instance. For example, in the Button class, 'this' should refer to the Button instance, not the HTML button element, to correctly handle button clicks. Similarly, in the GraphEditor class, 'this' should refer to the instance of GraphEditor, not the HTML canvas element, to correctly handle mouse events and interact with the graph data. Binding 'this' using 'bind(this)' ensures that 'this' inside the event handlers correctly refers to the class instance, enabling seamless interaction between the DOM elements and the JavaScript code.

		this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));

		// Event to generate hover effect of nearest point.
		this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));

		// When I right clicked the menu of inspect and others come up, so prevent it.
		this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
		this.canvas.addEventListener("mouseup", () => this.dragging = false);

	}

	#handleMouseMove(evt) {
		this.mouse = this.viewport.getMouse(evt);
		this.hovered = getNearestPoint(this.mouse, this.graph.points, 12 * this.viewport.zoom);
		// Mouse moving helps to drag and sets up the loc of final mouse up.
		if (this.dragging == true) {
			this.selected.x = this.mouse.x;
			this.selected.y = this.mouse.y;
		}
	}


	#handleMouseDown(evt) {
		// right click
		// When we right clicked on a point, it should first deselect and then delete, but it deleted without deselecting.
		// Therefore, change the priorities.
		// if (evt.button == 2) {
		// 	if (this.hovered) {
		// 		// this function is present below.
		// 		this.#removePoint(this.hovered);
		// 	}
		// 	If we aren't hovering over any point, then deselect the prev element.
		// 	By this we see that right click is used for:
		// 	1. Removing points along with their segments.
		// 	2. Deselecting prev element, so that it's easier to connect whichever 2 points we needed to without creating the extra seg onclick
		// 	else {
		// 		this.selected = null;
		// 	}
		//}

		// right click
		if (evt.button == 2) {
			if (this.selected) {
				this.selected = null;
			} else if (this.hovered) {
				// this method is present below.
				this.#removePoint(this.hovered);
			}
		}

		// left click
		if (evt.button == 0) {
			if (this.hovered) {
				// To add segments btw already existing points.
				this.#select(this.hovered);
				// If I'm hovering over a point, it should auto enable dragging.
				this.dragging = true;
				return;
			}
			this.graph.addPoint(this.mouse);
			// Adding segments to new points, if not already selected.
			this.#select(this.mouse);
			// This is so that when I create a point, it should also mean that I'm automatically hovering over it. Easy for deletion on spot if I create a point by mistake and want to delete it then and there.
			this.hovered = this.mouse;
		}
	}

	// To add segments btw already existing points.
	#select(point) {
		if (this.selected) {
			this.graph.tryAddSegment(new Segment(this.selected, point));
		}
		this.selected = point;
	}

	#removePoint(point) {
		this.graph.removePoint(point);
		this.hovered = null;
		// When right clicked, a selected point auto gets deselected and we don't want that. We want user to retain already selected point highlighted.
		if (this.selected == point) {
			this.selected = null;
		}
	}

	display() {
		this.graph.draw(this.ctx);
		if (this.hovered) {
			this.hovered.draw(this.ctx, { fill: true });
		}
		if (this.selected) {
			// If there is a hovered object, set 'intent' to it; otherwise, set 'intent' to the current mouse position.
			// This creates a "snap" feeling when near to a point.
			const intent = this.hovered ? this.hovered : this.mouse;
			// This shows the intent of selecting a point and wherever the mouse heads, we see a demo segment, meaning it would create a segment.
			// dash [3,3] = 3 lines and 3 spaces simultaneously.
			new Segment(this.selected, intent).draw(ctx, { dash: [3, 3] });
			this.selected.draw(this.ctx, { outline: true });
		}
	}

}