
class World {
	constructor(graph, roadWidth = 100, roadRoundness = 10) {
		this.graph = graph;
		this.roadWidth = roadWidth;
		this.roadRoundness = roadRoundness;

		this.envelopes = [];
		this.roadBorders = [];

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
	}

	draw(ctx) {
		for (const env of this.envelopes) {
			env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15});
		}

		// Dashed lines.
		for (const seg of this.graph.segments) {
			seg.draw(ctx, { color: "white", width: 4, dash: [10,10]})
		}
		for (const seg of this.roadBorders) {
			seg.draw(ctx, { color: "white", width: 4});
		}
	}












}