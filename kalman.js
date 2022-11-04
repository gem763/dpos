import gaussian from 'gaussian';
import * as THREE from 'three';
import { glMatrix, mat2 } from 'gl-matrix';
glMatrix.setMatrixArrayType(Array);

const X = [];
const Z = [];
const t = [];
const dt = 1;
const nSamples = 100;

let k = 0;
const getObservation = () => {
    k++;
    // k += 2;
    let w_dist = gaussian(0, 1);
    return k + 10*w_dist.ppf(Math.random()) 
}

let F = mat2.create(); 
mat2.set(F, 1, dt, 0, 1); //console.log(F) 

let H = mat2.create();
mat2.set(H, 1, 0, 0, 0); console.log(H)

// let F = 1;
// let H = 0.5;
// let Q = 0;
// let R = 1;
// let x = 1;
// let P = 1;
// let xp;
// let Pp;
// let K;

// const estimateState = (z) => {
//     xp = F * x;
//     Pp = F * P * F + Q;
//     K = Pp * H / (H * Pp * H + R);
//     x = xp + K * (z - H * xp);
//     P = Pp - K * H * Pp;
//     return x
// }


// for (let i = 0; i < nSamples; i++) {
//     t.push(i);
//     const z = getObservation();
//     const x = estimateState(z);
//     X.push(x);
//     Z.push(z);
// }

const data = {
    labels: t,
    datasets: [
    {
        label: '추정',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: X,
    },
    {
        label: '관측',
        backgroundColor: 'silver',
        borderColor: 'silver',
        data: Z,
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {}
};

const myChart = new Chart(
    document.getElementById('myChart'),
    config
);