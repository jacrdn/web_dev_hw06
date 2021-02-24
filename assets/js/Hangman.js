import React, { useState, useEffect } from 'react';
import 'milligram';

import { ch_join, ch_push,
         ch_login, ch_reset } from './socket';

// BASED FUNCTION ON NAT TUCKS LECTURE CODE
function SetTitle({text}) {
  useEffect(() => {
    let orig = document.title;
    document.title = text;

    // Cleanup function
    return () => {
      document.title = orig;
    };
  });

  return <div />;
}

// handles game losing 
function GameOver(props) {
  let {reset} = props;

  return (
    <div className="row">
      <SetTitle text="Game Over!" />
      <div className="column">
        <h1>Game Over!</h1>
        <p>
          <button onClick={reset}>
            Reset
          </button>
        </p>
      </div>
    </div>
  );
}
// END ATTRIBUTION 


// handles game winning
function YouWin(props) {
  let {reset} = props;

  return (
    <div className="row">
      <SetTitle text="You win!" />
      <div className="column">
        <h1>You win!</h1>
        <p>
          <button onClick={reset}>
            Reset
          </button>
        </p>
      </div>
    </div>
  );
}

function Controls({guess, reset}) {
  // WARNING: State in a nested component requires
  // careful thought.
  // If this component is ever unmounted (not shown
  // in a render), the state will be lost.
  // The default choice should be to put all state
  // in your root component.
  const [text, setText] = useState("");

  function updateText(ev) {
    let tx = ev.target.value;
    if (tx.length > 4) {
      tx = "";
    }
    setText(tx);
  }

  function keyPress(ev) {
    if (ev.key == "Enter") {
      guess(text);
      setText("")
    }
  }

  return (
    <div className="row">
      <div className="column">
        <p>
          <input type="number"
                 value={text}
                 onChange={updateText}
                 onKeyPress={keyPress} />
        </p>
      </div>
      <div className="column">
        <p>
          <button onClick={() => {guess(text)
                                  setText("")}}>Guess</button>
        </p>
      </div>
      <div className="column">
        <p>
          <button onClick={reset}>
            Reset
          </button>
        </p>
      </div>
    </div>
  );}

function reset() {
  console.log("Time to reset");
  ch_reset();
}
/** 
function Play({state}) {
  let {word, guesses, name} = state;

  function guess(text) {
    // Inner function isn't a render function
    ch_push({letter: text});
  }

  let view = word.split('');
  let bads = [];

  // FIXME: Correct guesses shouldn't count.
  let lives = 8 - guesses.length;

  return (
    <div>
      <div className="row">
        <div className="column">
          <p>Word: {view.join(' ')}</p>
        </div>
        <div className="column">
          <p>Name: {name}</p>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <p>Guesses: {guesses.join(' ')}</p>
        </div>
        <div className="column">
          <p>Lives: {lives}</p>
        </div>
      </div>
      <Controls reset={reset} guess={guess} />
    </div>
  );
}
*/

function Login() {
  const [name, setName] = useState("");

  return (
    <div className="row">
      <div className="column">
        <input type="text"
               value={name}
               onChange={(ev) => setName(ev.target.value)} />
      </div>
      <div className="column">
        <button onClick={() => ch_login(name)}>
          Login
        </button>
      </div>
    </div>
  );
}

function Hangman() {
  // render function,
  // should be pure except setState
  // const [state, setState] = useState({
  //   name: "",
  //   word: "",
  //   guesses: [],
  // });

  // useEffect(() => {
  //   ch_join(setState);
  // });

  // let body = null;

  // render function,
  // should be pure except setState
  const [state, setState] = useState({

    // guesses: [],
    name: "",
    secret: "",
    lastGuess: [],
    cows: 0,
    bulls: 0,
    lives: 8
    // bulls = 4 
  });

  let {secret, guesses, lastGuess, cows, bulls, lives, name} = state;

  useEffect(() => {
    ch_join(setState);
  });

  function guess(text) {
    ch_push({gs: text});
  }

  function reset() {
    ch_reset();
  }

  let body = null;

 if (name === "") {
    body = <Login />;
  }
  else if (bulls == "4") {
    body = <YouWin reset={reset} />;
  }
  else if (lives > 0) {
    // BASED THIS ON NAT TUCKS LECTURE CODE
    body = (
      <div>
        <div className="row">
          <div className="column">
            <p>Lives: {lives}</p>
          </div>
          <div className="column">
            <p>Cows: {cows}</p>
          </div>
          <div className="column">
            <p>Bulls: {bulls}</p>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <p>last guess: {lastGuess}</p>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <p>name: {name}</p>
          </div>
        </div>
        <Controls reset={reset} guess={guess} />
      </div>
    )
    // END ATTRIBUTION
  }
  else {
    body = <GameOver reset={reset} />;
  }
  return (
    <div className="container">
      {body}
    </div>
  );


  // if (state.name === "") {
  //   body = <Login />;
  // }
  // // FIXME: Correct guesses shouldn't count.
  // else if (lives > 0) {
  //   body = <Play state={state} />;
  // }
  // else {
  //   body = <GameOver reset={reset} />;
  // }

  // return (
  //   <div className="container">
  //     {body}
  //   </div>
  // );
}

export default Hangman;
