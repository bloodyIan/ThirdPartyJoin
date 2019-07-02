// Modified by hokein
//
// Copyright 2014 Intel Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// Author: Dongseong Hwang (dongseong.hwang@intel.com)

const {desktopCapturer} = require('electron');

let desktopSharing = true;
let localStream;

var videoElement = document.getElementById("myvideo");
videoElement.controls = false;

  function toggleFullScreen() {
    if (!document.mozFullScreen && !document.webkitFullScreen) {
      if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else {
        videoElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else {
        document.webkitCancelFullScreen();
      }
    }
  }
  
  document.addEventListener("keydown", function(e) {
    if (e.keyCode == 13) {
      toggleFullScreen();
    }
  }, false);

function refresh() {
  $('select').imagepicker({
    hide_select : true
  });
}

function addSource(source) {
  $('select').append($('<option>', {
    value: source.id.replace(":", ""),
    text: source.name
  }));
  $('select option[value="' + source.id.replace(":", "") + '"]').attr('data-img-src', source.thumbnail.toDataURL());
  refresh();
}

function showSources() {
  desktopCapturer.getSources({ types:['window', 'screen'] }, function(error, sources) {
    for (let source of sources) {
      console.log("Name: " + source.name);
      addSource(source);
    }
  });
}

function toggle() {
  if (!desktopSharing) {
    var id = ($('select').val()).replace(/window|screen/g, function(match) { return match + ":"; });
    onAccessApproved(id);
  } else {
    desktopSharing = false;

    if (localStream)
      localStream.getTracks()[0].stop();
    localStream = null;

    //document.querySelector('button').innerHTML = "Enable Capture";

    $('select').empty();
    showSources();
    refresh();
  }
}

function onAccessApproved(id) {
  let desktop_id = "screen:0:0";
  if (!desktop_id) {
    console.log('Desktop Capture access rejected.');
    return;
  }
  desktopSharing = true;
  //document.querySelector('button').innerHTML = "Disable Capture";
  console.log("Desktop sharing started.. desktop_id:" + desktop_id);
  console.log(process.versions.electron);
  navigator.webkitGetUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: desktop_id,
        minWidth: 1920,
        maxWidth: 1920,
        minHeight: 1080,
        maxHeight: 1080
      }
    }
  }, gotStream, getUserMediaError);

  function gotStream(stream) {
    localStream = stream;
    document.querySelector('video').srcObject = stream;
    stream.onended = function() {
      if (desktopSharing) {
        toggle();
      }
    };
  }

  function getUserMediaError(e) {
    console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
  }
}

$(document).ready(function() {

  showSources();
  refresh();
  onAccessApproved("screen:0:0");
});

document.querySelector('button').addEventListener('click', function(e) {
  toggle();
});