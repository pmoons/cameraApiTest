// RecordRTC stream objects
var videoRecord;
var audioRecord;

// References to playback elements
var audio;
var video;

// Reference to count-down timer interval to stop and start when necessary
var timerInterval

// Reference to seek time
var seekTime;

// When all the content on the page loaded.
window.addEventListener("DOMContentLoaded", function() {

  // Assign references to HTML audio/video elements.
  audio = document.getElementById("audio-playback");
  video = document.getElementById("video");
  playbackControls = document.getElementById("video-controls");

  // Assign references to Buttons
  recordBtn = document.getElementById("record");
  playPauseBtn = document.getElementById("play-pause");
  muteBtn = document.getElementById("mute");
  fullScreenBtn = document.getElementById("full-screen");

  // Assign references to Sliders
  seekBar = document.getElementById("seek-bar");
  volumeBar = document.getElementById("volume-bar");

  // Assign references to Misc.
  recordIcon = document.getElementById("record-icon");
  countDown = document.getElementById("record-time-remaining");
  seekTime = document.getElementById("seek-time-location");

  // Assign getUserMedia to vendor specific version
  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozgetUserMedia ||
                           navigator.msGetUserMedia;

  // If the browser supports video/audio functionality
  if (navigator.getUserMedia) {
    
    // Ask for audio/video permission
    navigator.getUserMedia({video: true, audio: true},

    // Permission granted, stream webcam to video element
    // and start recording.
    function(stream) {

      // Set video reference to camera stream. Mute stream audio output.
      video.src = window.URL.createObjectURL(stream);
      video.muted = true;

      // Set event handler for Record Button, passing in active video stream.
      recordBtn.addEventListener("click", function() {
        // Record button hasn't been pressed yet, proceed with recording.
        if (recordBtn.innerHTML === "Record") {
          record(stream);
        } else {
          // Video is currently recording, stop the recording
          stopRecording();
        }

      });

      // Set event handler for Play/Pause Button.
      playPauseBtn.addEventListener("click", playPause);

      // Set event handler for Mute Button
      muteBtn.addEventListener("click", mute);

      // Set event handler for FullScreen Button
      fullScreenBtn.addEventListener("click", fullScreen);

      // Set event handler for Seek Bar while seeking
      seekBar.addEventListener("input", seek);

      // Set event handler for Seek Bar on Mouse Down
      seekBar.addEventListener("mousedown", function() {
        // Pause playback to prevent stuttering.
        video.pause();
        audio.pause();

      });

      // Set event handler for Seek Bar on Mouse Up
      seekBar.addEventListener("mouseup", function() {
        // Play the video when the slider's handle is dropped
        video.play();
        audio.play();
      });

      // Set event handler for Video as it plays (to update seek bar location)
      video.addEventListener("timeupdate", updateSeekBar);

      // Set event handler for Volume Bar
      volumeBar.addEventListener("change", function() {
        // Update audio volume
        audio.volume = volumeBar.value;
      });
      
    },

    // Permission denied, print error to log
    function(err) {
      console.log("The following error occured: " + err.name);
    });

  } else {
    console.log("getUserMedia not supported");
  }

});

// When the "Stop Recording" button is pressed
function stopRecording() {
  // Stop and hide count down timer.
  stopTimer();

  // Set Play button to Pause button (video autoplays).
  playPauseBtn.firstElementChild.src = "../img/pause.png";

  // Move the button back to the right
  recordBtn.style.left = "40%";

  // Change Stop Recording button to Record button
  recordBtn.innerHTML = "Record";

  // Hide Record dot
  recordIcon.style.visibility = "hidden";

  // Display correct volume icon
  if (audio.muted == true) {
    // Update the button image
    muteBtn.firstElementChild.src = "../img/volumeMute.png";
  } else {
    muteBtn.firstElementChild.src = "../img/volumeUp.png";
  }

  // Display video playback controls
  playbackControls.style.visibility = "visible";

  // Stop the audio recording and play reuslt in audio element.
  audioRecord.stopRecording(function (audioURL) {
    audio.src = audioURL;
    audio.play();
  });

  // Stop the video recording and play reuslt in video element.
  videoRecord.stopRecording(function (videoURL) {
    video.src = videoURL;
    video.play();
  });

}

// When the "Record" button is pressed
function record(stream) {
    // Start timer
    startTimer(60);
    
    // Move the button to the left to account for increased text
    recordBtn.style.left = "31%";

    // Change Record button to Stop Recording button
    recordBtn.innerHTML = "Stop Recording";

    // Hide video playback controls
    playbackControls.style.visibility = "hidden";

    // Set video reference to camera stream. Mute stream audio output.
    video.src = window.URL.createObjectURL(stream);

    // Show Record Icon in the top left of window
    recordIcon.style.visibility = "visible";

    // Create audio stream and begin recording
    audioRecord = new RecordRTC(stream, {type: 'audio'});
    audioRecord.startRecording();

    // Create video stream and begin recording.
    videoRecord = new RecordRTC(stream, {type: 'video'});
    videoRecord.startRecording();
}

// When the "Play/Pause" button is pressed
function playPause() {
  // Video is not playing
  if (video.paused == true) {
      // Play the video/audio
      video.play();
      audio.play();

      // Update the button image to 'Pause'
      playPauseBtn.firstElementChild.src = "../img/pause.png"
    
    // Video is playing
    } else {
      // Pause the video/audio
      video.pause();
      audio.pause();

      // Update the button image to 'Play'
      playPauseBtn.firstElementChild.src = "../img/play.png"
    }
}

// When the "Mute" button is pressed
function mute() {
  // Audio is not muted
  if (audio.muted == false) {
    // Mute the audio
    audio.muted = true;

    // Update the button image
    muteBtn.firstElementChild.src = "../img/volumeMute.png";
  
  // Audio is muted
  } else {
    // Video is muted, unmute the video
    audio.muted = false;

    // Update the button image
    muteBtn.firstElementChild.src = "../img/volumeUp.png";
  }
}

// When the "FullScreen" button is pressed
function fullScreen() {
  if (video.requestFullscreen) {
    video.requestFullscreen(); // Default request method
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen(); // Firefox
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen(); // Chrome and Safari
  }
}

// When the "Seek Bar" is being changed
function seek() {
  // Calculate the new time
  var time = video.duration * (seekBar.value / 100);

  // Update the video and audio time
  video.currentTime = time;
  audio.currentTime = time;

  // Update the slider seek time.
  formatSeekTime();
}

// Update Seek Bar location as the Video plays
function updateSeekBar() {
  // Calculate the slider value
  var value = (100 / video.duration) * video.currentTime;

  // Update the slider value
  seekBar.value = value;

  // Update the slider seek time.
  formatSeekTime();  
}

// Start countdown timer for recording
function startTimer(duration) {
  var timer = duration, minutes, seconds;

  timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        countDown.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
            stopRecording();
        }

  }, 1000);

}

// Hide count down timer
function stopTimer() {
  countDown.style.visibility = "hidden";
  clearInterval(timerInterval);
}

// Update the slider seek time.
function formatSeekTime() {
  // Round numbers to nearest whole numbers
  var time = Math.round(video.duration * (seekBar.value / 100)) || 0;
  var videoDuration = Math.round(video.duration) || 0;

  // If the number is less than 10, display a 0 in front of it.
  time = time < 10 ? "0" + time : time;
  videoDuration = time < 10 ? "0" + videoDuration : videoDuration;

  // Set the text.
  seekTime.textContent = ":" + time + "/:" + videoDuration;
}