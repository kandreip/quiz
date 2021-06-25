import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import DataFetch from "./components/DataFetch";
import axios from "axios";

const API_URL =
  "https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [score, setScore] = useState(0);
  const intervalRef = useRef(null);
  const [timer, setTimer] = useState("0");

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => res.data)
      .then((data) => {
        const questions = data.results.map((question) => ({
          ...question,
          answers: [
            question.correct_answer,
            ...question.incorrect_answers,
          ].sort(() => Math.random() - 0.5),
        }));
        setQuestions(questions);
      });
  }, []);

  const handleAnswer = (answer) => {
    if (answer === questions[currentIndex].correct_answer) {
      setScore(score + 1);
    }
    setCurrentIndex(currentIndex + 1);
  };

  const getTimeRemained = (endtime) => {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(((total / 1000) * 60 * 60) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (deadline) => {
    let { total, seconds } = getTimeRemained(deadline);
    if (total >= 0) {
      setTimer(seconds > 0 ? seconds : "0" + seconds);
    } else {
      clearInterval(intervalRef.current);
    }
  };

  const clearTimer = (endtime) => {
    setTimer("10");
    if (intervalRef.current) clearInterval(intervalRef.current);
    const id = setInterval(() => {
      startTimer(endtime);
    }, 1000);
    intervalRef.current = id;
  };

  const getDeadlineTimer = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 10);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadlineTimer());
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const onClickResetBtn = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    clearTimer(getDeadlineTimer());
  };

  const onClickRefreshPage = () => {
    window.location.reload(false);
  };

  return questions.length > 0 ? (
    <div>
      {currentIndex >= questions.length || timer === "00" ? (
        <div className="card">
          <h1 className="result">Game Ended, Your Score is {score}</h1>
          <div>
            {" "}
            <button
              className="btn-refresh"
              onClick={() => onClickRefreshPage()}
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        <>
          <DataFetch
            handleAnswer={handleAnswer}
            data={questions[currentIndex]}
            valueFromParent={currentIndex}
            timerParent={timer}
            onClickResetBtn={onClickResetBtn}
          />
        </>
      )}
    </div>
  ) : (
    <div className="container">Loading...</div>
  );
}

export default App;
