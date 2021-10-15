'use strict'

const $self = {
  rtcConfig: null,
  constraints: {audio:false, video: true }
};

const $peer = {
  connection: new RTCPeerConnection($self.rtcConfig)
};

requestUserMedia($self.constraints);

async function requestUserMedia(constraints) {
  const video = document.querySelector('#self')
  $self.stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = $self.stream;
}

/**
* Socket Server Events and Callbacks
*/
//const namespace = window.location.hash.substr(1);
const button = document.querySelector('#call');
const sc = io( { autoConnect: false} );
//const sc = io(`/${namespace}`, { autoConnect: false} );
button.addEventListener('click', function(){
  sc.open();
});
sc.on('connect', function() {
  console.log('Socket.io instance connected');
});
