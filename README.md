# cameraApiTest

This is a basic prototype to capture and record audio and video using HTML5 audio and video elements and Javascript. 

<li>Only works in Chrome right now.</li>
<li>Utilizes <a href="http://recordrtc.org/">RecordRTC.js</a> library</li>
<li>Must use webserver or else Chrome complains about security issue.</li>
<li>Navigate to directory and run <code>python -m SimpleHTTPServer</code> to start a simple web server. Navigate to <b>http://localhost:8000</b> to view.</li>

Will record two streams, audio and video.  May have to combine using <a href="https://www.ffmpeg.org/">ffmpeg</a> on the server when streams are uploaded.

Feel free to collaborate on this.  If you get it working for more browsers, or any other improvements, I'd be more than happy to make you a collaborator.
