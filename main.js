// import javascriptLogo from './javascript.svg'

let v = 0;
let d = 0;

let cnt = 0;


let iBuffer = 0;
const nBuffer = 20;
const prec = 10000;
let xAcc = [];
let yAcc = [];
let zAcc = [];

const rounded = num => {
  return Math.round(num * prec) / prec
}

const avg = array => {
  return array.reduce((a, b) => a + b) / array.length
}

const normalized = array => {
  const _avg = avg(array);
  return array.slice(-1)[0] - _avg
}

const devicemotionHandler = e => {
  // const az = e.acceleration.z;
  // const dt = e.interval;

  // d = (v * dt) + (0.5 * az * (dt**2));
  // v += az * dt;

  const acc = e.acceleration;//IncludingGravity;
  xAcc.push(acc.x);
  yAcc.push(acc.y);
  zAcc.push(acc.z);
  iBuffer++;

  if (iBuffer > nBuffer) {
    xAcc.shift();
    yAcc.shift();
    zAcc.shift();
  }

  const xNorm = normalized(xAcc);
  const yNorm = normalized(yAcc);
  const zNorm = normalized(zAcc);
  console.log(rounded(xNorm), rounded(yNorm), rounded(zNorm))
}


export function onClick() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // Handle iOS 13+ devices.
    DeviceMotionEvent.requestPermission()
      .then((state) => {
        console.log(state)
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


document.querySelector('#activateSensor').addEventListener('click', onClick)