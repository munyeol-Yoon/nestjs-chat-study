const socket = io('/');

const getElementById = (id) => document.getElementById(id) || null;

//  get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

function helloUser() {
  const username = prompt('이름이 뭐에욥?');
}

function init() {
  helloUser();
}

init();
