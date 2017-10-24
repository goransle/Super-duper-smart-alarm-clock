import React, {Component} from 'react';

class Speak extends Component{
  constructor(props) {
    super(props);
  }
  render(){
      var speak = () =>{
        var myUtterance = new SpeechSynthesisUtterance();

        myUtterance.text = this.props.text;
        myUtterance.pitch = 1;  // accepted values: 0-2 inclusive, default value: 1
        myUtterance.rate = 1.5; // accepted values: 0.1-10 inclusive, default value: 1
        myUtterance.volume = 1; // accepted values: 0-1, default value: 1
        speechSynthesis.speak(myUtterance)
      }
      return(
        <div>
        {speak()}
        </div>
      )
  }
}

export default Speak;
