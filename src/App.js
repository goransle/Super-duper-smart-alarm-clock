import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Webcam from 'react-webcam';
import 'tracking';
import './face'

class App extends Component {
  componentDidMount(){
  }

  render() {
    var start = new Date();
    sessionStorage.setItem("startTid", start.getTime());
    var end;
    return (
      <div className="App">
      <Time start={start}/>
        {/*<Alarm />
        <AwakeButton/>*/}
        {/*<Webcam />*/}
        <WebcamCapture />
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
      //localStorage.setItem(sessionStorage.getItem("startTid"),[sluttTid.getTime()])
      console.log(sluttTid.getTime() - sessionStorage.getItem("startTid"));
    }
    return(
      <button onClick={handleClick}>{"I'm awake"}</button>
    )
  }

  function Alarm(props){
    return(
      <div>Time to get up!!</div>
    )
  }

  //Vise klokka på ein lesbar måte
  function Time(props){
    var timeString = props.start.getHours() + ":" + props.start.getMinutes() + ":" + props.start.getMilliseconds();
    return(
      <h1>{timeString}</h1>
    )
  }

  //webcam
  class WebcamCapture extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        imageSrc: null,
        tab: 0
      };
    }
    setRef = (webcam) => {
      this.webcam = webcam;
      this.video = "video";
    }

    capture = () => {
      const imageSrc = this.webcam.getScreenshot();
      //console.log(imageSrc);
      this.setState({ imageSrc });
      //this.senditToTheCloud();
    };
    tracking(){
      const tracking = window.tracking;
      var video = this.video
      var canvas = this.refs.canvas
      var context = canvas.getContext('2d');

      var tracker = new tracking.ObjectTracker(['face']);
      tracker.setInitialScale(4);
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);

      tracking.track(video, tracker, { camera: true });
      tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
          context.strokeStyle = '#a64ceb';
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
          context.font = '11px Helvetica';
          context.fillStyle = "#fff";
          context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
          context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
          //console.log("I see ur face")
        });
      });
    }
    keepCapturing(ms) {
      setInterval(this.capture.bind(this), ms);
    }
    senditToTheCloud(){
      var api = "https://api-us.faceplusplus.com/humanbodypp/beta/detect?api_key=TYNhF8jSxhmAkKJVyUPPwYM9PVkcYFVr&api_secret=vj8QqBd9eXUfiS6oCBq7FSHoJYiqqiGC";
      console.log(api + "&image_base64=" + this.state.imageSrc);
    }

    componentDidMount(){
      //API å bruke:
      //https://api-us.faceplusplus.com/humanbodypp/beta/detect?api_key=TYNhF8jSxhmAkKJVyUPPwYM9PVkcYFVr&api_secret=vj8QqBd9eXUfiS6oCBq7FSHoJYiqqiGC&image_base64={imageSrc}
      // starte capture etter x sekunder for at det skal funke. Aka very good programming
      this.timer = setTimeout(() => {
        this.keepCapturing(1500)
      }, 2000);
      this.tracking();
    }
    componentWillUnmount(){
      clearTimeout(this.timer);
    }
    render() {
      return (
        <div>
        <Webcam
          audio={false}
          height={500}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={500}
        />
        {/*<button onClick={this.capture}>Capture photo</button>*/}
        {/*this.state.imageSrc && <img src={this.state.imageSrc} ref="image" />*/}
        <canvas ref="canvas" width="500" height="500"></canvas>
        </div>
      );
    }
  }

  export default App;
