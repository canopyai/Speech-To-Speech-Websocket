export function getAudioIntonationString(results) {
    results.sort((a, b) => b.score - a.score);

    if (results[1].score > 0.2) {
        return `The user's tone of voice is mainly ${results[0].label} and is also ${results[1].label}.`;
    } else {
        return `The user's tone is probably ${results[0].label} only.`;
    }
}
