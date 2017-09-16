import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    var start = new Date();
    sessionStorage.setItem("startTid", start.getTime());
    var end;
    return (
      <div className="App">
        <Time start={start}/>
        <AwakeButton/>
      </div>
    );
  }
}

//Tar tida når man trykker på knappen. Må lagre greier i db/localstorage
function AwakeButton(){
  function handleClick(e) {
    e.preventDefault();
    var sluttTid = new Date();
    sessionStorage.setItem("sluttTid", sluttTid.getTime());
    console.log(sluttTid.getTime() - sessionStorage.getItem("startTid"));
  }
  return(
    <button onClick={handleClick}>{"I'm awake"}</button>
  )
}

//Vise klokka på ein lesbar måte
function Time(props){
  var timeString = props.start.getHours() + ":" + props.start.getMinutes() + ":" + props.start.getMilliseconds();
  return(
    <h1>{timeString}</h1>
  )
}
export default App;
