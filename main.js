import * as THREE from 'three';
import KalmanFilter from 'kalmanjs';
import { Euler } from 'three';
// var Quaternion = require('quaternion');
import Quaternion from 'quaternion';


let _alpha = 90 * Math.PI / 180;
let _beta = 0 * Math.PI / 180;
let _gamma = 0 * Math.PI / 180;


let q = Quaternion.fromEuler(_alpha, _beta, _gamma, 'ZXY');
console.log(q);//.conjugate().toMatrix4())


let _q = new THREE.Quaternion().setFromEuler(new THREE.Euler(_beta, _gamma, _alpha, 'XYZ'))
console.log(_q)

// const kf = new KalmanFilter({R: 1, Q: 3}); 

// let v = 0;
// let d = 0;

// let cnt = 0;

const show_alpha = document.getElementById('alpha');
const show_beta = document.getElementById('beta');
const show_gamma = document.getElementById('gamma');

const show_x = document.getElementById('x');
const show_y = document.getElementById('y');
const show_z = document.getElementById('z');

const show_right = document.getElementById('right');
const show_up = document.getElementById('up');
const show_back = document.getElementById('back');


const nBuffer = 30;
const prec = 10000;
let xAccArray = [];
let yAccArray = [];
let zAccArray = [];

let alpha;
let beta;
let gamma;

const accVector = new THREE.Vector3(); 

// X축 30도 돌리기(beta)
// accVector.set(0, -4.9, -4.9*Math.sqrt(3));
// accVector.applyEuler(new THREE.Euler(-(90-30) * Math.PI / 180, 0, 0, 'XYZ'));
// console.log(accVector)

// Y축 30도 돌리기(gamma)
// accVector.set(4.9, 0, -4.9*Math.sqrt(3));
// accVector.applyEuler(new THREE.Euler(0, 30 * Math.PI / 180, 0, 'XYZ'));
// console.log(accVector)

// Y축 -30도 돌리기(gamma)
// accVector.set(-4.9, 0, -4.9*Math.sqrt(3));
// accVector.applyEuler(new THREE.Euler(0, -30 * Math.PI / 180, 0, 'XYZ'));
// console.log(accVector)

// Z축 30도 돌리기(alpha)
// accVector.set(-4.9, -4.9*Math.sqrt(3), 0);
// accVector.applyEuler(new THREE.Euler(0, 0, 30 * Math.PI / 180, 'XYZ'));
// console.log(accVector)

// Z축 330도(=-30도) 돌리기(alpha)
// accVector.set(4.9, -4.9*Math.sqrt(3), 0);
// accVector.applyEuler(new THREE.Euler(0, 0, 330 * Math.PI / 180, 'XYZ'));
// console.log(accVector)

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

const devicemotionHandler = e => {
  // if (Math.abs(90-beta) < 5) {
  //   return
  // }

  // if ((gamma < -85) || (85 < gamma) ||
  //     (beta < -175) || (175 < beta)) {
  //   return
  // }
	// const az = e.acceleration.z;
	// const dt = e.interval;

	// d = (v * dt) + (0.5 * az * (dt**2));
	// v += az * dt;

	// console.log(alpha, beta, gamma)

	const acc = e.accelerationIncludingGravity;
	const xAcc = normalized(acc.x, xAccArray);
	const yAcc = normalized(acc.y, yAccArray);
	const zAcc = normalized(acc.z, zAccArray);
	// console.log(rounded(xNorm), rounded(yNorm), rounded(zNorm));
	// console.log(rounded(xAcc), rounded(yAcc), rounded(zAcc));
	accVector.set(xAcc, yAcc, zAcc);
	accVector.applyEuler(new THREE.Euler(beta, gamma, alpha, 'ZXY'));
	// accVector.applyEuler(new THREE.Euler(-alpha, -beta, -gamma, 'ZXY'));
	// console.log(accVector)
	// console.log(acc.z, kf.filter(acc.z))
	show_x.innerHTML = Math.round(xAcc);
	show_y.innerHTML = Math.round(yAcc);
	show_z.innerHTML = Math.round(zAcc);

	show_right.innerHTML = Math.round(accVector.x);
	show_up.innerHTML = Math.round(accVector.y);
	show_back.innerHTML = Math.round(accVector.z);
}

const deviceorientationHandler = e => {
	alpha = e.alpha * Math.PI / 180;
	// beta = -(90 - (e.beta > 0 ? e.beta : e.beta + 180)) * Math.PI / 180;
	// gamma = (e.gamma > 0 ? e.gamma : e.gamma + 90) * Math.PI / 180;
  beta = -(90 - e.beta) * Math.PI / 180;
	gamma = e.gamma * Math.PI / 180;
	show_alpha.innerHTML = Math.round(e.alpha);
	show_beta.innerHTML = Math.round(e.beta);
	show_gamma.innerHTML = Math.round(e.gamma);
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


// if (window.DeviceOrientationEvent) {
//   window.addEventListener("deviceorientation", (event) => {
//     const rotateDegrees = event.alpha; // alpha: rotation around z-axis
//     const leftToRight = event.gamma; // gamma: left to right
//     const frontToBack = event.beta; // beta: front back motion

//     handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
//   }, true);
// }

// const handleOrientationEvent = (frontToBack, leftToRight, rotateDegrees) => {
//  console.log(frontToBack, leftToRight, rotateDegrees)
// };


document.querySelector('#activateSensor').addEventListener('click', toggleDeviceMotion);
document.querySelector('#activateSensor').addEventListener('click', toggleDeviceOrientation);