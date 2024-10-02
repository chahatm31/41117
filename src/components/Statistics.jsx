import React from "react";

const Statistics = ({ tasks }) => {
  const priorityDistribution =
    tasks?.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {}) || {};

  const completionRate = tasks?.length
    ? ((tasks.filter((t) => t.completed).length / tasks.length) * 100).toFixed(
        2
      )
    : "0.00";

  return (
    <div>
      <h3 className="text-xl mb-2">Task Statistics</h3>
      <p>High Priority: {priorityDistribution.high || 0}</p>
      <p>Medium Priority: {priorityDistribution.medium || 0}</p>
      <p>Low Priority: {priorityDistribution.low || 0}</p>
      <p>Completion Rate: {completionRate}%</p>
    </div>
  );
};

export default Statistics;
