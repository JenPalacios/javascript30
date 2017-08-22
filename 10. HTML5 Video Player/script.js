//Get our elements
const player         = document.querySelector('.player');
const video          = player.querySelector('.viewer');
const progress       = player.querySelector('.progress');
const progressBar    = player.querySelector('.progress__filled');
const toggle         = player.querySelector('.toggle');
const skipButtons    = player.querySelectorAll('[data-skip]');
const ranges         = player.querySelectorAll('.player__slider');
const fullscreen     = player.querySelector('.player__fullscreen');

// Build our functions

function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

//Do not hook it to the previous function. This way, in case a user has a plugin or uses another way to play/pause the video, we are still listening to the video being player or not.
function updateButton() {
  const icon = this.paused ? ' ►' :  '❚ ❚';
  toggle.textContent = icon;
}

function skip() {
  const skipQuantity = this.dataset.skip;
  video.currentTime += parseFloat(skipQuantity);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function toggleFullscreen(){
  player.style.maxWidth = '100%';
}

//Hook up the event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(thisButton => thisButton.addEventListener('click', skip));
ranges.forEach(thisRange => thisRange.addEventListener('change', handleRangeUpdate));
ranges.forEach(thisRange => thisRange.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => {
  if (mousedown) {
    scrub(e);
  }
});
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

fullscreen.addEventListener('click', toggleFullscreen );
