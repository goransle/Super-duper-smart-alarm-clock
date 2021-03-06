import React, { Component } from 'react';
import Webcam from 'react-webcam';
import 'tracking';
import '../face'

class WebcamCapture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: null,
    };
    //this.setState = this.setState.bind(this);
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
  tracking = () =>{
    const tracking = window.tracking;
    var video = this.video
    var canvas = this.refs.canvas
    var context = canvas.getContext('2d');

    var tracker = new tracking.ObjectTracker(['face']);
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    tracking.track(video, tracker, { camera: true });
    tracker.on('track', event => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      event.data.forEach(function(rect) {
        context.strokeStyle = '#a64ceb';
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        context.font = '11px Helvetica';
        context.fillStyle = "#fff";
        context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
      });
      if(event.data.length > 0 && !this.props.status){
        this.props.action()
      }
    });
  }
  keepCapturing(ms) {
    setInterval(this.capture.bind(this), ms);
  }
  //Funksjon for framtidig klaud-computing
  senditToTheCloud(){
      var api = "https://api-us.faceplusplus.com/humanbodypp/beta/detect?api_key=TYNhF8jSxhmAkKJVyUPPwYM9PVkcYFVr&api_secret=vj8QqBd9eXUfiS6oCBq7FSHoJYiqqiGC";
      console.log(api + "&image_base64=" + this.state.imageSrc);
    }

  componentDidMount(){
    //API å bruke:
    //https://api-us.faceplusplus.com/humanbodypp/beta/detect?api_key=TYNhF8jSxhmAkKJVyUPPwYM9PVkcYFVr&api_secret=vj8QqBd9eXUfiS6oCBq7FSHoJYiqqiGC&image_base64={imageSrc}
    // starte capture etter x sekunder for at det skal funke. Aka very good programming
    {/*this.timer = setTimeout(() => {
      this.keepCapturing(1500)
    }, 2000);*/}
    this.tracking();
  }
  componentWillUnmount(){
    clearTimeout(this.timer);
    this.tracker.removeAllListeners()
  }
  render() {
    return (
      <div>
      <Webcam
        audio={false}
        height={300}
        ref={this.setRef}
        screenshotFormat="image/jpeg"
        width={300}
      />
      <canvas ref="canvas" width="300" height="300"></canvas>
      {/*<button onClick={this.capture}>Capture photo</button>*/}
      {this.state.imageSrc && <img src={this.state.imageSrc} ref="image" />}
      </div>
    );
  }
}

export default WebcamCapture;
