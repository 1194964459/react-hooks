import React from 'react';
import ReactDOM from 'react-dom';

// useMemo useCallBack，一般为了减少组件渲染

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

function useCallback(callback, dependencies){
  if(hookStates[hookIndex]){  // 不是第一次渲染
    let [lastCallback, lastDependencies] = hookStates[hookIndex]
    
    // 判断依赖项是否发生改变
    let same = dependencies.every((item, index)=> item === lastDependencies[index])
    if(same){
      hookIndex++
      return lastCallback
    }else{
      hookStates[hookIndex++] = [callback, dependencies]   // hookIndex = 3
      return callback
    }
  }else{  // 第一次渲染
    hookStates[hookIndex++] = [callback, dependencies]   // hookIndex = 3
    return callback
  }
}

function useMemo(factory, dependencies){
  if(hookStates[hookIndex]){  // 不是第一次渲染
    let [lastMemo, lastDependencies] = hookStates[hookIndex]
    
    // 判断依赖项是否发生改变
    let same = dependencies.every((item, index)=> item === lastDependencies[index])

    if(same){
      hookIndex++
      return lastMemo
    }else{
      let newMemo = factory()
      hookStates[hookIndex++] = [newMemo, dependencies]   // hookIndex = 3
      return newMemo
    }
  }else{  // 第一次渲染
    let newMemo = factory()
    hookStates[hookIndex++] = [newMemo, dependencies]   // hookIndex = 3
    return newMemo
  }
}

// function memo(OldFunctionComponent){
//   return class extends React.PureComponent{
//     render(){
//       return (<OldFunctionComponent {...this.props} />)
//     }
//   }
// }

let Child = ({data, onButtonClick})=>{
  console.log('child render')
  return <button onClick={onButtonClick}>{data.number}</button>
}
Child = React.memo(Child)
// Child = memo(Child)

function App(){
  const [name, setName] = useState('test')
  const [number, setNumber] = useState(0)

  // let data = { number }  // 每次渲染App组件时，都会生成一个新对象
  let data = useMemo(()=>({number}), [number])  // number改变时，才会重新计算data的值

  // 每次渲染时，都会生成一个新的函数
  // let addClick = () => setNumber(number+1)
  let addClick = useCallback(()=>setNumber(number+1), [number])

  return (
    <div>
      <input value={name} onChange={e =>{setName(e.target.value)}} />
      <Child data={data} onButtonClick={addClick} />
    </div>
  )
}

function render() {
  hookIndex = 0
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  )
}

render()