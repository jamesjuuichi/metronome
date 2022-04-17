export function loadSample(url: string, audioContext: AudioContext) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => audioContext.decodeAudioData(buffer));
}
