import React from 'react';
import ReactDOM from 'react-dom';

let hookStates = []  // 保存所有的状态
let hookIndex = 0 

function useState(initalState){
  hookStates[hookIndex] = hookStates[hookIndex] || initalState;
  let curIndex = hookIndex;

  function setState(newState){
    // console.log('curIndex', curIndex)
    hookStates[curIndex] = newState 
    render()
  }

  return [hookStates[hookIndex++], setState]
}

function Counter(){
  let [number1, setNumber1] = useState(0)
  let [number2, setNumber2] = useState(0)
  // let [number1, setNumber1] = React.useState(0)
  // let [number2, setNumber2] = React.useState(0)

  return (
    <div>
      <p>{number1}</p>
      <button onClick={()=>{setNumber1(number1+1)}}>+</button>
      <hr/>
      <p>{number2}</p>
      <button onClick={()=>{setNumber2(number2+1)}}>+</button>
    </div>
  )
}

function render() {
  hookIndex = 0
  ReactDOM.render(
    <Counter />,
    document.getElementById('root')
  )
}

render()