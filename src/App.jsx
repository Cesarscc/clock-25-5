import { useEffect, useState } from "react";
import "./App.css";
import DecrementIcon from "./assets/DecrementIcon";
import IncrementIcon from "./assets/IncrementIcon";
import PlayIcon from "./assets/PlayIcon";
import PauseIcon from "./assets/PauseIcon";
import ResetIcon from "./assets/ResetIcon";

function App() {
  const [breakValue, setBreakValue] = useState(5);
  const [sessionValue, setSessionValue] = useState(25);
  const [timeValue, setTimeValue] = useState({ minutes: 25, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [colorText, setColorText] = useState(false);

  const alarmAudio = new Audio(
    "https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
  );

  useEffect(() => {
    const labelText = document.getElementById("timer-label");
    const timeText = document.getElementById("time-left");
    if (timeValue.minutes < 1 && !colorText) {
      labelText.classList.add("text-color");
      timeText.classList.add("text-color");
      setColorText(true);
    }
    if (timeValue.minutes >= 1 && colorText) {
      labelText.classList.remove("text-color");
      timeText.classList.remove("text-color");
      setColorText(false);
    }
  }, [timeValue, colorText]);

  useEffect(() => {
    if (isSession) {
      setTimeValue({ minutes: sessionValue, seconds: 0 });
    } else if (isBreak) {
      setTimeValue({ minutes: breakValue, seconds: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSession, isBreak]);

  const handleBreakIncrement = () => {
    if (breakValue < 60 && !isRunning) {
      setBreakValue(breakValue + 1);
      if (isBreak) setTimeValue({ minutes: breakValue + 1, seconds: 0 });
    }
  };

  const handleBreakDecrement = () => {
    if (breakValue > 1 && !isRunning) {
      setBreakValue(breakValue - 1);
      if (isBreak) setTimeValue({ minutes: breakValue - 1, seconds: 0 });
    }
  };

  const handleSessionIncrement = () => {
    if (sessionValue < 60 && !isRunning) {
      setSessionValue(sessionValue + 1);
      if (isSession) setTimeValue({ minutes: sessionValue + 1, seconds: 0 });
    }
  };

  const handleSessionDecrement = () => {
    if (sessionValue > 1 && !isRunning) {
      setSessionValue(sessionValue - 1);
      if (isSession) setTimeValue({ minutes: sessionValue - 1, seconds: 0 });
    }
  };

  const formatTime = (time) => {
    const formattedMinutes = String(time.minutes).padStart(2, "0");
    const formattedSeconds = String(time.seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    let intervalId;
    if (isRunning && isSession) {
      intervalId = setInterval(() => {
        if (timeValue.minutes === 0 && timeValue.seconds === 0) {
          clearInterval(intervalId);
          setIsSession(false);
          alarmAudio.play();
          setIsBreak(true);
        } else {
          setTimeValue((prevTime) => {
            if (prevTime.seconds === 0) {
              return {
                minutes: prevTime.minutes - 1,
                seconds: 59,
              };
            } else {
              return {
                minutes: prevTime.minutes,
                seconds: prevTime.seconds - 1,
              };
            }
          });
        }
      }, 1000);
    }
    if (isRunning && isBreak) {
      intervalId = setInterval(() => {
        if (timeValue.minutes < 1) {
          const text = document.getElementById("content-timer");
          text.classList.add("text-color");
        }
        if (timeValue.minutes === 0 && timeValue.seconds === 0) {
          clearInterval(intervalId);
          setIsBreak(false);
          alarmAudio.play();
          setIsSession(true);
          const text = document.getElementById("content-timer");
          text.classList.remove("text-color");
        } else {
          setTimeValue((prevTime) => {
            if (prevTime.seconds === 0) {
              return {
                minutes: prevTime.minutes - 1,
                seconds: 59,
              };
            } else {
              return {
                minutes: prevTime.minutes,
                seconds: prevTime.seconds - 1,
              };
            }
          });
        }
      }, 1000);
    }

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeValue, isBreak, isSession]);

  const handlePlayPause = () => {
    setIsRunning((prevState) => !prevState);
  };

  const handleReset = () => {
    setTimeValue({ minutes: 25, seconds: 0 }); // Reinicia el temporizador a 25 m por defecto
    setIsSession(true);
    setIsRunning(false); // Detiene el temporizador si estaba corriendo
    setSessionValue(25);
    setBreakValue(5);
  };

  return (
    <main>
      <h1>25 + 5 Clock</h1>
      <div id="clock">
        <div id="break-components">
          <div>
            <label id="break-label">Break Length</label>
          </div>
          <div id="break-functions">
            <i id="break-decrement" onClick={handleBreakDecrement}>
              <DecrementIcon />
            </i>
            <p id="break-length">{breakValue}</p>
            <i id="break-increment" onClick={handleBreakIncrement}>
              <IncrementIcon />
            </i>
          </div>
        </div>
        <div id="session-components">
          <div>
            <label id="session-label">Break Length</label>
          </div>
          <div id="session-functions">
            <i id="session-decrement" onClick={handleSessionDecrement}>
              <DecrementIcon />
            </i>
            <p id="session-length">{sessionValue}</p>
            <i id="session-increment" onClick={handleSessionIncrement}>
              <IncrementIcon />
            </i>
          </div>
        </div>
      </div>
      <div id="timer">
        <div id="content-timer">
          <div>
            <label id="timer-label">{isSession ? "Session" : "Break"}</label>
          </div>
          <div id="time-left">{formatTime(timeValue)}</div>
        </div>
      </div>
      <div id="options-buttons">
        <div id="start_stop" onClick={handlePlayPause}>
          <PlayIcon />
          <PauseIcon />
        </div>
        <div id="reset" onClick={handleReset}>
          <ResetIcon />
        </div>
      </div>
    </main>
  );
}

export default App;
