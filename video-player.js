var video = document.getElementById('video');
var playPauseBtn = document.getElementById('playPause');
var vidControls = document.getElementById('media-controls');
var muteBtn = document.getElementById('muteUnmute');
var timeHolder = document.getElementById('timer');
var videoControlsLeft = document.getElementById("button-left");
// Can Play	
video.addEventListener('canplaythrough', function() {
    vidControls.classList.remove('hidden');
}, false);
// Play Pause Button
playPauseBtn.addEventListener('click', function() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}, false);
video.addEventListener('play', function() {
    playPauseBtn.classList.add('playing');
}, false);
video.addEventListener('pause', function() {
    playPauseBtn.classList.remove('playing');
}, false);
// Mute Button
muteBtn.addEventListener('click', function() {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
}, false);
// Volume Button
video.addEventListener('volumechange', function() {
    if (video.muted) {
        muteBtn.classList.add('unmute');
    } else {
        muteBtn.classList.remove('unmute');
    }
}, false);
// Fullscreen Toggle Button
function toggleFullScreen() {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }
    //Video timer
var timer = document.createElement("span");
timer.className = "timer";
timer.textContent = "";
videoControlsLeft.appendChild(timer);
//Transcript 
var transcriptParagraph = document.getElementById("transcript");
var transcriptNodeList = transcriptParagraph.children;
var transcriptArray = [];
for (var i = 0; i < transcriptNodeList.length; i++) {
    var transcriptSegment = {
        segmentSpan: transcriptNodeList[i],
        startTime: transcriptNodeList[i].getAttribute("data-start"),
        setVideoTime: function() {
            video.currentTime = this.startTime;
        }
    };
    transcriptArray.push(transcriptSegment);
}
for (var i = 0; i < transcriptArray.length; i++) {
    (function(i) {
        transcriptArray[i].segmentSpan.onclick = function() {
            transcriptArray[i].setVideoTime();
        };
    })(i);
}
//Progress bar
var progressBar = document.getElementById("progress-bar");
var clickArea = document.getElementById("progress-clickable");
//Captions
var captions = video.textTracks[0];
captions.mode = "hidden"; /*hide captions on page load */
var cues = captions.cues;
//Set progress bar width
function progressBarWidth() {
        progressBar.width = video.clientWidth;
    }
    //Move captions up above the progress bar

function positionCaptions(line) {
        for (var i = 0; i < cues.length; i++) {
            cues[i].line = (line);
        }
    }
    //Update progress bar 

function updateProgressBar() {
        if (progressBar.getContext) {
            var ctx = progressBar.getContext("2d");
            ctx.clearRect(0, 0, progressBar.clientWidth, progressBar.clientHeight);
            var buffered = video.buffered;
            var inc = progressBar.clientWidth / video.duration;
            ctx.fillStyle = "rgba(200, 200, 200,.6)";
            for (var i = 0; i < buffered.length; i++) {
                var startX = buffered.start(i) * inc;
                var endX = buffered.end(i) * inc;
                var width = endX - startX;
                ctx.fillRect(startX, 0, width, progressBar.clientHeight);
            }
            ctx.fillStyle = "rgb(255,148,0)";
            var progressWidth = (video.currentTime / video.duration) * (
                progressBar.width);
            if (progressWidth > 0) {
                ctx.fillRect(0, 0, progressWidth, progressBar.clientHeight);
            }
        }
    }
    //Add and remove "highlight" class

function highlightTranscript() {
        for (var i = 0; i < transcriptArray.length; i++) {
            if (transcriptArray[i].startTime <= video.currentTime && video.currentTime <
                transcriptArray[i + 1].startTime) {
                transcriptArray[i].segmentSpan.className = "highlight";
            } else {
                transcriptArray[i].segmentSpan.classList.remove("highlight");
            }
        }
    }
    //Convert seconds to 00:00:00 format 

function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s <
            10 ? "0" : "") + s);
    }
    //Set the timer 

function displayTime() {
    displayCurrentTime = secondsToHms(video.currentTime);
    displayDuration = secondsToHms(video.duration);
    timer.textContent = displayCurrentTime + "/" + displayDuration;
}
window.onload = progressBarWidth;
window.onresize = progressBarWidth;
video.addEventListener("canplay", function() {
    //position the captions
    positionCaptions(-3);
    //update the progress bar
    updateProgressBar();
    //display the video timer
    displayTime();
});
// Progress Bar
progressBar.addEventListener("mousedown", function() {
    //determine the position of the click relative to the canvas
    var rect = progressBar.getBoundingClientRect();
    progressX = event.clientX - rect.left;
    //calculate what time to jump to based on click
    var clickTime = (progressX / progressBar.width) * video.duration;
    //set video current time to clicktime
    video.currentTime = clickTime;
});
//Update progress bar and highlight the transcript 
video.addEventListener("timeupdate", function() {
    updateProgressBar();
    displayTime();
    highlightTranscript();
});