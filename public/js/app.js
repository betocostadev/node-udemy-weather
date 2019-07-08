// We will use the Fetch browser API to get the data we want
/*
// Fetch example:
fetch('http://puzzle.mead.io/puzzle').then((response) =>{
  response.json().then((data) => {
    console.log(data.puzzle)
  })
}) */

const body = document.querySelector('body');
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-one');
const messageTwo = document.querySelector('#message-two');
const messageThree = document.querySelector('#message-three');
const messageFour = document.querySelector('#message-four');
const messageFive = document.querySelector('#message-five');

// Using the geolocation API to get the data as soon as the page loads
body.addEventListener('load', navigator.geolocation.getCurrentPosition(function(position) {
  messageOne.textContent = 'Loading...'
  messageTwo.textContent = ''
  messageThree.textContent = ''
  messageFour.textContent = ''
  messageFive.textContent = ''

  if(position.coords.latitude && position.coords.longitude) {
    fetch(`/local?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          messageOne.textContent = data.error
          messageTwo.textContent = ``
        } else {
          messageOne.textContent = `Clima local`
          messageTwo.textContent = data.forecast[0]
          messageThree.textContent = data.forecast[1]
          messageFour.textContent = data.forecast[2]
          messageFive.textContent = data.forecast[3]
        }
      })
    })
  }

}));

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const location = search.value

  messageOne.textContent = 'Loading...'
  messageTwo.textContent = ''
  messageThree.textContent = ''
  messageFour.textContent = ''
  messageFive.textContent = ''

  fetch(`/weather?address=${location}`).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        messageOne.textContent = data.error
      } else {
        messageOne.textContent = data.location
        messageTwo.textContent = data.forecast[0]
        messageThree.textContent = data.forecast[1]
        messageFour.textContent = data.forecast[2]
        messageFive.textContent = data.forecast[3]
      }
    })
  })
})
