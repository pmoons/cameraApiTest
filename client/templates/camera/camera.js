var volumeMuteURL = "/img/camera-playback-controls/volumeMute.png";
var volumeUpURL = "/img/camera-playback-controls/volumeUp.png";
var volumeDownURL = "/img/camera-playback-controls/volumeDown.png";
var pauseURL = "/img/camera-playback-controls/pause.png";
var playURL = "/img/camera-playback-controls/play.png";

// RecordRTC stream objects
var videoRecord;
var audioRecord;

//HTML5 Elements
var audio;
var video;

//JQuery Elements
var recordBtn;
var playbackControls;
var playPauseBtn;
var muteBtn;
var fullScreenBtn;
var volumeBar;
var recordIcon;
var countDown
var seekBar;
var seekTime;
var videoContainer;

var isRecording = false;
var timerInterval;

Template.camera.created = function(){
  $.getScript("https://webrtcexperiment-webrtc.netdna-ssl.com/RecordRTC.js");
}

Template.camera.rendered = function(){
  audio = $("#audio-playback")[0];
  video = $("#video")[0];

  recordBtn = $("#record");
  playbackControls = $("#video-controls");
  playPauseBtn = $("#play-pause");
  muteBtn = $("#mute");
  fullScreenBtn = $("#full-screen");
  volumeBar = $("#volume-bar");
  recordIcon = $("#record-icon");
  countDown = $("#record-time-remaining");
  seekTime = $("#seek-time-location");
  seekBar = $("#seek-bar");
  videoContainer = $("#video-container");
    
  recordBtn.click(preventDefault);
}

Template.camera.events({
  'click #record': function() {
    // Assign getUserMedia to vendor specific version
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozgetUserMedia ||
                             navigator.msGetUserMedia;

  if (!!navigator.getUserMedia) {
    
    // Ask for audio/video permission
    navigator.getUserMedia({video: true, audio: true},

    function(stream) {
      $('#record').attr('id', 'startRecording');
      $('#startRecording').html("CLICK TO START RECORDING");
      video.src = window.URL.createObjectURL(stream);
      video.muted = true;

      recordBtn.click(toggleRecord.bind(null, stream));
      playPauseBtn.click(playPause);
      muteBtn.click(mute);
      fullScreenBtn.click(fullScreen);
      seekBar.change(seek);
      seekBar.mousedown(pause);
      seekBar.mouseup(play);
      volumeBar.change(changeVolume);

      // Set event handler for Video as it plays (to update seek bar location)
      video.addEventListener("timeupdate", updateSeekBar);
    },

    // Permission denied, print error to log
    function(err) {
      $(video).replaceWith("<h2>Please enable video</h2>");
      console.log("The following error occured: " + err.name);
    });

  } else {
    console.log("getUserMedia not supported");
  }
  }

});

function preventDefault(e){
  e.preventDefault();
}

function toggleRecord(stream){
  if (!isRecording) {
    record(stream);
  } else {
    stopRecording();
  }    
}

function stopRecording() {
  var audioReady, videoReady = false;

  isRecording = false;
  stopTimer();

  playPauseBtn.find("img").attr("src", pauseURL);
  recordBtn.css("left", "40%");
  recordBtn.html("CLICK TO RE-RECORD");
  recordIcon.css("visibility", "hidden");
  playbackControls.css("visibility", "visible");

  // Display correct volume icon
  if (audio.muted == true) {
    muteBtn.find("img").attr("src", volumeMuteURL);
  } else {
    muteBtn.find("img").attr("src", volumeUpURL);
  }

  audioRecord.stopRecording(function (audioURL) {
    audio.src = audioURL;
    Session.set('audioBlobURL', audio.src);
    audioReady = true;
    playWhenReady();
  });

  videoRecord.stopRecording(function (videoURL) {
    video.src = videoURL;
    Session.set('videoBlobURL', video.src);
    videoReady = true;
    playWhenReady();
  });

  function playWhenReady(){
    if (audioReady && videoReady) {
      play();
      audioReady = false;
      videoReady = false;
    }
  }
}

