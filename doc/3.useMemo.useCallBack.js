import React from 'react';
import ReactDOM from 'react-dom';

// useMemo useCallBack，一般为了减少组件渲染

let Child = ({data, onButtonClick})=>{
  console.log('child render')
  return <button onClick={onButtonClick}>{data.number}</button>
}
Child = React.memo(Child)

function App(){
  const [name, setName] = React.useState('test')
  const [number, setNumber] = React.useState(0)

  // let data = { number }  // 每次渲染App组件时，都会生成一个新对象
  let data = React.useMemo(()=>({number}), [number])  // number改变时，才会重新计算data的值

  // 每次渲染时，都会生成一个新的函数
  // let addClick = () => setNumber(number+1)
  let addClick = React.useCallback(()=>setNumber(number+1), [number])

  return (
    <div>
      <input value={name} onChange={e =>{setName(e.target.value)}} />
      <Child data={data} onButtonClick={addClick} />
    </div>
  )
}

function render() {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  )
}

render()