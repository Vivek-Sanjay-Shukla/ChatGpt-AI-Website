import bot from '../client/assets/bot.svg';
import user from './assets/user.svg';


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container')

// To show that ourwebsite is loading some data
let loadInterval;

function loader(element) {
  element.textContent = ''

  loadInterval = setInterval(() => {
      // Update the text content of the loading indicator
      element.textContent += '.';

      // If the loading indicator has reached three dots, reset it
      if (element.textContent === '....') {
          element.textContent = '';
      }
  }, 300);
}

// for typing the data
function typeText(element, text) {
  let index = 0

  let interval = setInterval(() => {
      if (index < text.length) {
          element.innerHTML += text.charAt(index)
          index++
      } else {
          clearInterval(interval)
      }
  }, 20)
}

// to get unique id for all the meassages to iterate ove them
function generateuniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}


function chatStripe(isAi,value,uniqueId){
    return(
      `
             <div class="wrapper ${isAi && 'ai'} ${!isAi && 'user'}">
           <div class="chat">
             <div class="profile">
              <img src = ${isAi ? bot : user}
                alt = "${isAi ? 'bot' :'user'}"
              />
            </div>
            <div class="message" id=${uniqueId}>${value}</div>
          </div>
        </div>
      `
    )
}



const handleSubmit = async (e) => {

  // to prevent the browser from refreshing when we ask something
  e.preventDefault()

  const data = new FormData(form)

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

  // to clear the textarea input 
  form.reset()

  // bot's chatstripe
  const uniqueId = generateuniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

  // to focus scroll to the bottom 
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // specific message div 
  const messageDiv = document.getElementById(uniqueId)

  // messageDiv.innerHTML = "..."
  loader(messageDiv);


  // fetch data from server

  const response = await fetch('http://localhost:5000',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      prompt:data.get('prompt')
    })
  })

  clearInterval(loadInterval);

  messageDiv.innerHTML = '';

  if(response.ok){
    const data = await response.json();
    const parseData = data.bot.trim();
    typeText(messageDiv,parseData);
  }
  else{
    const err  =await response.text();
    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
}

form.addEventListener('submit',handleSubmit);
form.addEventListener('keyup',(e) => {
  if(e.keyCode=== 13){
    handleSubmit(e);
  }
});