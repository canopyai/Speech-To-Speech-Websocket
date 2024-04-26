import fs from "fs"

export function loadJsonAudio() {
    const data = fs.readFileSync('data.json', { encoding: 'utf8' });
    const json = JSON.parse(data);
    return json.audioData
}