import React, {Component} from 'react';
import Sound from 'react-sound';
import Speak from './Speak';

class Sounds extends Component{
  constructor(props) {
    super(props);
    this.state = {
      volume: 0,
      timer: 0,
      song: sounds.picksong("ukulele")
    }
  }
  render(){
    return(
      <div>
      {!this.props.stop &&
        <div>
        <Sound id="background-sound" url={this.state.song} playStatus={Sound.status.PLAYING} volume={this.state.volume} onFinishedPlaying={this.handleSongFinishedPlaying}/>
        {(this.state.timer === 15) &&
          <Speak text={say("snill")}/>
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
          <Speak text="Good boy" pitch="0.5" speed="0.5" volume={100}/>
        </div>
      }
      </div>
    )
  }
  componentDidMount() {
    setInterval(this.tick.bind(this), 1000);
  }
  handleSongFinishedPlaying(){
    this.setState({song: sounds.picksong("weird")})
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
  "ukulele": ["./sounds/uke/Monplaisir - Relaxing Ukulele - 01 Red Hair, Blue Sky.mp3"],
  "weird" : ["./sounds/weird/ZoneTripper.mp3","./sounds/weird/People_Skills.mp3"],
  picksong(genre){
    return getOneOf(this, genre);
  }
}

//funksjoner for snakking

var startText = {
  "snill" : ["Would you kindly", "Please", "Could you"],
  "slem" : ["", "It's about time to", "Stop being lazy and"],
  "demanding" : ["If you don't get up I will play that song that you hate. So"]
}
var endText = {
  "snill" : ["rise", "get up"],
  "slem" : ["get the heck up!", "GET UP!!"],
  "demanding" : ["get the fuck up!", "G E T U P !!"]
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
