import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [response, setResponse] = useState(null)

  fetch('http://localhost:3001/',)
      .then(res => {
        //throw error if cannot find server
        if(res.status >= 400){
          throw new Error("server responds with error");
        }
        return res.json();
      })
      .then(res => {
        // set the state response variable to the string inside the res json object labeled under 'info'
        console.log(res);
        setResponse(res['info'])
      },
      err => {
        // catch error 
        console.log(err);
      });


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {response}
      </header>
    </div>
  );
}

export default App;
