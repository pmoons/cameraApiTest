// RecordRTC stream objects
var videoRecord;
var audioRecord;

// References to playback elements
var audio;
var video;

// When all the content on the page loaded.
window.addEventListener("DOMContentLoaded", function() {

  // Assign HTML elements to references.
  audio = document.getElementById("audio-playback");
  video = document.getElementById("video-playback");

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

      // Set video reference to camera stream
      video.src= window.URL.createObjectURL(stream);

      // Create audio stream and begin recording
      audioRecord = new RecordRTC(stream, {type: 'audio'});
      audioRecord.startRecording();

      // Create video stream and begin recording.
      videoRecord = new RecordRTC(stream, {type: 'video'});
      videoRecord.startRecording();
    },

    // Permission denied, print error to log
    function(err) {
      console.log("The following error occured: " + err.name);
    });

  // Browser does not support audio/video, print to log.
  } else {
    console.log("getUserMedia not supported");
  }

});

// When the "STOP" button is pressed
function stopRecording() {

  // Stop the audio recording and play reuslt in audio element.
  audioRecord.stopRecording(function (audioURL) {
    audio.src = audioURL;
    audio.play;
  });

  // Stop the video recording and play reuslt in video element.
  videoRecord.stopRecording(function (videoURL) {
    video.src = videoURL;
    video.play;
  });

};