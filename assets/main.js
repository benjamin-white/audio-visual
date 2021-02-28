const FFTSIZE       = 1024;
const bufferLength  = FFTSIZE / 2;
const dataArray     = new Uint8Array(bufferLength);
const bodyElement   = document.querySelector('body');
const playButton    = createPlayButton();
const audioElement  = createAudioElement('assets/boxcutter-moon_pupils.mp3');
const audioCTX      = new AudioContext();
const audioInput    = audioCTX.createMediaElementSource(audioElement);
const audioAnalyser = audioCTX.createAnalyser();
const canvas        = document.createElement('canvas');
const canvasCTX     = canvas.getContext("2d");
const track         = createTrack();
const trackInner    = track.querySelector('.Track-inner');

canvas.height = window.innerHeight;
canvas.width  = window.innerWidth;

audioAnalyser.fftSize = FFTSIZE;
audioAnalyser.smoothingTimeConstant = 0.9;
audioInput.connect(audioAnalyser);
audioAnalyser.connect(audioCTX.destination);

handleEnded(audioElement)(playButton);
resizeToViewport(canvas);

addPlayEvents(playButton, audioElement);

const infoBar = document.createElement('section');
infoBar.classList.add('InfoBar');
infoBar.appendChild(playButton);

bodyElement.appendChild(canvas);
bodyElement.appendChild(audioElement);
bodyElement.appendChild(infoBar);
bodyElement.appendChild(track);

const updateCurrentTime = () => {
  const currentTimeElem = infoBar.querySelector('.TrackInfo span:first-child');
  currentTimeElem && audioElement.addEventListener(
    'timeupdate',
    event => (currentTimeElem.textContent = secondsToMinutes(audioElement.currentTime))
  );
}

audioElement.addEventListener(
  'timeupdate',
  event => trackInner.setAttribute(
    'style', `--track-current:${audioElement.currentTime / audioElement.duration * 100}%`
  )
);

trackInner.addEventListener(
  'click',
  event => (audioElement.currentTime = audioElement.duration * (event.offsetX / event.currentTarget.offsetWidth))
);

audioElement.addEventListener(
  'loadedmetadata',
  event => {
    infoBar.appendChild(createAudioReadout(secondsToMinutes(audioElement.duration)));
    updateCurrentTime();
  }
);

const themeColors = [
  '243, 75, 10',
  '0, 255, 255',
  '12, 234, 96'
];

let themeAccent = themeColors[0];

document.addEventListener(
  'keyup',
  event => {
    const keyAsIndex = Number(event.key);
    if (isNaN(keyAsIndex) || keyAsIndex < 1 || keyAsIndex > 3) return; 
    document.querySelector(':root').style.setProperty('--accent-primary', themeColors[keyAsIndex - 1]);
    themeAccent = themeColors[keyAsIndex - 1];
  }
);

const oscilloscope = () => {

  requestAnimationFrame(oscilloscope);

  audioAnalyser.getByteTimeDomainData(dataArray);

  canvasCTX.fillStyle = 'rgb(28, 28, 30)';
  canvasCTX.fillRect(0, 0, canvas.width, canvas.height);

  canvasCTX.lineWidth = 2;
  canvasCTX.strokeStyle = `rgb(${themeAccent})`;

  canvasCTX.beginPath();

  const sliceWidth = canvas.width * 1.0 / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {

    let v = dataArray[i] / 128.0;
    let y = v * canvas.height / 2;

    if (i === 0) {
      canvasCTX.moveTo(x, y);
    } else {
      canvasCTX.lineTo(x, y);
    }

    x += sliceWidth;

  }

  canvasCTX.lineTo(canvas.width, canvas.height / 2);
  canvasCTX.stroke();

}

oscilloscope();
