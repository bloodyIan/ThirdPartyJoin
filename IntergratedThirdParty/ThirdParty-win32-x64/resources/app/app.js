const electron = require('electron');

$(document).ready(function() {
  var videoElement = document.getElementById("myvideo");
  videoElement.controls = false;
  var displays = electron.screen.getAllDisplays();
  for (var i in displays) {
    if (displays[i].bounds.x == 0 && displays[i].bounds.y == 0) {
      navigator.webkitGetUserMedia({ audio: false, video: { mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: "window:2035764:0",
            minWidth: 1920,
            maxWidth: 1920,
            minHeight: 1080,
            maxHeight: 1080
          }
        }
      },
      (stream) => document.querySelector('video').srcObject = stream,
      (e) => console.log('getUserMediaError: ' + JSON.stringify(e, null, '---')));
      videoElement.minHeight = displays[i].bounds.height
      videoElement.maxHeight = displays[i].bounds.height
      videoElement.minWidth = displays[i].bounds.width
      videoElement.maxWidth = displays[i].bounds.width
    }
  }
});
