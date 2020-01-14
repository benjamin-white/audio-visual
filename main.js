const FFTSIZE       = 1024;
const bufferLength  = FFTSIZE / 2;
const dataArray     = new Uint8Array(bufferLength);
const bodyElement   = document.querySelector('body');
const playButton    = createPlayButton();
const audioElement  = createAudioElement('boxcutter-moon_pupils.mp3');
const audioCTX      = new AudioContext();
const audioInput    = audioCTX.createMediaElementSource(audioElement);
const audioAnalyser = audioCTX.createAnalyser();
const canvas        = document.createElement('canvas');
const canvasCTX     = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width  = window.innerWidth;

audioAnalyser.fftSize = FFTSIZE;
audioAnalyser.smoothingTimeConstant = 0.9;
audioInput.connect(audioAnalyser);
audioAnalyser.connect(audioCTX.destination);

handleEnded(audioElement)(playButton);
resizeToViewport(canvas);

bodyElement.appendChild(canvas);
bodyElement.appendChild(audioElement);
bodyElement.appendChild(addPlayEvents(playButton, audioElement));

const oscilloscope = () => {

  requestAnimationFrame(oscilloscope);

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

oscilloscope();
