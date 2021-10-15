'use strict'

//variable '$self' is used for things on users side of call
//initially starts by setting audio to off and video to on
const $self = {
  rtcConfig: null,
  constraints: {audio:false, video: true }
};

//peer object is used as person two in syscal
//sets up a connection b/w two people ($self & $peer)
const $peer = {
  connection: new RTCPeerConnection($self.rtcConfig)
};

/* set up a stream by grabbing self and peer*/
// requestUserMedia($self.constraints);

//requests media usage from user in pop up
async function requestUserMedia(constraints) {
  const video = document.querySelector('#self')
  $self.stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = $self.stream;
}

/**
* Socket Server Events and Callbacks
*/

//namespace to use hash in window
const namespace = window.location.hash.substr(1);

const button = document.querySelector('#call');

//pass in namespace for particular hash
//const sc = io( { autoConnect: false} );
const sc = io(`/${namespace}`, { autoConnect: false} );

button.addEventListener('click', function(){
  console.log("Join Call button pressed");
  sc.open();
});

function registerScEvents() {
sc.on('connect', handleScConnect);
sc.on('connected peer', handleScConnectedPeer);
sc.on('disconnected peer', handleScDisconnectedPeer);
sc.on('signal', handleScSignal);
}

registerScEvents();

function handleScConnect() {
console.log('Successfully connected to the signaling channel!');
}

function handleScConnectedPeer() {
  console.log('A peer connected! Event occurred');
}

function handleScDisconnectedPeer() {
  console.log('A peer Diconnected! Event occurred');
}

async function handleScSignal() {
  console.log('A signal event occurred!');
}
