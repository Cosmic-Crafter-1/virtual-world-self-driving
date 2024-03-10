

function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER) {
	let minDist = Number.MAX_SAFE_INTEGER;
	let nearest = null;
	for (const point of points) {
		const dist = distance(point, loc);
		if (dist < minDist && dist < threshold) {
			minDist = dist;
			nearest = point;
		}
	}
	return nearest;
}

function distance(p1, p2) {
	return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function add(p1, p2) {
	return new Point(p1.x + p2.x, p1.y + p2.y);
}

function average(p1,p2) {
	return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

function dot(p1, p2) {
	return p1.x * p2.x + p1.y * p2.y;
}

function subtract(p1, p2) {
	return new Point(p1.x - p2.x, p1.y - p2.y);
}

function scale(p, scaler) {
	return new Point(p.x * scaler, p.y * scaler);
}

function normalize(p) {
	return scale(p, 1 / magnitude(p));
}

// Distance to the origin.
function magnitude(p) {
	return Math.hypot(p.x, p.y);
}

function translate(loc, angle, offset) {
	return new Point(
		loc.x + Math.cos(angle) * offset,
		loc.y + Math.sin(angle) * offset
	);
}

function angle(p) {
	// Angle btw p1 and p2, arcTangent2.
	return Math.atan2(p.y, p.x);
}

function getIntersection(A, B, C, D) {
	/*
	If two line segments intersect, their respective x and y coordinates must be equal at that intersection point.

	If we have an intersection, it needs to satisfy these 2: 
	Ix = Ax+(Bx-Ax)t = Cx+(Dx-Cx)u
	Iy = Ay+(By-Ay)t = Cy+(Dy-Cy)u

	Ax+(Bx-Ax)t = Cx+(Dx-Cx)u  		/ sub Cx from both sides.
	(Ax-Cx)+(Bx-Ax)t = (Dx-Cx)u   -- 1

	Ay+(By-Ay)t = Cy+(Dy-Cy)u 		/ sub Cy from both sides.
	(Ay-Cy)+(By-Ay)t = (Dy-Cy)u    / *(Dx-Cx)
	(Dx-Cx)(Ay-Cy)+(Dx-Cx)(By-Ay)t = (Dx-Cx)(Dy-Cy)u / replace Dx-Cx by 1.
	(Dx-Cx)(Ay-Cy)+(Dx-Cx)(By-Ay)t = (Ax-Cx)+(Bx-Ax)t(Dy-Cy)u  / -(Dy-Cy)(Ax-Cx)
															   / -(Dx-Cx)(By-Ay)t
	(Dx-Cx)(Ay-Cy)-(Dy-Cy)(Ax-Cx) = (Dy-Cy)(Bx-Ax)-(Dx-Cx)(By-Ay)t

	top = (Dx-Cx)(Ay-Cy)-(Dy-Cy)(Ax-Cx)
	bottom = (Dy-Cy)(Bx-Ax)-(Dx-Cx)(By-Ay)

	By setting the equations of AB and CD equal to each other, we can solve for t, which represents the position of the intersection point along the line segment AB.

	t = top / bottom

	*/

	const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
	const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
	const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

	const epsilon = 0.001;
	if (Math.abs(bottom) > epsilon) {
		const t = tTop / bottom;
		const u = uTop / bottom;

		if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
			return {
				x: lerp(A.x, B.x, t),
				y: lerp(A.y, B.y, t),
				offset: t,
			};
		}
	}
	return null;
}

// Linear Interpolation = Between poles.
// 2 points and percentage.
function lerp(A, B, t) {
	return A + (B - A) * t;
}

function getRandomColor() {
	const hue = 290 + Math.random() * 260;
	return "hsl(" + hue + ", 100%, 60%)";
}