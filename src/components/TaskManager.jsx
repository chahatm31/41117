import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    description: "",
    dueDate: "",
    priority: "medium",
  });

  const addTask = () => {
    if (newTask.description) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({ description: "", dueDate: "", priority: "medium" });
    }
  };

  const removeTask = (id) => setTasks(tasks.filter((task) => task.id !== id));

  const changePriority = (id, direction) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              priority:
                direction === "up"
                  ? task.priority === "high"
                    ? "high"
                    : ["low", "medium", "high"][
                        ["low", "medium", "high"].indexOf(task.priority) + 1
                      ]
                  : task.priority === "low"
                  ? "low"
                  : ["low", "medium", "high"][
                      ["low", "medium", "high"].indexOf(task.priority) - 1
                    ],
            }
          : task
      )
    );
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.dueDate !== b.dueDate)
      return new Date(a.dueDate) - new Date(b.dueDate);
    return (
      ["low", "medium", "high"].indexOf(b.priority) -
      ["low", "medium", "high"].indexOf(a.priority)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Input
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          placeholder="Task Description"
        />
        <Input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <Select
          value={newTask.priority}
          onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addTask}>Add Task</Button>
      </div>
      <ul>
        {sortedTasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-2 border-b"
          >
            <span>
              {task.description} - {task.dueDate} - {task.priority}
            </span>
            <div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changePriority(task.id, "up")}
              >
                ↑
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changePriority(task.id, "down")}
              >
                ↓
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeTask(task.id)}
              >
                ✕
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
