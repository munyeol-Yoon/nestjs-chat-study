const socket = io('/chattings'); // socket.io 클라이언트의 인스턴스를 초기화한다. 서버와의 연결

const getElementById = (id) => document.getElementById(id) || null;

//  get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

// 브로드 캐스트 global socket handler
socket.on('user_connected', (username) => {
  drawNewChat(`${username} connected`);
});

socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username}: ${chat}`);
});

// event callback functions
const handleSubmit = (event) => {
  event.preventDefault(); // submit 을 할때 form 에서 이벤트 버블 새로고침을 막기 위함
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);

    // 화면에 그리지
    drawNewChat(`me: ${inputValue}`);
    event.target.elements[0].value = '';
  }
};

// draw functions
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `안녕 ${username}`);

const drawNewChat = (message) => {
  console.log(message);
  const wrapperChatBox = document.createElement('div');
  const chatBox = `
        <div>
            ${message}
        </div>
    `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

function helloUser() {
  const username = prompt('이름이 뭐에욥?');
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  });
}

// function helloUser() {
//   const username = prompt('이름이 뭐에욥?');
//   //   socket.emit('new_user', username); // socket.emit('이벤트 이름', 데이터, 콜백)
//   socket.emit('new_user', username, (data) => {
//     console.log(data); // return 한 값이 옴
//   });
//   socket.on('hello_user', (data) => {
//     console.log(data);
//   }); // socket.on('이벤트 이름', 콜백)
// }

function init() {
  helloUser();
  // 이벤트 연결
  formElement.addEventListener('submit', handleSubmit);
}

init();
