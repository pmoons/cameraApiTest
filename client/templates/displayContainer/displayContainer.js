Template.displayContainer.helpers({
	video: function() {
		return MergedAudioVideo.find();
	}
});

Template.displayContainer.events({
	'click i': function() {
		MergedAudioVideo.remove(this._id);
	}
});