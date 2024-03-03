
class Graph {
	constructor(points = [], segments = []) {
		this.points = points;
		this.segments = segments;
	}

	addPoint(point) {
		this.points.push(point);
	}

	containsPoint(point) {
		// Find method loops over all points and returns True/False.
		// We need to implement the equals method.
		return this.points.find((p) => p.equals(point));
	}

	tryAddPoint(point) {
		if (!this.containsPoint(point)) {
			this.addPoint(point);
			return true;
		}
		return false;
	}

	draw(ctx) {

		for (const seg of this.segments) {
			seg.draw(ctx);
		}

		for (const point of this.points) {
			point.draw(ctx);
		}		
	}
}