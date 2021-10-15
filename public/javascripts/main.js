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
requestUserMedia($self.constraints);

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
const namespace = prepareNamespace(window.location.hash, true);

const button = document.querySelector('#call');

//pass in namespace for particular hash
//const sc = io( { autoConnect: false} );
const sc = io(`/${namespace}`, { autoConnect: false} );

button.addEventListener('click', joinCall);

/* DOM Events*/
function joinCall(){
  console.log("Join Call button pressed");
  sc.open();
  registerRtcEvents($peer);
  establishCallFeatures($peer);
}

function leaveCall(){
  sc.close();
}

/* WebRTC Events */

function establishCallFeatures(peer){
  peer.connection
      .addTrack($self.stream.getTracks()[0],
        $self.stream);
}

function registerRtcEvents(peer){
  peer.connection
    .onnegotiationneeded = handleRtcNegotiation;
  peer.connection
    .onicecandidate = handleIceCandidate;
  peer.connection.ontrack = handleRtcTrack;
}

function handleRtcNegotiation(){
  console.log('RTC negotiation needed...');
}
function handleIceCandidate(){
  //console.log();
}
function handleRtcTrack(){

}

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

/**
* Utility Functions
*/

function prepareNamespace(hash, set_location) {
let ns = hash.replace(/^#/, ''); // remove # from the hash
if (/^[0-9]{6}$/.test(ns)) {
console.log('Checked existing namespace', ns);
return ns;
}
ns = Math.random().toString().substring(2, 8);
console.log('Created new namespace', ns);
if (set_location) window.location.hash = ns;
return ns;
}
