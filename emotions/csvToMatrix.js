import fs from 'fs';
import {parse} from 'csv-parse';

// Function to read CSV file and convert it to a matrix
export function csvToMatrix(filePath, callback) {
    const results = [];

    // Create the parser
    const parser = parse({
        delimiter: ',',  // specify the delimiter if different
    });

    // Use the readable stream api to read the file
    fs.createReadStream(filePath)
        .pipe(parser)
        .on('data', (data) => {
            results.push(data);
        })
        .on('end', () => {
            callback(results);
        })
        .on('error', (error) => {
            console.error("Error reading CSV file:", error);
        });
}


