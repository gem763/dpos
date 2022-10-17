import * as THREE from 'three';
import KalmanFilter from 'kalmanjs';
const kf = new KalmanFilter({R: 1, Q: 3}); //console.log(kf)
// import javascriptLogo from './javascript.svg'
// console.log(process)
// let v = 0;
// let d = 0;

// let cnt = 0;


const nBuffer = 30;
const prec = 10000;
let xAccArray = [];
let yAccArray = [];
let zAccArray = [];

let alpha;
let beta;
let gamma;

const accVector = new THREE.Vector3(); console.log(accVector)

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
	accVector.applyEuler(new THREE.Euler(beta, gamma, alpha, 'XYZ'));
	console.log(accVector)
	// console.log(acc.z, kf.filter(acc.z))
}

const deviceorientationHandler = e => {
	alpha = -e.alpha * Math.PI / 180;
	beta = -(e.beta - 90) * Math.PI / 180;
	gamma = -e.gamma * Math.PI / 180;
	console.log(rounded(e.alpha), rounded(e.beta), rounded(e.gamma));
	// process.stdout.write(1234);
	// console.log(process)
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


// document.querySelector('#activateSensor').addEventListener('click', toggleDeviceMotion);
document.querySelector('#activateSensor').addEventListener('click', toggleDeviceOrientation);