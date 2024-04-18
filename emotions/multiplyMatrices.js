export function multiplyMatrices(matrixA, matrixB) {
    // console.log(matrixA)
    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const rowsB = matrixB.length;
    const colsB = matrixB[0].length;

    // Check if multiplication is possible
    if (colsA !== rowsB) {
        throw new Error('Columns of matrix A must match rows of matrix B');
    }

    // Initialize the result matrix with zeros
    let result = new Array(rowsA).fill(0).map(() => new Array(colsB).fill(0));

    // Perform matrix multiplication
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }

    return result;
}

