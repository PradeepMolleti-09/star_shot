// faceEngine/matchFaces.js

export function euclideanDistance(a, b) {
    if (!a || !b || a.length !== b.length) return Infinity;

    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        const diff = a[i] - b[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum);
}

export function matchFace(fanDescriptor, faceDescriptor) {
    return euclideanDistance(fanDescriptor, faceDescriptor);
}
