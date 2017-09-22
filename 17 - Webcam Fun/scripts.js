const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const shutter = document.querySelector('.take_pic');
const bwButton = document.querySelector('.b_and_w');
const colorButton = document.querySelector('.color');
let color = true;
let interval;

function getVideo() {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  })
  .then((localMediaStream) => {
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
  })
  .catch((err) => {
    console.error('OH NOOO!!', err);
  });
}

function blackAndWhiteFilter(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    const redValue = pixels.data[i + 0];
    const greenValue = pixels.data[i + 1];
    const blueValue = pixels.data[i + 2];
    const greyValue = (redValue + greenValue + blueValue) / 3;

    pixels.data[i + 0] = greyValue; // RED
    pixels.data[i + 1] = greyValue; // GREEN
    pixels.data[i + 2] = greyValue; // BLUE
  }
  return pixels;
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  if (color === true) {
    colorButton.style.display = 'none';
    bwButton.style.display = 'inline-block';
    interval = window.setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height);
    }, 16);
  } else {
    bwButton.style.display = 'none';
    colorButton.style.display = 'inline-block';
    interval = window.setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height);
      // Take the pixels out
      let pixels = ctx.getImageData(0, 0, width, height);
      // Mess with them
      pixels = blackAndWhiteFilter(pixels);
      // Put them back
      ctx.putImageData(pixels, 0, 0);
    }, 16);
  }
}

function videoStop() {
  window.clearInterval(interval);
}

function blackAndWhite() {
  videoStop();
  color = false;
  paintToCanvas();
}

function colorFilter() {
  videoStop();
  color = true;
  paintToCanvas();
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Pretty Woman"/>`;
  strip.insertBefore(link, strip.firstChild);
}

getVideo();

bwButton.addEventListener('click', blackAndWhite);
colorButton.addEventListener('click', colorFilter);
shutter.addEventListener('click', takePhoto);
video.addEventListener('canplay', paintToCanvas);

