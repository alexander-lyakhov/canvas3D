const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const BACKGROUND = '#004040';
const FOREGROUND = '#00cc00';
const SIZE = 20;
const FPS = 60;

// console.log([canvas.width, canvas.height])

let scale = 1;

const vs = [
	
	{ x: -0.5, y:  0.5, z: 0.5 },
	{ x: -0.5, y: -0.5, z: 0.5 },
	{ x:  0.5, y: -0.5, z: 0.5 },	
	{ x:  0.5, y:  0.5, z: 0.5 },
	
	{ x: -0.5, y:  0.5, z: -0.5 },
	{ x: -0.5, y: -0.5, z: -0.5 },
	{ x:  0.5, y: -0.5, z: -0.5 },
	{ x:  0.5, y:  0.5, z: -0.5 },
	
];

const fs = [
	[0, 1, 2, 3],
	[4, 5, 6, 7],
	[0, 4],
	[1, 5],
	[2, 6],
	[3, 7],
];

function clear() {
	ctx.fillStyle = BACKGROUND;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPoint({ x, y }) {
	// console.log(x, y)

	ctx.fillStyle = FOREGROUND;
	ctx.fillRect(
		x - SIZE * scale / 2,
		y - SIZE * scale / 2,
		SIZE * scale,
		SIZE * scale,
	);

	// console.log(SIZE * scale)
}

function pointToScreen({x, y}) {
	return {
		x: (x + 1) / 2 * canvas.width,
		y: ((1 - y) / 2) * canvas.height,
	}
}

function project({x, y, z}) {
	scale = 1 / z;

	return {
		x: x / z,
		y: y / z,
	}
}

function translate_z({ x, y, z }, dz) {
	return {
		x,
		y,
		z: z + dz
	}
}

// =============================================================================
// @@@ [ M ] rotate_xz
// =============================================================================
function rotate_xz({ x, y, z }, angle) {
	const s = Math.sin(angle);
	const c = Math.cos(angle);

	return {
		x: x * c - z * s,
		y,
		z: x * s + z * c,
	}
}

// =============================================================================
// @@@ [ M ] rotate_xy
// =============================================================================
function rotate_xy({ x, y, z }, angle) {
	const s = Math.sin(angle);
	const c = Math.cos(angle);

	return {
		x: x * c - y * s,
		y: x * s + y * c,
		z,
	}
}

// =============================================================================
// @@@ [ M ] rotate_yz
// =============================================================================
function rotate_yz({ x, y, z }, angle) {
	const s = Math.sin(angle);
	const c = Math.cos(angle);

	return {
		x,
		y: y * s + z * c,
		z: y * c - z * s,
	}
}

function line(p1, p2) {
	ctx.strokeStyle = FOREGROUND;
	ctx.lineWidth = 3;

	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.stroke();
}

let dz = 2;
let angle = 0;
const dt = 1 / FPS;

function frame() {
	clear();

	// dz += dt;
	angle += dt;
	/*
	for (let v of vs) {
		// v = rotate_xy(v, angle);
		v = rotate_xz(v, angle);
		// v = rotate_yz(v, angle);

		drawPoint(pointToScreen(project(translate_z(v, dz))));
	}
	*/
	for (let f of fs) {
		for (let i = 0; i < f.length; i++) {
			let u = rotate_xz(vs[f[i]], angle);
			let v = rotate_xz(vs[f[(i + 1) % f.length]], angle);

			// if (Math.abs(u.z <= 0.5) && Math.abs(u.x >= 0.5))
			{
				line(
					pointToScreen(project(translate_z(u, dz))),
					pointToScreen(project(translate_z(v, dz))),
				);
			}
		}
	}
}

// drawPoint(pointToScreen(project(translate_z(vs[0], 0))));
setInterval(frame, 1000 / FPS);