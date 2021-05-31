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
  let [sDefinition,setSDefinition] = useState(()=>{
    return defs[0].definition;
  })
  let [sPinyin,setSPinyin] = useState(()=>{
    return defs[0].pinyin;
  })
  let [sTraditional,setSTraditional] = useState(()=>{
    return defs[0].traditional;
  })
  let [sSimplified,setSSimplified] = useState(()=>{
    return defs[0].simplified;
  })

  /*useEffect(()=>{
    setSDefinition(()=>{
      return defs[0].definition;
    });
    setSPinyin(()=>{
      return defs[0].pinyin;
    });
    setSTraditional(()=>{
      return defs[0].traditional;
    })
    setSSimplified(()=>{
      return defs[0].simplified;
    })
  },[defs])*/

  useEffect(()=>{
    console.log("In UseEffect");
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
      console.log("caught");
      window.alert("The Input Character is invalid. Please input a single character only in either Simplified or Traditional Chinese.");
      return;
    }
    setDefs(()=>{
      defs = [];
      definitions.forEach((item,index)=>{
        defs.push(JSON.parse(JSON.stringify(item)));
      })
      console.log(defs);
      setSDefinition(()=>{
        return defs[0].definition;
      });
      setSPinyin(()=>{
        return defs[0].pinyin;
      });
      setSTraditional(()=>{
        return defs[0].traditional;
      })
      setSSimplified(()=>{
        return defs[0].simplified;
      })
    })
    document.getElementById('character-target-div').innerHTML=''; // Causes the div to be empty to prepare for new character
    for (let i = 0; i < inputString.length; i++) {
      let singleChar = inputString.charAt(i);
      HanziWriter.create('character-target-div', singleChar, {
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
      }).loopCharacterAnimation();
    }
  }
  const handleInputCharChange = useCallback((event) =>{
    setInputString(event.target.value);
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
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Definition: {sDefinition}</li>
            <li className="list-group-item">Pinyin: {sPinyin}</li>
            <li className="list-group-item">Simplified: {sSimplified}</li>
            <li className="list-group-item">Traditional: {sTraditional}</li>
          </ul>
        </div>
        <div className="col-sm-4 container p-3 my-3 border" id="character-target-div"></div>
      </div>
    </div>
  );
};


export default App;

