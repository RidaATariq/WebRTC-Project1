'use strict';


/**
* User-Interface Setup
*/
const namespace = prepareNamespace(window.location.hash, true);
document.querySelector('#header h1')
.innerText = 'Welcome to Room #' + namespace;

document.querySelector('#call-button')
.addEventListener('click', handleCallButton);
/**
* User-Interface Functions and Callbacks
*/
function handleCallButton(event) {
const callButton = event.target;
if (callButton.className === 'join') {
console.log('Joining the call...');
callButton.className = 'leave';
callButton.innerText = 'Leave Call';
} else {
console.log('Leaving the call...');
callButton.className = 'join';
callButton.innerText = 'Join Call';
}
}


/**
* Utility Functions
*/
function prepareNamespace(hash, set_location) {
let ns = hash.replace(/^#/, ''); // remove # from the hash
if (/^[0-9]{7}$/.test(ns)) {
console.log('Checked existing namespace', ns);
return ns;
}
ns = Math.random().toString().substring(2, 9);
console.log('Created new namespace', ns);
if (set_location) window.location.hash = ns;
return ns;
}
