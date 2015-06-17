// When all the content on the page loaded.
window.addEventListener("DOMContentLoaded", function() {
  // Assign getUserMedia to vendor specific version
  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozgetUserMedia ||
                           navigator.msGetUserMedia;

  // If the browser supports video/audio functionality
  if (navigator.getUserMedia) {
    // Ask for audio/video permission
    navigator.getUserMedia({video: true, audio: true},
    // Permission granted, stream webcam to video element.
    function(stream) {
      video.src= window.URL.createObjectURL(stream); 
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