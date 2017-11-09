import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import WebcamCapture from './components/WebcamCapture';
import Speak from './components/Speak';
import Sounds from './components/Sounds';
import Sound from 'react-sound';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: new Date()
    };
  }
  componentDidMount() {}

  render() {
    var end;
    {sessionStorage.setItem("startTid", this.state.startTime.getTime());}
    return ( <div className = "App" >
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
      alarmDateTime: null,
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
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    today.setSeconds(0);
    this.setState({
      alarmDateTime: today.getTime() + e.target.valueAsNumber,
      alarmTime: e.target.value
    })
    console.log(this.state.alarmTime)
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
    this.getLocalStorage();
  }

  render() {
    return (
      <div>
      <h1>{
        this.state.currentTime
      } </h1>
      {!this.state.fireLazers &&
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
    }
      <p>{
        "\u0020"
      }
      </p> {
        this.state.fireLazers &&
          <div>
          <Sounds stop={this.state.woke}/>
          <WebcamCapture action={this.alarmHandler} status={this.state.woke}/>
        {this.state.woke &&
            <p>Congratulations! You got up at {this.state.wokeTime} That is {this.state.wokeTime.split(":")[1] - this.state.alarmTime.split(":")[1]} minutes! {this.logStuff()}</p>
          }
          </div>
      }
      </div>
    )
  }
  logStuff() {
      var sluttTid = new Date();
      if(sessionStorage.getItem("sluttTid") < sessionStorage.getItem("startTid")){
        sessionStorage.setItem("sluttTid", sluttTid.getTime());
        localStorage.setItem(this.state.alarmDateTime,[sluttTid.getTime()]);
      }
      //console.log(sluttTid.getTime() - sessionStorage.getItem("startTid"));
  }
  // Returnerer data lagra i localstorage som array
  getLocalStorage(){
    var array = [];
    for(var x = 0; x < localStorage.length; x++){
      //console.log(localStorage.key(x) + ": " +localStorage.getItem(localStorage.key(x)))
      array.push([localStorage.key(x), localStorage.getItem(localStorage.key(x))]);
    }
    return(array);
  }
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
