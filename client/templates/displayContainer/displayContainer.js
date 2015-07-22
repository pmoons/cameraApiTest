Template.displayContainer.helpers({
	video: function() {
		return MergedAudioVideo.find();
	}
});

Template.displayContainer.events({
	'click i': function() {
		Meteor.call('deleteVideo', this._id);
	}
});