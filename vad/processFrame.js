export const int16ToFloat32 = (inputArray) => {
    const buffer = Buffer.from(inputArray);
    var output = new Float32Array(inputArray.length / 2);
    for (var i = 0; i < inputArray.length; i += 2) {
        const sample = buffer.readInt16LE(i);
        const floatSample = sample / 32768.0;
        output[i / 2] = floatSample;
    }
    return output;
}