const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const leaveBtn = document.getElementById('leave-btn');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room for URL
const { username, room } =  Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//Join chatroom
socket.emit('joinRoom' , {username , room})

//Get room and users
socket.on('roomUsers' , ({ room , users}) =>{
    outputRoomName(room);
    outputUsers(users);
})

//Message from server
socket.on('message' , message => {
    console.log(message); 
    outputMessage(message);

}); 

chatForm.addEventListener('submit' , (e)=>{
    e.preventDefault();

    //Got msg text
    const msg = e.target.elements.msg.value;

    //Emit msg to server
    socket.emit('chatMessage' ,msg)

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

//Output message to DOM
function outputMessage(message)
{
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text} </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = './index.html';
    } else {
    }
  });

  //Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}