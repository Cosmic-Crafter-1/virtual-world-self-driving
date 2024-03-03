
class GraphEditor {

	constructor(canvas, graph) {
		this.canvas = canvas;
		this.graph = graph;

		this.ctx = this.canvas.getContext("2d");

		this.selected = null;
		this.hovered = null;
		this.dragging = false;
		// # indicates that it's private method.
		this.#addEventListeners();
	}

	#addEventListeners() {

		// Event to generate a point on click.
		this.canvas.addEventListener("mousedown", (evt) => {
			// right click
			if (evt.button == 2) {
				if (this.hovered) {
					// this function is present below.
					this.#removePoint(this.hovered);
				}
			}
			// left click
			if (evt.button == 0) {
				const mouse = new Point(evt.offsetX, evt.offsetY);
				if (this.hovered) {
					this.selected = this.hovered;
					// If I'm hovering over a point, it should auto enable dragging.
					this.dragging = true;
					return;
				}
				this.graph.addPoint(mouse);
				this.selected = mouse;
				// This is so that when I create a point, it should also mean that I'm automatically hovering over it. Easy for deletion on spot if I create a point by mistake and want to delete it then and there.
				this.hovered = mouse;

			}
		});

		// Event to generate hover effect of nearest point.
		this.canvas.addEventListener("mousemove", (evt) => {
			const mouse = new Point(evt.offsetX, evt.offsetY);
			this.hovered = getNearestPoint(mouse, this.graph.points, 12);
			// Mouse moving helps to drag and sets up the loc of final mouse up.
			if (this.dragging == true) {
				this.selected.x = mouse.x;
				this.selected.y = mouse.y;
			}
		});

		// When I right clicked the menu of inspect and others come up, so prevent it.
		this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
		this.canvas.addEventListener("mouseup", () => this.dragging = false);

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
			this.selected.draw(this.ctx, { outline: true });
		}
	}

}