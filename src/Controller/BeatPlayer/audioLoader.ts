export function loadSample(url: string, audioContext: AudioContext) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => audioContext.decodeAudioData(buffer))
    .then((buffer) => {
      return buffer;
      //   const source = audioContext.createBufferSource();
      //   source.buffer = buffer;
      //   return source;
    });
}
