import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let x;
    let y;

    if(index < 3) {
      y = 1
    } else if (index > 2 && index < 6){
      y = 2
    } else {
      y = 3
    }

    if(index === 0 || index === 3 || index === 6 )  {
      x = 1
    } else if (index === 1 || index === 4 || index === 7 ){
      x = 2
    } else {
      x = 3
    }

    return {x:x, y:y}
  
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    
    const coords = getXY() // {x:2 , y:2}
    return `Coordinates (${coords.x}, ${coords.y})`

  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setIndex(initialIndex)
    setSteps(initialSteps)
    setEmail(initialEmail)
    setMessage(initialMessage)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    //direction left 
      //can't move left when index is 0,3 or 6
      //decrease by 1 to move left
    //direction right
      //can't move right when index is 2, 5 or 8
      //increase by 1 to move right
    //direction up
      // can't move up when index is < 3
      // you decrease by 3 to move up
    //direction down
      //can't move down when index is > 5
      //need to increase by 3 to move down

    let newIndex = index
    
    if(direction === 'left'){
      if(index !== 0 && index !== 3 && index !== 6) {
        setMessage('')
        newIndex -= 1  // newIndex = newIndex -1
      } else {
        setMessage("You can't go left")
      }
      
    } else if (direction === 'right'){
      if(index !== 2 && index !== 5 && index !== 8) {
        setMessage('')
        newIndex += 1  // newIndex = newIndex +1
      } else {
        setMessage("You can't go right")
      }

    }else if (direction === 'up') {
      if(index >= 3) {
        setMessage('')
        newIndex -= 3
      }  else {
        setMessage("You can't go up")
      }

    }else {
      if(index <= 5 ) {
        setMessage('')
        newIndex += 3
      }  else {
        setMessage("You can't go down")
      }
    }

    return newIndex

  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const newIndex = getNextIndex(evt.target.id)
    setIndex(newIndex)

    if (newIndex !== index) {
      setSteps(steps + 1)
    }

  } 
  

  function onChange(evt) {
  
    setEmail(evt.target.value)
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    const coords = getXY();
    const payload = { x: coords.x, y: coords.y, steps, email };
  
    try {
      const response = await axios.post('http://localhost:9000/api/result', payload);
      setMessage(response.data.message || 'Submission successful');
      setEmail(initialEmail)
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An unexpected error occurred';
      setMessage(errorMsg);
    }
  }
  


  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} time{steps === 1 ? '' : 's'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move} id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={email} id="email" type="email" placeholder="type email"></input>
        <input value={'Submit'} id="submit" type="submit"></input>
      </form>
    </div>
  )
}
