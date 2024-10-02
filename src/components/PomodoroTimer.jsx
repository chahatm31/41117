import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [goal, setGoal] = useState(4);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setSessions(sessions + 1);
      setTime(25 * 60);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, time, sessions]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setTime(25 * 60);
    setIsActive(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="text-4xl">{formatTime(time)}</h2>
      <div>
        <Button onClick={toggle}>{isActive ? "Pause" : "Start"}</Button>
        <Button onClick={reset} className="ml-2">
          Reset
        </Button>
      </div>
      <p>
        Completed Sessions: {sessions} / Goal: {goal}
      </p>
      <input
        type="number"
        value={goal}
        onChange={(e) => setGoal(Number(e.target.value))}
        className="w-20 mx-auto text-center"
      />
    </div>
  );
};

export default PomodoroTimer;
