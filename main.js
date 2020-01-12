const audioCTX      = new AudioContext();
const audioAnalyser = audioCTX.createAnalyser();
const audioElement  = document.querySelector('audio');
const audioInput    = audioCTX.createMediaElementSource(audioElement);

audioAnalyser.fftSize = 1024;
audioAnalyser.smoothingTimeConstant = 0.9;
audioInput.connect(audioAnalyser);
audioAnalyser.connect(audioCTX.destination);

const bufferLength = audioAnalyser.frequencyBinCount;
const dataArray    = new Uint8Array(bufferLength);
audioAnalyser.getByteTimeDomainData(dataArray);

const createPlayButton = () => {

  const button = document.createElement('button');
  button.textContent = 'Play';
  button.dataset.playing = 'false';
  button.setAttribute('role', 'switch');

  return button;

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

  audioElement.addEventListener('ended', () => {
    playElem.dataset.playing = 'false';
  }, false);

  return playElem;

}

const canvas    = document.getElementById("oscilloscope");
const canvasCTX = canvas.getContext("2d");
canvas.width    = window.innerWidth;
canvas.height   = window.innerHeight;

const draw = () => {

  requestAnimationFrame(draw);

  audioAnalyser.getByteTimeDomainData(dataArray);

  canvasCTX.fillStyle = 'rgb(28, 28, 30)';
  canvasCTX.fillRect(0, 0, canvas.width, canvas.height);

  canvasCTX.lineWidth = 2;
  canvasCTX.strokeStyle = 'rgb(243, 75, 10)';

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

document.querySelector('body').appendChild(addPlayEvents(createPlayButton(), audioElement));

draw();
