import React, {Component} from 'react';

class Speak extends Component{
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    return(
      this.speak(this.props.text)
    )
  }
  render(){
    return(
      <div>
      </div>)
  }
  speak = (text) =>{
    var myUtterance = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    console.log(voices);

    myUtterance.text = text;
    myUtterance.pitch = 1;  // accepted values: 0-2 inclusive, default value: 1
    myUtterance.rate = 1.5; // accepted values: 0.1-10 inclusive, default value: 1
    //myUtterance.volume = 1; // accepted values: 0-1, default value: 1
    myUtterance.voice = voices[1];

    if(this.props.pitch){
      myUtterance.pitch = this.props.pitch;
    }
    if(this.props.speed){
      myUtterance.rate = this.props.speed;
    }
    if(this.props.volume){
      myUtterance.volume = this.props.volume;
    }
    myUtterance.onend = function(e) {
      console.log('Finished in ' + e.elapsedTime + ' seconds.');
    };
    speechSynthesis.speak(myUtterance)
  }
}

export default Speak;
