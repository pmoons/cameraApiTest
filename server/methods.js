Meteor.methods({
	'mergeAudioVideo': function(audioID, videoID) {
		console.log()

		var baseDir = "../../../cfs/files/";
		var audioFileDir = baseDir + "audioStreams/";
		var videoFileDir = baseDir + "videoStreams/";
		var mergedFileDir = baseDir + "mergedAudioVideo/";

		var audioFile = "audioStreams-" + audioID + "-undefined";
		var videoFile = "videoStreams-" + videoID + "-undefined";
		var mergedFile = audioID + "-" + videoID + ".webm";

		exec = Npm.require('child_process').exec;

		var command = "ffmpeg -i " + audioFileDir + audioFile + " -i " + videoFileDir + videoFile + " -map 0:0 -map 1:0 " + mergedFileDir + mergedFile;
		
		child = exec(command, function(error, stdout, stderr) {
		  console.log('stdout: ' + stdout);
		  console.log('stderr: ' + stderr);

		  if(error !== null) {
		    console.log('exec error: ' + error);
		  }

		  MergedAudioVideo.insert(mergedFileDir + mergedFile, function(err, fileObj) {
		  	if (err)
		  		console.log("Error: " + err.reason);
		  });

		});
	}
});

