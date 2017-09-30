import React, {
  Component
} from 'react';
import logo from './logo.svg';
import './App.css';
import WebcamCapture from './components/WebcamCapture'

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
      <Time start = {
        this.state.startTime
      }/>
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
      fireLazers: false
    };
    this.setTime = this.setTime.bind(this);
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
    var timeString = time.getHours() + ":" + minutes;
    console.log(timeString)
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
      <p> The time is: {
        this.state.currentTime
      } </p>
      <form >
      <label htmlFor = "appt-time" > Set wakeup time:
      </label>
      <input id = "appt-time"
      type = "time"
      name = "appt-time"
      defaultValue onChange = {
        this.setTime
      }
      />
      </form>
      <p> Alarm set to: {
        "\u0020"
      } {
        this.state.alarmTime && this.state.alarmTime
      }
      </p> {
        this.state.fireLazers &&
          <div>
          <
          WebcamCapture / > { /*<iframe width="420" height="345" src="http://www.youtube.com/embed/SGyOaCXr8Lw?start=5&autoplay=1" frameborder="0" allowfullscreen></iframe>*/ }
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
    console.log(sluttTid.getTime() - sessionStorage.getItem("startTid"));
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
