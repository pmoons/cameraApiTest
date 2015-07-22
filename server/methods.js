Meteor.methods({
	'mergeAudioVideo': function(audioID, videoID) {
		var baseDir = "../../../cfs/files/";
		var audioFileDir = baseDir + "audioStreams/";
		var videoFileDir = baseDir + "videoStreams/";
		var mergedFileDir = "../../../../../public/mergedAudioVideo/";

		var audioFile = "audioStreams-" + audioID + "-undefined";
		var videoFile = "videoStreams-" + videoID + "-undefined";
		var mergedFile = audioID + "-" + videoID + ".webm";

		exec = Npm.require('child_process').exec;

		var command = "ffmpeg -i " + audioFileDir + audioFile + " -i " + videoFileDir + videoFile + "  " + mergedFileDir + mergedFile;
		
		child = exec(command, function(error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);

			if(error !== null) {
		    	console.log('exec error: ' + error);
			}
		  	
			insertMergedFile();
		});

		var insertMergedFile = Meteor.bindEnvironment(function() {
			MergedAudioVideo.insert(mergedFileDir + mergedFile, function(err, fileObj) {
				if (err) {
				  	console.log("Error: " + err.reason);
				} else {
					deleteStreams();
				}
			});
		}, function(e) {
			throw e;
		});

		// Delete streams if they were merged successfully
		var deleteStreams = Meteor.bindEnvironment(function() {
			AudioStreams.remove(audioID);
			VideoStreams.remove(videoID);
		});
	},
	'deleteVideo': function(videoID) {
		MergedAudioVideo.remove(videoID);
	}
});
