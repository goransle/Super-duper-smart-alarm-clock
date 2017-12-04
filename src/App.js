import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import WebcamCapture from './components/WebcamCapture';
import Speak from './components/Speak';
import Sounds from './components/Sounds';
import Sound from 'react-sound';
import SimpleLinearRegression from 'ml-regression-simple-linear';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: new Date()
    };
  }
  componentDidMount() {
  }

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
  korrigertTid = () =>{
    if(this.state.alarmTime){
      var timer = this.state.alarmTime.split(":")[0];
      var minutter = this.state.alarmTime.split(":")[1];
      var korreksjon = Math.ceil(this.state.korreksjon/60)

      if(korreksjon < 0){
        korreksjon = 0;
      }

      var korrigerteMinutter = minutter - korreksjon;

      if(korrigerteMinutter < 10){
        korrigerteMinutter = "0" + korrigerteMinutter;
      }
      return(timer + ":" + korrigerteMinutter);
    }
    else{
      return this.state.alarmTime
    }
  }
  setTime(e) {
    e.preventDefault();
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    today.setSeconds(0);

    var korreksjon = Math.floor(this.regress(this.getLocalStorage(), e.target.valueAsNumber/1000/60));
    if(isNaN(korreksjon)){
      korreksjon = 0;
    }
    this.setState({
      alarmDateTime: today.getTime() + e.target.valueAsNumber,
      alarmTime: e.target.value,
      korreksjon: korreksjon
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
    if (this.state.currentTime === this.korrigertTid()) {
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
      {!this.state.fireLazers &&
        <div>
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
          <p>Korreksjon: {this.state.korreksjon}</p>
        </div>
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
          <p>Congratulations! You got up at {this.state.wokeTime}{this.logStuff()}</p>
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
  regress(data, time){
    var differences = [];
    var startTimes = [];
    for (var i = 0; i < data.length; i++) {
      differences.push((((data[i][1] - data[i][0]) * 0.001)));
      var startDate = new Date(data[i][0] *1);
      startTimes.push(parseFloat(startDate.getHours() * 60 + startDate.getMinutes()));
    };
    console.log(startTimes);
    console.log(differences);
    let regression = new SimpleLinearRegression(startTimes, differences);
    return(regression.predict(time));
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
