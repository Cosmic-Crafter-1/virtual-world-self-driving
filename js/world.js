
class World {

	constructor(graph, 
		roadWidth = 100, 
		roadRoundness = 10,
		buildingWidth = 150,
		buildingMinLength = 150,
		spacing = 50
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
				guides.splice(i,  1);
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
			// Since it's inclusive of spacing also, so sub it.
			const buildingLength = len / buildingCount - this.spacing;
			
			const direction = seg.directionVector();

			let q1 = seg.p1;
			let q2 = add(q1, scale(direction, buildingLength));
			supports.push(new Segment(q1, q2));

			for (let i = 2; i <= buildingCount; i++) {
				q1 = add(q2, scale(direction, this.spacing));
				q2 = add(q1, scale(direction, buildingLength));
				supports.push(new Segment(q1, q2));
			}
			
		}

		return supports;
	}

	draw(ctx) {
		for (const env of this.envelopes) {
			env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15});
		}

		// Dashed lines.
		for (const seg of this.graph.segments) {
			seg.draw(ctx, { color: "gold", width: 4, dash: [10,10]})
		}
		for (const seg of this.roadBorders) {
			seg.draw(ctx, { color: "gold", width: 4});
		}
		for (const building of this.buildings) {
			building.draw(ctx);
		}
	}












}