AudioStreams = new FS.Collection("audioStreams", {
  stores: [new FS.Store.FileSystem("audioStreams")]
});

VideoStreams = new FS.Collection("videoStreams", {
  stores: [new FS.Store.FileSystem("videoStreams")]
});

MergedAudioVideo = new FS.Collection("mergedAudioVideo", {
	stores: [new FS.Store.FileSystem("mergedAudioVideo")]
});