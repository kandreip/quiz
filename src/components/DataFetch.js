import React from "react";

function DataFetch({
  handleAnswer,
  data: { question, answers },
  valueFromParent,
  timerParent,
  onClickResetBtn,
}) {
  return (
    <div className="card">
      <div className="question-section">
        <div className="question-count">
          <div>
            Question {valueFromParent + 1}/<span>10</span>
          </div>
          <div className="timer">{timerParent}</div>
        </div>
        <div>
          <p dangerouslySetInnerHTML={{ __html: question }} />
        </div>
      </div>
      <div className="answers-list">
        {answers.map((answer, idx) => {
          return (
            <button
              key={idx}
              className={"btn"}
              onClick={() => {
                handleAnswer(answer);
                onClickResetBtn();
              }}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DataFetch;
