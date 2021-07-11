import React from 'react';
import ReactDOM from 'react-dom';

let lastState;  // 上一个状态 
function useState(initalState){
  lastState = lastState || initalState

  function setState(newState){
    lastState = newState
    render()
  }

  return [lastState, setState]
}

function Counter(){
  let [number, setNumber] = useState(0)

  return (
    <div>
      <p>{number}</p>
      <button onClick={()=>{setNumber(number+1)}}>+</button>
    </div>
  )
}

function render() {
  ReactDOM.render(
    <Counter />,
    document.getElementById('root')
  )
}

render()