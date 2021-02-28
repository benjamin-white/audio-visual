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

  const button           = document.createElement('button');
  button.textContent     = 'Play';
  button.dataset.playing = 'false';
  button.setAttribute('role', 'switch');

  return button;

}

const secondsToMinutes = timeInSeconds =>
  [Math.min(timeInSeconds, 3599) / 60, Math.min(timeInSeconds, 3599) % 60]
    .map(Math.floor)
    .map(num => num.toString().padStart(2, '0'))
    .join(':');

const createAudioReadout = audioLength => {

  const rootElem    = document.createElement('div');
  const currentTime = document.createElement('span');
  const totalTime   = document.createElement('span');
  
  rootElem.classList.add('TrackInfo');
  currentTime.textContent = '00:00';
  totalTime.textContent   = audioLength;
  
  rootElem.appendChild(currentTime);
  rootElem.innerHTML += ' / ';
  rootElem.appendChild(totalTime);

  return rootElem;

}

const createAudioElement = trackName => {

  const track = document.createElement('audio');
  track.src   = trackName;
  track.setAttribute('type', 'audio/mpeg');

  return track;

}

const createTrack = () => {

  const track          = document.createElement('section');
  const trackInner     = document.createElement('div');
  track.className      = 'Track';
  trackInner.className = 'Track-inner';
  trackInner.setAttribute('style', '--track-current:0%');
  track.setAttribute('aria-hidden', 'true'); // TODO: an accessible version of this
  track.appendChild(trackInner);

  return track;

}

const addPlayEvents = (playElem, audioElement) => {

  if (playElem.nodeType !== Node.ELEMENT_NODE) return playElem;

  playElem.addEventListener('click', ev => {

    audioCTX.state === 'suspended' && audioCTX.resume();

    const isPlaying = ev.currentTarget.dataset.playing === 'true';

    audioElement[isPlaying ? 'pause' : 'play']();
    ev.currentTarget.textContent     = isPlaying ? 'Play' : 'Pause';
    ev.currentTarget.dataset.playing = isPlaying ? 'false' : 'true';

  }, false);

  return playElem;

}

const handleEnded = (src) => (ref) => src.addEventListener('ended', () => {ref.dataset.playing = 'false'}, false);
