import * as THREE from 'three';
import KalmanFilter from 'kalmanjs';
// import Quaternion from 'quaternion';

const kf_x = new KalmanFilter({R: 0.01, Q: 20});
const kf_y = new KalmanFilter({R: 0.01, Q: 20});
const kf_z = new KalmanFilter({R: 0.01, Q: 20});

const show_alpha = document.getElementById('alpha');
const show_beta = document.getElementById('beta');
const show_gamma = document.getElementById('gamma');

const show_v_alpha = document.getElementById('v-alpha');
const show_v_beta = document.getElementById('v-beta');
const show_v_gamma = document.getElementById('v-gamma');

const show_x = document.getElementById('x');
const show_y = document.getElementById('y');
const show_z = document.getElementById('z');

const show_i = document.getElementById('i');
const show_j = document.getElementById('j');
const show_k = document.getElementById('k');

const show_vi = document.getElementById('vi');
const show_vj = document.getElementById('vj');
const show_vk = document.getElementById('vk');

const show_di = document.getElementById('di');
const show_dj = document.getElementById('dj');
const show_dk = document.getElementById('dk');

const show_moving = document.getElementById('moving');


const nBuffer = 300;
const prec = 100;//00;
let xAccArray = [];
let yAccArray = [];
let zAccArray = [];

let iAccArray = [];
let jAccArray = [];
let kAccArray = [];

let betaAccArray = [];
let gammaAccArray = [];
let alphaAccArray = [];

let viAccArray = [];
let vjAccArray = [];
let vkAccArray = [];

let diAccArray = [];
let djAccArray = [];
let dkAccArray = [];

let alpha;
let beta;
let gamma;

let onMove = false;

const accWorld = new THREE.Vector3(); 

const rounded = num => {
	return Math.round(num * prec) / prec
}

const avg = array => {
  	return array.reduce((a, b) => a + b) / array.length
}

const normalized = (val, array) => {
	if (array.length == nBuffer) {
		array.shift();
	}
	array.push(val);
	// return array.slice(-1)[0] - avg(array)
	return avg(array)
}


let dt = 0;
// let v = 0;
// let d = 0;
// let a = 0;

let v = new THREE.Vector3();
let d = new THREE.Vector3();

export function get_dj() {
	return d.y
}

export function get_vj() {
	return v.y
}

// let t0 = 0;
const devicemotionHandler = e => {
	const acc = e.accelerationIncludingGravity;
	const rotRate = e.rotationRate;
	// const xAcc = normalized(acc.x, xAccArray);
	// const yAcc = normalized(acc.y, yAccArray);
	// const zAcc = normalized(acc.z, zAccArray);
	accWorld.set(acc.x, acc.y, acc.z);

	const euler = new THREE.Euler(beta, gamma, alpha, 'ZXY');
	const q = new THREE.Quaternion().setFromEuler(euler).conjugate();
	const q_inv = q.invert();
	accWorld.applyQuaternion(q_inv);
	// accWorld.setX(kf_x.filter(accWorld.x));
	// accWorld.setY(kf_y.filter(accWorld.y));
	// accWorld.setZ(kf_z.filter(accWorld.z));

	const iAcc = normalized(kf_x.filter(accWorld.x), iAccArray);
	const jAcc = normalized(kf_y.filter(accWorld.y), jAccArray);
	const kAcc = normalized(kf_z.filter(accWorld.z), kAccArray);

	accWorld.setX(iAcc);
	accWorld.setY(jAcc);
	accWorld.setZ(kAcc);

	show_x.innerHTML = rounded(acc.x);
	show_y.innerHTML = rounded(acc.y);
	show_z.innerHTML = rounded(acc.z);

	show_i.innerHTML = rounded(accWorld.x);
	show_j.innerHTML = rounded(accWorld.y);
	show_k.innerHTML = rounded(accWorld.z);

	show_v_alpha.innerHTML = Math.round(rotRate.alpha);
	show_v_beta.innerHTML = Math.round(rotRate.beta);
	show_v_gamma.innerHTML = Math.round(rotRate.gamma);

	const rotRateTotal = Math.sqrt(rotRate.alpha**2 + rotRate.beta**2 + rotRate.gamma**2);

	if (rotRateTotal > 10) {
		onMove = true;
		show_moving.innerHTML = 'moving';
	} else {
		onMove = false;
		show_moving.innerHTML = '';
		accWorld.set(0, 0, 0);
		v.set(0, 0, 0);
	}

	dt = e.interval;
	// console.log(dt)
	// const now = new Date().getTime();
	// console.log((now - t0)/1000, dt);
	// t0 = now;

	// d += (v * dt) + (0.5 * a * (dt**2));
	// v += a * dt;

	d.add(v.clone().multiplyScalar(dt).add(accWorld.clone().multiplyScalar(0.5 * (dt**2))));
	// d = v.clone().multiplyScalar(dt).add(accWorld.clone().multiplyScalar(0.5 * (dt**2)));
	// v = accWorld.clone().multiplyScalar(dt);
	v.add(accWorld.clone().multiplyScalar(dt));

	// const vi = normalized(v.x, viAccArray);
	// const vj = normalized(v.y, vjAccArray);
	// const vk = normalized(v.z, vkAccArray);

	show_vi.innerHTML = rounded(v.x);
	show_vj.innerHTML = rounded(v.y);
	show_vk.innerHTML = rounded(v.z);

	show_di.innerHTML = rounded(d.x);
	show_dj.innerHTML = rounded(d.y);
	show_dk.innerHTML = rounded(d.z);
}

