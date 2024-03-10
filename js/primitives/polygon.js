
class Polygon {
	constructor(points) {
		this.points = points;
		this.segments = [];
		for (let i = 1; i <= points.length; i++) {
			this.segments.push(
				// When it reaches points.length, i % points.length, will make sure that it returns 0 [length/length] and connect back to starting point.
				new Segment(points[i - 1], points[i % points.length])
			);
		}
	}

	// Interesting part, find union to remove segments present inside other polygons.
	static union(polys) {
		Polygon.multiBreak(polys);
		const keptSegments = [];
		// Loop through all of polygons.
		for (let i = 0; i < polys.length; i++) {
			// Loop through all segments of a given polygon.
			for (const seg of polys[i].segments) {
				let keep = true;
				for (let j = 0; j < polys.length; j++) {
					// Loop through all polys to see if segment is inside polygon.
					// Check if a segment is inside it's own polygon.
					if (i != j) {
						if (polys[j].containsSegment(seg)) {
							keep = false;
							break;
						}
					}
				}
				if (keep) {
					keptSegments.push(seg);
				}
			}
		}
		return keptSegments;
	}

	static multiBreak(polys) {
		for (let i = 0; i < polys.length - 1; i++) {
			for (let j = i + 1; j < polys.length; j++) {
				Polygon.break(polys[i], polys[j]);
			}
		}
	}

	static break(poly1, poly2) {
		const segs1 = poly1.segments;
		const segs2 = poly2.segments;
		// Uncomment the intersections ones to see what happens.
		//const intersections = [];
		for (let i = 0; i < segs1.length; i++) {
			for (let j = 0; j < segs2.length; j++) {
				const intersection = getIntersection(
					segs1[i].p1, segs1[i].p2, segs2[j].p1, segs2[j].p2
				);

				//  If an intersection point is found (intersection is not null), and it's not at the start or end of either segment, exactly at tip.
				if (intersection && intersection.offset != 1 && intersection.offset != 0) {
					const point = new Point(intersection.x, intersection.y);
					// intersections.push(point);

					//         C
					//         |
					// If A----*---------B  * is the intersection.
					//         |
					//         D

					// We need to break down A---* and *-------B separately. Then break A-----* and start new Segment form *-------B, so that the intersection is removed.
					let aux = segs1[i].p2;
					// Replace p2 of seg 1 with a point, i.e; end point becomes start.
					segs1[i].p2 = point;
					segs1.splice(i + 1, 0, new Segment(point, aux));

					aux = segs2[j].p2;
					// Replace p2 of seg 2 with a point, i.e; end point becomes start.
					segs2[j].p2 = point;
					segs2.splice(j + 1, 0, new Segment(point, aux));
				}
			}
		}
		// return intersections;
	}

	distanceToPoint(point) {
		return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
	}

	distanceToPoly(poly) {
		return Math.min(...this.points.map((p) => poly.distanceToPoint(p)));
	}

	intersectsPoly(poly) {
		for (let s1 of this.segments) {
			for (let s2 of poly.segments) {
				if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
					return true;
				}
			}
		}
		return false;
	}

	containsSegment(seg) {
		const midpoint = average(seg.p1, seg.p2);
		return this.containsPoint(midpoint);
	}

	// If it's still inside polygon, then there's only 1 intersection, if it went out, then there'd be 2, one coming in, and the other going out.
	containsPoint(point) {
		const outerPoint = new Point(-1000, -1000);
		let intersectionCount = 0;
		for (const seg of this.segments) {
			const intersection = getIntersection(outerPoint, point, seg.p1, seg.p2);
			if (intersection) {
				intersectionCount++;
			}
		}
		// If even, then there's no point, but if it's 1, then point is still inside.
		// Refer 2:44:37 diagram of the video.
		return intersectionCount % 2 == 1;
	}

	drawSegments(ctx) {
		for (const seg of this.segments) {
			seg.draw(ctx, { color: getRandomColor(), width: 5 });
		}
	}

	draw(ctx, { stroke = "blue", lineWidth = 2, fill = "rgba(0,0,255,0.3)" } = {}) {
		// Begin drawing a new shape
		ctx.beginPath();
		// Set fill and stroke styles
		ctx.fillStyle = fill;
		ctx.strokeStyle = stroke;
		ctx.lineWidth = lineWidth;

		// Move the drawing cursor to the first point
		ctx.moveTo(this.points[0].x, this.points[0].y);

		// Connect each point with lines
		for (let i = 1; i < this.points.length; i++) {
			// Draw a line to the next point
			ctx.lineTo(this.points[i].x, this.points[i].y);
		}

		// Close the shape by connecting the last point to the first point
		ctx.closePath();

		// Fill the shape with the specified color
		ctx.fill();
		// Draw the outline of the shape with the specified color and line width
		ctx.stroke();
	}


}