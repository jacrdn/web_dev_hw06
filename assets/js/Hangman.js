import React, { useState, useEffect } from 'react';
import 'milligram';

import { ch_join, ch_push,
         ch_login, ch_reset, ch_room } from './socket';



/**
 * 
 * SHIT TO ADD:
 * 
 * LOGISTICS
 * 
 * game room feature
 * 
 * change login to set up, from there players can join the game. 
 * toggle number of players 1-4
 * once the number of players marked as players are ready we can start
 * if the current body is not setup a player is automarked as an observer
 * observers cant play
 * players leave
 * 
 * 
 * 
 * PLAYER
 * have a super smash like player system
 * store state as p1, p2, p3, p4
 * 
 * STATE
 * 
 * have a map of player name to their individual states [
 * name -> {bulls, cows, lives, currentGuess, prevGuesses, wins/losses, observer/orPlayer}]
 * 
 * 
 * PASSING
 * player can pass ->  not mutate for them and just have it 
 * redisplay last state for them, with others updating?
 * 
 * 

 * 
 * 
 * TIMER 
 * want to make a Process.send_after for each game and make sure to start and restart it as needed
 * 
 * 
 */

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
  );
}

function reset() {
  console.log("Time to reset");
  ch_reset();
}

function Setup() {
  const [name, setName] = useState("");
  const [roomName, setRoom] = useState("");

  return (
    <div className="row">
      <div className="column">
      <label>Name</label>
        <input type="text"
               value={name}
               onChange={(ev) => setName(ev.target.value)}
               onKeyPress={(ev) => {if(ev.key == "Enter") {ch_login(name)
                                                           ch_room({rm: roomName})}}} 
               />
      </div>
        <div className="column">
        <label>Room</label>
          <input type="text"
                value={roomName}
                onChange={(ev) => setRoom(ev.target.value)} 
                />
        </div>
        <div className="column">
          <button onClick={() => {ch_login(name)
                                  ch_room({rm: roomName})}}>
            Join
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
    room: "",
    lastGuess: [],
    cows: 0,
    bulls: 0,
    lives: 8,
    // bulls = 4 


  });

  let {guesses, lastGuess, cows, bulls, lives, name, room} = state;

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

 if (state.name === "") {
    body = <Setup />;
  }
  else if (state.bulls == "4") {
    body = <YouWin reset={reset} />;
  }
  else if (state.lives > 0) {
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
        <div className="row">
          <div className="column">
            <p>room: {room}</p>
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
}

export default Hangman;
