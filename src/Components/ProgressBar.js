import React from "react";
import "./ProgressBar.css";

function ProgressBar({ level, getNextLevelPoints, getLevelSrc }) {
  return (
    <div className="stepper-wrapper">
      <div className="stepper-item completed">
        <div className="step-counter">
          <img id="levelcar" src={getLevelSrc(0)} alt="car" />
        </div>
        <div className="step-name">0-1</div>
      </div>
      <div className={`stepper-item ${level > 1 ? "completed" : ""}`}>
        <div className="step-counter">
          {" "}
          <img id="levelcar" src={getLevelSrc(2)} alt="car" />
        </div>
        <div className="step-name">2-15</div>
      </div>
      <div className={`stepper-item ${level > 15 ? "completed" : ""}`}>
        <div className="step-counter">
          {" "}
          <img id="levelcar" src={getLevelSrc(16)} alt="car" />
        </div>
        <div className="step-name">16-31</div>
      </div>
      <div className={`stepper-item ${level > 31 ? "completed" : ""}`}>
        <div className="step-counter">
          {" "}
          <img id="levelcar" src={getLevelSrc(32)} alt="car" />
        </div>
        <div className="step-name">32-63</div>
      </div>
      <div className={`stepper-item ${level > 63 ? "completed" : ""}`}>
        <div className="step-counter">
          {" "}
          <img id="levelcar" src={getLevelSrc(64)} alt="car" />
        </div>
        <div className="step-name">64+</div>
      </div>
    </div>
  );
}

export default ProgressBar;
