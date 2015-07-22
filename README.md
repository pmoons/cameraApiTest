# cameraApiTest

This is a basic prototype to capture and record audio and video using HTML5 audio and video elements and Javascript. 

<li>Only works in Chrome right now & uploading/merging streams only on Unix/Mac.</li>
<li>Utilizes <a href="http://recordrtc.org/">RecordRTC.js</a> library</li>
<li>Must use webserver or else Chrome complains about security issue.</li>
<li>Navigate to directory and run <code>meteor</code> to begin. In the web browser, go to (by default) <b>http://localhost:3000</b> to view.</li>

Will record two streams, audio and video.  Combining streams using <a href="https://www.ffmpeg.org/">ffmpeg</a> on the server when streams are uploaded (using <a href="https://github.com/CollectionFS/Meteor-CollectionFS">CollectionFS</a>).

Feel free to collaborate on this.  If you get it working for more browsers, or any other improvements, I'd be more than happy to make you a collaborator.