function record(stream) {
    isRecording = true;

    // Start timer (takes about a second for the timer to begin)
    startTimer(59);
    
    recordBtn.css("left", "31%");
    recordBtn.html("STOP");
    playbackControls.css("visibility", "hidden");
    recordIcon.css("visibility", "visible");

    // Set video reference to camera stream. Mute stream audio output.
    video.src = window.URL.createObjectURL(stream);

    // Create audio stream and begin recording
    audioRecord = new RecordRTC(stream, {type: 'audio'});
    audioRecord.startRecording();

    // Create video stream and begin recording.
    videoRecord = new RecordRTC(stream, {type: 'video'});
    videoRecord.startRecording();
}

function playPause() {
  if ((video.paused == true)) {
    play();
  } else {
    pause();
  }
}

function play(){
  video.play();
  audio.play();
  playPauseBtn.find("img").attr("src", pauseURL);    
}

function pause(){
  video.pause();
  audio.pause();
  playPauseBtn.find("img").attr("src", playURL);
}

function mute() {
  if (volumeBar.val() > 0) {
    // Capture old volume level and then change volume bar value
    oldVolume = volumeBar.val();
    volumeBar.val(0);
    changeVolume();
  } else {
    volumeBar.val(oldVolume);
    changeVolume();
  }
}

function fullScreen() {
  var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;

  if (state === false) {
    if (video.requestFullscreen) {
      video.requestFullscreen(); // Default request method
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen(); // Firefox
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(); // Chrome and Safari
    }

    //Expand seekbar to fit screen
    setTimeout(function() {
      var space = $(window).width() - ($("#volume-bar").offset().left + $("#volume-bar").outerWidth()) - 50;
      var oldWidth = $('#seek-bar').width();
      $('#seek-bar').width(oldWidth + space);
    }, 1000);

  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
    $("#seek-bar").css("width", "");
  }    
}

function seek() {
  var time = video.duration * (seekBar.val() / 100);

  // Update the video and audio time
  video.currentTime = time;
  audio.currentTime = time;

  // Update the slider seek time.
  formatSeekTime();
}

function updateSeekBar() {
  var value = (100 / video.duration) * video.currentTime;

  // Update the slider value
  seekBar.val(value);

  // Update the slider seek time.
  formatSeekTime();  

  // Check if the seek bar is at the end, if so, change pause to play icon.
  if (value == 100) {
    playPauseBtn.find("img").attr("src", playURL);
  }
}

function startTimer(duration) {
  countDown.css("visibility", "visible");

  var timer = duration, minutes, seconds;

  timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        countDown.text("-" + minutes + ":" + seconds);

        if (--timer < 0) {
            timer = duration;
            stopRecording();
        }

  }, 1000);

}

function stopTimer() {
  countDown.css("visibility", "hidden");
  clearInterval(timerInterval);
  countDown.text("01:00");
}

function formatSeekTime() {
  // Round numbers to nearest whole numbers
  var time = Math.round(video.duration * (seekBar.val() / 100)) || 0;
  var videoDuration = Math.round(video.duration);

  // If the number is less than 10, display a 0 in front of it.
  time = time < 10 ? "0" + time : time;
  videoDuration = videoDuration < 10 ? "0" + videoDuration : videoDuration;

  // Catch Infinity
  if (!isFinite(videoDuration)) {
    videoDuration = 0;
  }

  seekTime.text(":" + time + "/:" + videoDuration);
}

// Updates the volume icon and volume when volume bar is being moved.
function changeVolume() {
  // Retrieve value off volume bar
  var volumeValue = volumeBar.val();
  
  // Determine correct volume icon and set volume appropriately.
  if (volumeValue == 0) {
    muteBtn.find("img").attr("src", volumeMuteURL);
    audio.volume = 0;
  } else if (volumeValue > 0 && volumeValue < .5) {
    muteBtn.find("img").attr("src", volumeDownURL);
    audio.volume = volumeValue;
  } else if (volumeValue >= .5) {
    muteBtn.find("img").attr("src", volumeUpURL);
    audio.volume = volumeValue;
  }

}