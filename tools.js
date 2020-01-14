const resizeToViewport = target => {

  window.addEventListener(
    'resize', // use lodash and throttle this
    fitToViewBounds.bind(window, target)
  )

}

const fitToViewBounds = elem => {
  elem.width  = window.innerWidth;
  elem.height = window.innerHeight;
}

const createPlayButton = () => {

  const button = document.createElement('button');
  button.textContent = 'Play';
  button.dataset.playing = 'false';
  button.setAttribute('role', 'switch');

  return button;

}

const createAudioElement = trackName => {

  const track = document.createElement('audio');
  track.src = trackName;
  track.setAttribute('type', 'audio/mpeg');

  return track;

}

const addPlayEvents = (playElem, audioElement) => {

  if (playElem.nodeType !== Node.ELEMENT_NODE) return playElem;

  playElem.addEventListener('click', ev => {

    audioCTX.state === 'suspended' && audioCTX.resume();

    const isPlaying = ev.currentTarget.dataset.playing === 'true';

    audioElement[isPlaying ? 'pause' : 'play']();
    ev.currentTarget.textContent = isPlaying ? 'Play' : 'Pause';
    ev.currentTarget.dataset.playing = isPlaying ? 'false' : 'true';

  }, false);

  return playElem;

}

const handleEnded = (src) => (ref) => src.addEventListener('ended', () => {ref.dataset.playing = 'false'}, false);
