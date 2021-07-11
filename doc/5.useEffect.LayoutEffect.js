import React from 'react';
import ReactDOM from 'react-dom';

let hookStates = []  // 保存所有的状态
let hookIndex = 0 

function useState(initalState){
  hookStates[hookIndex] = hookStates[hookIndex] || initalState;
  let curIndex = hookIndex;

  function setState(newState){
    hookStates[curIndex] = newState 
    render()
  }
  return [hookStates[hookIndex++], setState]
}

function useEffect(callback, dependencies){
  if(hookStates[hookIndex]){  // 不是第一次渲染
    let lastDependencies = hookStates[hookIndex]
    let same = dependencies.every((item, index)=> item === lastDependencies[index])
    if(same){
      hookIndex++
    }else{
      hookStates[hookIndex++] = dependencies
      // 添加一个宏任务，在浏览器渲染之后执行
      setTimeout(callback)
    }
  }else{  // 第一次渲染
    hookStates[hookIndex++] = [callback, dependencies]   // hookIndex = 3
    setTimeout(callback)
  }
}

function useLayoutEffect(callback, dependencies){
  if(hookStates[hookIndex]){  // 不是第一次渲染
    let lastDependencies = hookStates[hookIndex]
    let same = dependencies.every((item, index)=> item === lastDependencies[index])
    if(same){
      hookIndex++
    }else{
      hookStates[hookIndex++] = dependencies
      // 添加一个微任务，在浏览器渲染之前执行
      queueMicrotask(callback)
    }
  }else{  // 第一次渲染
    hookStates[hookIndex++] = [callback, dependencies]   // hookIndex = 3
    queueMicrotask(callback)
  }
}

function App(){
  const [name, setName] = useState('test')
  const [number, setNumber] = useState(0)

  // React.useEffect(()=>{
  useEffect(()=>{
    document.title=number
    console.log(number)
  },[number])
  
  return(
    <div>
      <p>name：{name}</p>
      <p>number：{number}</p>
      <input value={name} onChange={e =>setName(e.target.value)} />
      <button onClick={()=>setNumber(number+1)}>+</button>
    </div>
  )
}

function Animation(){
  let red = React.useRef()  // {current:null}
  let green = React.useRef()  // {current:null}

  // 新增一个微任务，主执行栈执后，先清空微任务队列，再执行浏览器渲染（即是在浏览器渲染之前执行）
  // React.useLayoutEffect(()=>{
  useLayoutEffect(()=>{
    red.current.style.transform = 'translate(500px)'
    red.current.style.transition = 'all 500ms'
  }) 
  // 新增一个宏任务
  // React.useEffect(()=>{
  useEffect(()=>{
    green.current.style.transform = 'translate(500px)'
    green.current.style.transition = 'all 500ms'
  })
   
  let style = {width:'100px', height:'100px'}

  return (
    <div>
      <div style={{...style, backgroundColor:'red'}} ref={red}></div>
      <div style={{...style, backgroundColor:'green'}} ref={green}></div>
    </div>
  )
}


function render() {
  hookIndex = 0
  ReactDOM.render(
    // <App />,
    <Animation />,
    document.getElementById('root')
  )
}

render()