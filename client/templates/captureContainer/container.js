Template.container.events({
	'click #submit-button': function() {
		// Upload video and audio streams
		upload();
	}
});

// Hack to prevent multiple video uploads from same streams
var uploadedAudio = false;
var uploadedVideo = false;

function upload() {
    console.log("Uploading...");

    var audioBlobURL = Session.get("audioBlobURL");
    var videoBlobURL = Session.get("videoBlobURL");

    getBlob(audioBlobURL, function(audioBlob, audioBlobErr){
      getBlob(videoBlobURL, function(videoBlob, videoBlobErr){
        uploadAudio(audioBlob, function(audioID, audioIDErr){
          uploadVideo(videoBlob, function(videoID, videoIDErr){
            if (audioID && videoID && !audioBlobErr && !videoBlobErr && !audioIDErr && !videoIDErr) {
              Meteor.call('mergeAudioVideo', audioID, videoID);
            } else {
              console.log("All files aren't uploaded - Audio: " + audioID + " Video: " + videoID);
            }
          });
        });
      });
    });
 }

function getBlob(blobURL, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', blobURL, true);
    xhr.responseType = 'blob';

    xhr.onload = function(e) {
      if (this.status == 200) {
        var myBlob = this.response;
        callback(myBlob);
      } else {
        callback(null, this.status);
      }
    }

	xhr.send();
}


function uploadAudio(audioBlob, callback) {
    fsFile = new FS.File(audioBlob);

    AudioStreams.insert(fsFile, function (err, fileObj) {
      var cursor = AudioStreams.find(fileObj._id);

      var liveQuery = cursor.observe({
        changed: function(fileObj) {
          if (fileObj.isUploaded() && !uploadedAudio) {
            uploadedAudio = true;
            console.log("Uploaded Audio: " + fileObj._id);
            callback(fileObj._id);
          }
        }
      });

      if (err) {
        callback(null, err.reason);
      } 
    });
}
    
function uploadVideo(videoBlob, callback) {
    fsFile = new FS.File(videoBlob);

    VideoStreams.insert(fsFile, function (err, fileObj) {
      var cursor = VideoStreams.find(fileObj._id);

      var liveQuery = cursor.observe({
        changed: function(fileObj) {
          if (fileObj.isUploaded() && !uploadedVideo) {
            uploadedVideo = true;
            console.log("Uploaded Video: " + fileObj._id);
            callback(fileObj._id);
          }
        }
      });

      if (err) {
        callback(null, err.reason);
      } 
    });
}