// const devicemotionHandler = e => {
// 	const acc = e.accelerationIncludingGravity;
// 	const xAcc = normalized(acc.x, xAccArray);
// 	const yAcc = normalized(acc.y, yAccArray);
// 	const zAcc = normalized(acc.z, zAccArray);
// 	accWorld.set(xAcc, yAcc, zAcc);

// 	const euler = new THREE.Euler(beta, gamma, alpha, 'ZXY');
// 	const q = new THREE.Quaternion().setFromEuler(euler).conjugate();
// 	const q_inv = q.invert();
// 	accWorld.applyQuaternion(q_inv);
// 	// accWorld.setX(kf_x.filter(accWorld.x));
// 	// accWorld.setY(kf_y.filter(accWorld.y));
// 	// accWorld.setZ(kf_z.filter(accWorld.z));

// 	show_x.innerHTML = rounded(xAcc);
// 	show_y.innerHTML = rounded(yAcc);
// 	show_z.innerHTML = rounded(zAcc);

// 	show_i.innerHTML = rounded(accWorld.x);
// 	show_j.innerHTML = rounded(accWorld.y);
// 	show_k.innerHTML = rounded(accWorld.z);

// 	dt = e.interval;

// 	// d += (v * dt) + (0.5 * a * (dt**2));
// 	// v += a * dt;

// 	d.add(v.clone().multiplyScalar(dt).add(accWorld.clone().multiplyScalar(0.5 * (dt**2))));
// 	v.add(accWorld.clone().multiplyScalar(dt));

// 	show_di.innerHTML = rounded(v.x);
// 	show_dj.innerHTML = rounded(v.y);
// 	show_dk.innerHTML = rounded(v.z);
// }

const deviceorientationHandler = e => {
	// const _alpha = normalized(e.alpha, alphaAccArray);
	// const _beta = normalized(e.beta, betaAccArray);
	// const _gamma = normalized(e.gamma, gammaAccArray);

	// alpha = _alpha * Math.PI / 180;
	// beta = _beta * Math.PI / 180;
	// gamma = _gamma * Math.PI / 180;

	alpha = e.alpha * Math.PI / 180;
	beta = e.beta * Math.PI / 180;
	gamma = e.gamma * Math.PI / 180;

	// show_alpha.innerHTML = rounded(_alpha);
	// show_beta.innerHTML = rounded(_beta);
	// show_gamma.innerHTML = rounded(_gamma);

	show_alpha.innerHTML = rounded(e.alpha);
	show_beta.innerHTML = rounded(e.beta);
	show_gamma.innerHTML = rounded(e.gamma);
}


let onDeviceMotion = false;
let onDeviceOrientation = false;

function toggleDeviceMotion() {
	onDeviceMotion = !onDeviceMotion;

	if (onDeviceMotion) {
		if (typeof DeviceMotionEvent.requestPermission === 'function') {
			// Handle iOS 13+ devices.
			DeviceMotionEvent.requestPermission()
			.then((state) => {
				if (state === 'granted') {
					window.addEventListener('devicemotion', devicemotionHandler);
				} else {
					console.error('Request to access the orientation was rejected');
				}
			})
			.catch(console.error);
		
		} else {
			// Handle regular non iOS 13+ devices.
			window.addEventListener('devicemotion', devicemotionHandler);
		}
	
	} else {
		window.removeEventListener('devicemotion', devicemotionHandler);
	}
}

function toggleDeviceOrientation() {
	onDeviceOrientation = !onDeviceOrientation;

	if (onDeviceOrientation) {
		if (typeof DeviceOrientationEvent.requestPermission === 'function') {
			// Handle iOS 13+ devices.
			DeviceOrientationEvent.requestPermission()
			.then((state) => {
				if (state === 'granted') {
					window.addEventListener('deviceorientation', deviceorientationHandler);
				} else {
					console.error('Request to access the orientation was rejected');
				}
			})
			.catch(console.error);
		
		} else {
			// Handle regular non iOS 13+ devices.
			window.addEventListener('deviceorientation', deviceorientationHandler);
		}
	
	} else {
		window.removeEventListener('deviceorientation', deviceorientationHandler);
	}
}

document.querySelector('#activateSensor').addEventListener('click', toggleDeviceMotion);
document.querySelector('#activateSensor').addEventListener('click', toggleDeviceOrientation);