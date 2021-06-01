import './App.css';
import {callAPI} from './Api';
import logo from './Hanzi.png'
import React, {useState, useCallback, useEffect} from 'react';
import HanziWriter from 'hanzi-writer'

const App = () =>{
  const [inputString,setInputString] = useState('爱');
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
    let writer = HanziWriter.create('character-target-div', inputString, {
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
    let definitions = await callAPI(inputString);
    definitions.forEach((item,index)=>{
      definitions[index] = JSON.parse(JSON.stringify(definitions[index]));
    })
    if(definitions[0].error){
      window.alert("The Input Character is invalid. Please input characters only in either Simplified or Traditional Chinese.");
      return;
    }
    setDefs(()=>{
      let tmpDef = [];
      definitions.forEach((item,index)=>{
        tmpDef.push(JSON.parse(JSON.stringify(item)));
      })
      return tmpDef;
    })
    document.getElementById('character-target-div').innerHTML=''; // Causes the div to be empty to prepare for new character
    for (let i = 0; i < inputString.length; i++) {
      let singleChar = inputString.charAt(i);
      let iStrLength = inputString.length;
      HanziWriter.create('character-target-div', singleChar, {
        onLoadCharDataSuccess: function(data) {
          console.log('Successfully found the character!');
        },
        onLoadCharDataError: function(reason) {
          console.log('Oh No! Something went wrong when finding the character! :(');
          window.alert("The Input Character is invalid. Please input characters only in either Simplified or Traditional Chinese.");
        },
        width: 500/iStrLength,
        height: 500/iStrLength,
        padding: 5,
        delayBetweenStrokes: 500
      }).loopCharacterAnimation();
    }
  }
  const handleInputCharChange = useCallback((event) =>{
    setInputString(event.target.value);
  },[]);

  function RenderDefsandStuff(props){
    if(typeof defs == 'undefined'){
      return null;
    }
    else
      {
        return(
          <ol>
          {defs.map((item,index)=>{
            return(
            <li key={index}>
              <ul>
                <li key={item.definition} className="list-group-item">Definition: {item.definition}</li>
                <li key={item.definition+1} className="list-group-item">Pinyin: {item.pinyin}</li>
                <li key={item.definition+2} className="list-group-item">Simplified: {item.simplified}</li>
                <li key={item.definition+3} className="list-group-item">Traditional: {item.traditional}</li>
              </ul>
            </li>
            )
          })}
          </ol>
        )}
  }

  return(
    <div >
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
          <h5 className="lead" id="meaning">Meanings</h5>
          <RenderDefsandStuff/>
        </div>
        <div className="col-sm-4 container p-3 my-3 border" id="character-target-div"></div>
      </div>
    </div>
  );
};
export default App;

