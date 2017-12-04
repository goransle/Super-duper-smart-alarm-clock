import React, {Component} from 'react';
import Sound from 'react-sound';
import Speak from './Speak';

class Sounds extends Component{
  constructor(props) {
    super(props);
    this.state = {
      volume: 0,
      timer: 0,
      song: sounds.picksong("ukulele"),
      weather: {}
    }
  }
  getWeatherData = () =>{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.openweathermap.org/data/2.5/forecast?id=3161732&units=metric&APPID=aad30aa1f0c3d793baca4e3e04a1cc35", false);
    xhr.send();
    console.log(xhr.status);
    return(xhr.response);
  }
  setWeatherData = () =>{
    var obj = JSON.parse(this.getWeatherData())
    var weatherData = {}
    console.log(obj.list[0])
    weatherData.description = obj.list[0].weather[0].description;
    weatherData.temp = obj.list[0].main.temp;
    this.setState({weather: weatherData})
  }
  render(){
    return(
      <div>
      {!this.props.stop &&
        <div>
        <Sound id="background-sound" url={this.state.song} playStatus={Sound.status.PLAYING} volume={this.state.volume} onFinishedPlaying={this.handleSongFinishedPlaying}/>
        {(this.state.timer === 15) &&
          /*<Speak text={say("snill")}/>*/
          <Speak text={"Outside there is " + this.state.weather.temp + " degrees and " + this.state.weather.description}/>
        }
        {(this.state.timer === 30) &&
          <Speak text={say("slem")}/>
        }
        {(this.state.timer === 45) &&
          <Speak text={say("demanding")}/>
        }
        </div>
      }
      {this.props.stop &&
        <div>
          <Speak text="Nice work" pitch="0.5" speed="0.5" volume={100}/>
        </div>
      }
      </div>
    )
  }
  componentDidMount() {
    setInterval(this.tick.bind(this), 1000);
    this.setWeatherData();
  }
  handleSongFinishedPlaying(){
    this.state.song();
  }
  tick(){
    if(this.state.volume < 100){
      this.easeIn();
      this.setState({timer: this.state.timer + 1});
    }
    if(this.state.timer === 60){
      this.setState({song: sounds.picksong("weird")})
    }
  }
  easeIn(){
    if(this.state.volume < 10){
      this.setState({volume: this.state.volume + 0.25})
    }
    else{
      this.setState({volume: this.state.volume + 1})
    }
  }
}

var sounds = {
  "ukulele": ["./sounds/uke/Monplaisir - Relaxing Ukulele - 01 Red Hair, Blue Sky.mp3","./sounds/uke/Monplaisir - Relaxing Ukulele - 02 Sincere Love.mp3"],
  "weird" : ["./sounds/weird/ZoneTripper.mp3","./sounds/weird/People_Skills.mp3"],
  picksong(genre){
    return getOneOf(this, genre);
  }
}

//funksjoner for snakking

var startText = {
  "snill" : ["Would you kindly", "Please", "Could you"],
  "slem" : ["", "It's about time to", "Stop being lazy and"],
  "demanding" : ["If you don't get up I will play that song that you hate. So", "I'm going to play your least favourite song if you don't "]
}
var endText = {
  "snill" : ["rise", "get up"],
  "slem" : ["get the heck up!", "GET UP!!", "get out of bed!"],
  "demanding" : ["get the heck up!", "G E T U P !!", "GEEEEET UUUUUUUP!!!"]
}
function getOneOf(obj, key) {
	var array = obj[key];
	var len = array.length;
	var index = Math.floor(len * Math.random());
	return array[index];
}

function say(attitude) {
	return(getOneOf(startText, attitude) +" " + getOneOf(endText, attitude));
}

export default Sounds;
