'use strict'

//variable '$self' is used for things on users side of call
//initially starts by setting audio to off and video to on
const $self = {
  rtcConfig: null,
  isPolite: false,
  isMakingOffer: false,
  isIgnoringOffer: false,
  isSettingRemoteAnswerPending: false,
  constraints: { audio: false, video: true }
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
  //const video = document.querySelector('#self')
  $self.stream = await navigator.mediaDevices.getUserMedia(constraints);
  //video.srcObject = $self.stream;
  displayStream('#self', $self.stream);
}

/**
* Socket Server Events and Callbacks
*/

//namespace to use hash in window
const namespace = prepareNamespace(window.location.hash, true);

const button = document.querySelector('#call-button');

//pass in namespace for particular hash
//const sc = io( { autoConnect: false} );
const sc = io(`/${namespace}`, { autoConnect: false} );

button.addEventListener('click', handleButtonFn);

document.querySelector('#header h1')
   .innerText = `Welcome to TA Virtual Office Room #${namespace}`;

/* DOM media events (grab self and peer)*/
function displayStream( selector, stream ) {
 const video = document.querySelector(selector);
 video.srcObject = stream;
}

/* DOM Events*/
function handleButtonFn(e) {
  console.log("Join Call button pressed");
  const button = e.target;
  if (button.className === 'join') {
    button.className = 'leave';
    button.innerText = 'Leave Room';
    JoinRoom();
  } else {
    button.className = 'join';
    button.innerText = 'Join Room';
    LeaveRoom();
  }
} //end handleButtonFn

function JoinRoom(){
  console.log("Join Call button pressed");
  sc.open();
  registerRtcEvents($peer);
  establishCallFeatures($peer);
}

function LeaveRoom(){

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

async function handleRtcNegotiation(){
  console.log('RTC negotiation needed...');
  // SDP description send and then set to make an offer false
  $self.isMakingOffer = true;
  await $peer.connection.setLocalDescription();
  sc.emit('signal', { description: $peer.connection.localDescription});
  $self.isMakingOffer = false;
}
function handleIceCandidate({ candidate }) {
  console.log("handleIceCandidate Event");
  sc.emit('signal', { candidate: candidate });
} //end candidate

function handleRtcTrack({ track, streams: [stream] }) {
  //send incoming track to peer
  displayStream('#peer', stream);
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
  $self.isPolite = true;
}

function handleScDisconnectedPeer() {
  console.log('A peer Diconnected! Event occurred');
  displayStream('#peer',null); //To remove the frozen image when call ends.
  $peer.connection.close();
  $peer.connection = new RTCPeerConnection($self.rtcConfig);
  registerRtcEvents($peer);
  establishCallFeatures($peer);
}

async function handleScSignal({ description, candidate }) {
  console.log('A signal event occurred!');
  if (description){
    console.log('SDP Signal Received:', description);

    const readyForOffer = !$self.isMakingOffer &&
      ($peer.connection.signalingState === 'stable' || $self.isSettingRemoteAnswerPending);

    const offerCollision = description.type === 'offer' && !readyForOffer;
    $self.isIgnoringOffer = !$self.isPolite  && offerCollision;

    if ($self.isIgnoringOffer) {
      return;
    }

    $self.isSettingRemoteAnswerPending = description.type === 'answer';
    await $peer.connection.setRemoteDescription(description);
    $self.isSettingRemoteAnswerPending = false;

    if (description.type === 'offer') {
      await $peer.connection.setLocalDescription();
      sc.emit('signal', { description: $peer.connection.localDescription });
    }

} else if (candidate) {
    console.log('ICE Candidate Received:', candidate);

    // This try & catch block is used for old browsers that don't know
     //what to do if they receive an ICE candidate.
    try {
      await $peer.connection.addIceCandidate(candidate);
    } catch(e) {
      if (!$self.isIgnoringOffer) {
        console.error("Cannot add ICE candidate to peer");
      }
    } //end of catch
 }
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

// feedback form

$(document).ready(function() {
  $('html').removeClass('nojs');
  $('html').addClass('hasjs');
  var submitId = document.getElementById("submitId");
});

submitId.addEventListener("click", function(){document.getElementById('form').addEventListener('submit', submitFunc);});

function submitFunc() {
  var inName = document.getElementById("nameInput").value;
  var inEmail = document.getElementById("emailInput").value;
  var inSubject = document.getElementById("subjectInput").value;


  if ((inName == "") || (inEmail == "") || (inSubject == ""))
    alert("Fill out all the required info.");

  else
    alert("Thank you, " + inName + "! We appreciate your time.");

}
