import './App.css';
import {callAPI} from './Api';
import logo from './Hanzi.png'
import React, {useState, useCallback, useEffect} from 'react';
import HanziWriter from 'hanzi-writer'

const App = () =>{
  const [inputChar,setInputChar] = useState('爱');
  let [defs,setDefs] = useState(()=>{
    let tmp = JSON.stringify({
      definition:"to love/affection/to be fond of/to like",
      pinyin:"ai4",
      simplified:"爱",
      traditional:"愛"})
    let defObj = JSON.parse(tmp);
    return [defObj];
  });//Definition and Description
  useEffect(()=>{
    console.log("In UseEffect");
    let writer = HanziWriter.create('character-target-div', inputChar, {
      width: 500,
      height: 500,
      padding: 5,
      delayBetweenStrokes: 500
    });
    writer.loopCharacterAnimation();
  },[])
  //[{definition:"",pinyin:"",Simplified:"",Traditional:""}]
  const formSubmitted = async (event) =>{
    event.preventDefault();
    let definitions = await callAPI(inputChar);
    definitions.forEach((item,index)=>{
      definitions[index] = JSON.parse(JSON.stringify(definitions[index]));
    })
    if(definitions[0].error){
      console.log("caught");
      window.alert("The Input Character is invalid. Please input a single character only in either Simplified or Traditional Chinese.");
      return;
    }
    setDefs(()=>{
      defs = definitions.slice()
    })
    document.getElementById('character-target-div').innerHTML=''; // Causes the div to be empty to prepare for new character
    let writer = HanziWriter.create('character-target-div', inputChar, {
      onLoadCharDataSuccess: function(data) {
        console.log('Successfully found the character!');
      },
      onLoadCharDataError: function(reason) {
        console.log('Oh No! Something went wrong when finding the character! :(');
        window.alert("The Input Character is invalid. Please input a single character only in either Simplified or Traditional Chinese.");
      },
      width: 500,
      height: 500,
      padding: 5,
      delayBetweenStrokes: 500
    });
    writer.loopCharacterAnimation();
  }
  const handleInputCharChange = useCallback((event) =>{
    setInputChar(event.target.value);
  },[]);

  return(
    <div>
      <nav className="navbar navbar-expand-sm bg-light navbar-dark justify-content-center">
        <img className="navbar-brand" src={logo} alt ="logo"></img>
        <div className="form-inline">
          <form onSubmit = {formSubmitted}>
            <label htmlFor="inputChar"></label>
            <input
              type="text"
              id = "inputChar"
              name = "inputChar"
              placeholder = "Search For a Character..."
              onChange={handleInputCharChange}
            />
            <button className="btn btn-success" type="submit">Search</button>
          </form>
          </div>
      </nav>
      <div className="row">
        <div className="col-sm-8 container p-3 my-3 border">
        </div>
        <div className="col-sm-4 container p-3 my-3 border" id="character-target-div"></div>
      </div>
    </div>
  );
};


export default App;

