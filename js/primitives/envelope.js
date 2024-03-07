
// Wrap around the segments to create the road.

class Envelope {
	// Skeleton == segments i.e; inside of envelope.
	constructor(skeleton, width, roundness = 10) {
		this.skeleton = skeleton;
		this.poly = this.#generatePolygon(width, roundness);
	}

	#generatePolygon(width, roundness) {
		const {p1, p2} = this.skeleton;

		const radius = width / 2;
		const alphaAngle = angle(subtract(p1,p2));
		// Offset angle of 90 deg, for clock and anti-clockwise.
		const angleClockWise = alphaAngle + Math.PI / 2;
		// - for -90 deg.
		const angleCounterClockWise = alphaAngle - Math.PI / 2;

		// Collect points around p1, to make edges rounder.
		const points = [];
		// The step size determines the density of points along the circular arc. A smaller step results in more points, leading to smoother and more rounded corners for the polygon. Conversely, a larger step produces fewer points, resulting in sharper corners.
		const step = Math.PI / Math.max(1,roundness);
		// By adding epsilon to the loop condition, you introduce a small tolerance that accounts for these precision errors. The loop will terminate once the loop counter gets close enough to the desired ending point, even if it doesn't reach it exactly due to floating-point inaccuracies.
		const epsilon = step /2;

		for (let i = angleCounterClockWise; i <= angleClockWise + epsilon; i += step) {
			points.push(translate(p1, i, radius));
		}
		for (let i = angleCounterClockWise; i <= angleClockWise + epsilon; i += step) {
			points.push(translate(p2, Math.PI + i, radius));
		}

		return new Polygon(points);
	}
 
	draw(ctx, options) {
		this.poly.draw(ctx, options);
		// Colorful highlighting.
		//this.poly.drawSegments(ctx);
	}
}