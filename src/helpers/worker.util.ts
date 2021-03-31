export function functionToWorkerURL(fn: Function): string {
    var blob = new Blob(['(' + fn.toString() + ')()'], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}