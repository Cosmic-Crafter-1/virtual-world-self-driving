
class World {

	constructor(graph,
		roadWidth = 100,
		roadRoundness = 10,
		buildingWidth = 150,
		buildingMinLength = 150,
		spacing = 50,
		treeSize = 160
	) {
		this.graph = graph;
		this.roadWidth = roadWidth;
		this.roadRoundness = roadRoundness;
		this.buildingWidth = buildingWidth;
		this.buildingMinLength = buildingMinLength;
		this.spacing = spacing;

		this.envelopes = [];
		this.roadBorders = [];
		this.buildings = [];
		this.trees = [];
		this.treeSize = treeSize;


		this.generate();
	}

	// Generate envelopes around every segment.
	generate() {
		this.envelopes.length = 0;
		for (const seg of this.graph.segments) {
			this.envelopes.push(
				new Envelope(seg, this.roadWidth, this.roadRoundness)
			);
		}

		// Since intersections look over colored, we need to find union it.
		// This is for checking single break.
		// 	this.intersections = Polygon.break(
		// 		this.envelopes[0].poly,
		// 		this.envelopes[1].poly
		// 	);
		// }

		this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
		this.buildings = this.#generateBuildings();
		this.trees = this.#generateTrees();
	}

	#generateTrees() {

		// ... When used in function calls, it can be used to pass an array as individual arguments to a function.
		const points = [
			...this.roadBorders.map((s) => [s.p1, s.p2]).flat(),
			...this.buildings.map((b) => b.points).flat()
		];

		const left = Math.min(...points.map((p) => p.x));
		const right = Math.max(...points.map((p) => p.x));
		const top = Math.min(...points.map((p) => p.y));
		const bottom = Math.max(...points.map((p) => p.y));

		// To store places where trees are generated on buildings/roads i.e; polys.
		const illegalPolys = [
			...this.buildings,
			...this.envelopes.map((e) => e.poly)
		];

		const trees = [];
		let tryCount = 0;

		while (tryCount < 100) {
			// Randomly generating trees based on 4 sides.
			const p = new Point(
				lerp(left, right, Math.random()),
				lerp(bottom, top, Math.random())
			);

			let keep = true;

			for (const poly of illegalPolys) {
				// If trees are too close to buildings or polys.
				if (poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize / 2) {
					keep = false;
					break;
				}
			}

			// Don't keep trees too close to others or that are intersecting.
			if (keep) {
				for (const tree of trees) {
					if (distance(tree, p) < this.treeSize) {
						keep = false;
						break;
					}
				}
			}

			// Avoiding trees far off.
			if (keep) {
				let closeToSomething = false;
				for (const poly of illegalPolys) {
					if (poly.distanceToPoint(p) < this.treeSize * 2) {
						closeToSomething = true;
						break;
					}
				}
				keep = closeToSomething;
			}

			if (keep) {
				trees.push(p);
				tryCount = 0;
			}
			tryCount++;
		}
		return trees;
	}

	#generateBuildings() {
		// These envelopes define the space around the road where buildings can be placed.
		const tmpEnvelopes = [];
		for (const seg of this.graph.segments) {
			tmpEnvelopes.push(
				new Envelope(
					seg,
					this.roadWidth + this.buildingWidth + this.spacing * 2, // width
					this.roadRoundness
				)
			);
		}
		// The intersecting envelopes' remaining segments.
		const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));

		for (let i = 0; i < guides.length; i++) {
			const seg = guides[i];
			if (seg.length() < this.buildingMinLength) {
				guides.splice(i, 1);
				// Since we removed the segment/guide, the length of array shortens.
				// Therefore to keep index sane, and not skip, we subtract i.
				i--;
			}
		}

		const supports = [];
		for (let seg of guides) {
			// Length available = segment + it's spacing.s
			const len = seg.length() + this.spacing;
			// Number of buildings that can be generated.
			const buildingCount = Math.floor(
				len / (this.buildingMinLength + this.spacing)
			);
			// Since it's inclusive of spacing also, so subtract it.
			const buildingLength = len / buildingCount - this.spacing;

			// Two points, q1 and q2, are initialized. q1 represents the start point of the segment, which is initially set to seg.p1. q2 represents the end point of the segment and is calculated by adding the scaled direction vector to q1. This ensures that q2 is buildingLength units away from q1 in the direction of direction.

			const direction = seg.directionVector();

			// Start and end points.
			let q1 = seg.p1;
			let q2 = add(q1, scale(direction, buildingLength));
			supports.push(new Segment(q1, q2));

			for (let i = 2; i <= buildingCount; i++) {
				q1 = add(q2, scale(direction, this.spacing));
				q2 = add(q1, scale(direction, buildingLength));
				supports.push(new Segment(q1, q2));
			}

		}

		const bases = [];
		for (const seg of supports) {
			bases.push(new Envelope(seg, this.buildingWidth).poly);
		}

		const epsilon = 0.001;
		for (let i = 0; i < bases.length - 1; i++) {
			for (let j = i + 1; j < bases.length; j++) {
				if (
					bases[i].intersectsPoly(bases[j]) ||
					bases[i].distanceToPoly(bases[j]) < this.spacing - epsilon)  {
					bases.splice(j, 1);
					j--;
				}
			}
		}

		return bases;
	}

	draw(ctx) {
		for (const env of this.envelopes) {
			env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
		}
		// Dashed lines.
		for (const seg of this.graph.segments) {
			seg.draw(ctx, { color: "gold", width: 4, dash: [10, 10] })
		}
		for (const seg of this.roadBorders) {
			seg.draw(ctx, { color: "gold", width: 4 });
		}
		for (const tree of this.trees) {
			// Color is transparent black.
			tree.draw(ctx, { size: this.treeSize, color: "rgba(0,0,0,0.5" });
		}
		for (const building of this.buildings) {
			building.draw(ctx);
		}
	}












}