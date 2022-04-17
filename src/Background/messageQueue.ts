const MESSAGES = [
  'It is a metronome! :)',
  'The slider on the top left controls BPM.',
  'The slider on the top right controls number of beats,',
  'Vertial sliders controls the pitch and the loudness of each beat.',
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
