const socket = io('/'); // socket.io 클라이언트의 인스턴스를 초기화한다. 서버와의 연결

const getElementById = (id) => document.getElementById(id) || null;

//  get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

function helloUser() {
  const username = prompt('이름이 뭐에욥?');
  //   socket.emit('new_user', username); // socket.emit('이벤트 이름', 데이터, 콜백)
  socket.emit('new_user', username, (data) => {
    console.log(data); // return 한 값이 옴
  });
  socket.on('hello_user', (data) => {
    console.log(data);
  }); // socket.on('이벤트 이름', 콜백)
}

function init() {
  helloUser();
}

init();
