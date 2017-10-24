import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import WebcamCapture from './components/WebcamCapture';
import Speak from './components/Speak';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: new Date()
    };
  }
  componentDidMount() {}

  render() {
    sessionStorage.setItem("startTid", this.state.startTime.getTime());
    var end;
    return ( <div className = "App" >
      <Speak text="Hello" />
      <Alarm />
      </div>
    );
  }
}

class Alarm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alarmTime: null,
      currentTime: null,
      fireLazers: false,
      woke: false,
      wokeTime: null
    };
    //Bindings
    this.setTime = this.setTime.bind(this);
    this.alarmHandler = this.alarmHandler.bind(this);
  }
  alarmHandler(){
      this.setState({woke: true,
        wokeTime: this.state.currentTime
      });
  }
  setTime(e) {
    e.preventDefault();
    this.setState({
      alarmTime: e.target.value
    })
  }
  tick() {
    var time = new Date();
    let minutes = time.getMinutes();
    let hours = time.getHours();
    if(minutes < 10){
      minutes = "0" + minutes;
    }
    if(hours < 10){
      hours = "0" + hours;
    }
    var timeString = hours + ":" + minutes;
    this.setState({
      currentTime: timeString
    })
    if (this.state.currentTime === this.state.alarmTime) {
      this.setState({
        fireLazers: true
      })
    }
  }
  componentDidMount() {
    setInterval(this.tick.bind(this), 1000);
  }

  render() {
    return (
      <div>
      <h1>{
        this.state.currentTime
      } </h1>
      <form >
      <label htmlFor = "appt-time" > Set wakeup time:
      </label>
      <br/>
      <input id = "appt-time"
      type = "time"
      name = "appt-time"
      defaultValue onChange = {
        this.setTime
      }
      />
      </form>
      <p>{
        "\u0020"
      } {
        this.state.alarmTime && "Alarm set to: " + this.state.alarmTime
      }
      </p> {
        this.state.fireLazers &&
          <div>
          <WebcamCapture action={this.alarmHandler} status={this.state.woke}/>
          <Speak text="wake up!" />
          {this.state.woke && <p>Congratulations! You got up at {this.state.wokeTime} That is {this.state.wokeTime.split(":")[1] - this.state.alarmTime.split(":")[1]} minutes!</p>}
          </div>
      }
      </div>
    )
  }
}

//Tar tida når man trykker på knappen. Må lagre greier i db/localstorage
function AwakeButton() {
  function handleClick(e) {
    e.preventDefault();
    var sluttTid = new Date();
    sessionStorage.setItem("sluttTid", sluttTid.getTime());
    //localStorage.setItem(sessionStorage.getItem("startTid"),[sluttTid.getTime()])
    //console.log(sluttTid.getTime() - sessionStorage.getItem("startTid"));
  }
  return ( <button onClick = {handleClick}> {
      "I'm awake"
    } </button>
  )
}

//Vise klokka på ein lesbar måte
function Time(props) {
  var timeString = props.start.getHours() + ":" + props.start.getMinutes() + ":" + props.start.getMilliseconds();
  return ( <
    h1 > {
      timeString
    } </h1>
  )
}

export default App;
