const MESSAGES = [
  'It is a metronome! :)',
  'One of the two horizontal sliders controls BPM.',
  'One horizontal slider controls number of beat.',
  'Vertial sliders controls the pitch and the loudness of each beat.',
  'The dot under the beat slider indicates current playing beat.',
  'If you change BPM / number of beat on the fly, next measure gets the effect.',
];

export function createMessageQueue() {
  const messages: string[] = MESSAGES.slice();

  function shuffleMessageQueue() {
    for (let i = messages.length - 1; i > 0; --i) {
      swap(messages, i, randomIntegerSmallerThan(i + 1));
    }
  }

  let nextMessageToSee = 0;
  function nextMessage() {
    if (nextMessageToSee === messages.length) {
      shuffleMessageQueue();
      nextMessageToSee = 0;
    }
    return messages[nextMessageToSee++];
  }

  return {
    nextMessage,
  };
}

function randomIntegerSmallerThan(x: number) {
  return Math.floor(Math.random() * x);
}

function swap<T>(array: T[], i: number, j: number) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}
