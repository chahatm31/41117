import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  ChevronUp,
  ChevronDown,
  Trash2,
  Play,
  Pause,
  X,
} from "lucide-react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    description: "",
    dueDate: "",
    priority: "medium",
  });
  const [pomodoro, setPomodoro] = useState({
    time: 25 * 60,
    running: false,
    sessions: 0,
    goal: 4,
  });
  const [currentTab, setCurrentTab] = useState("tasks");

  useEffect(() => {
    let interval = null;
    if (pomodoro.running && pomodoro.time > 0) {
      interval = setInterval(() => {
        setPomodoro((prev) => ({ ...prev, time: prev.time - 1 }));
      }, 1000);
    } else if (pomodoro.time === 0) {
      setPomodoro((prev) => ({
        ...prev,
        running: false,
        sessions: prev.sessions + 1,
      }));
    }
    return () => clearInterval(interval);
  }, [pomodoro.running, pomodoro.time]);

  const addTask = () => {
    if (newTask.description) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({ description: "", dueDate: "", priority: "medium" });
    }
  };

  const TaskItem = ({ task, onDelete, onPriorityChange }) => (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>{task.description}</CardTitle>
        <CardDescription>
          Due: {task.dueDate} - Priority: {task.priority}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <Button variant="ghost" onClick={() => onPriorityChange(task.id, -1)}>
          <ChevronUp />
        </Button>
        <Button variant="ghost" onClick={() => onPriorityChange(task.id, 1)}>
          <ChevronDown />
        </Button>
        <Button variant="ghost" onClick={() => onDelete(task.id)}>
          <Trash2 />
        </Button>
        <Button variant="outline">
          Done <Check />
        </Button>
      </CardContent>
    </Card>
  );

  const sortedTasks = tasks.sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return (
      ["low", "medium", "high"].indexOf(b.priority) -
      ["low", "medium", "high"].indexOf(a.priority)
    );
  });

  const changePriority = (id, direction) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              priority: ["low", "medium", "high"][
                (["low", "medium", "high"].indexOf(task.priority) +
                  direction +
                  3) %
                  3
              ],
            }
          : task
      )
    );
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const taskStats = tasks.reduce(
    (acc, task) => {
      acc[task.priority]++;
      if (task.completed) acc.completed++;
      return acc;
    },
    { high: 0, medium: 0, low: 0, completed: 0 }
  );

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Add Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder="Task description"
              />
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className="p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <Button onClick={addTask}>Add Task</Button>
            </CardContent>
          </Card>
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={(id) => setTasks(tasks.filter((t) => t.id !== id))}
              onPriorityChange={changePriority}
            />
          ))}
        </TabsContent>
        <TabsContent value="pomodoro">
          <Card>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">{formatTime(pomodoro.time)}</div>
              <Button
                onClick={() =>
                  setPomodoro({ ...pomodoro, running: !pomodoro.running })
                }
              >
                {pomodoro.running ? <Pause /> : <Play />}
              </Button>
              <Button
                onClick={() =>
                  setPomodoro({
                    time: 25 * 60,
                    running: false,
                    sessions: 0,
                    goal: 4,
                  })
                }
              >
                <X />
              </Button>
              <p>
                Sessions: {pomodoro.sessions}/{pomodoro.goal}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats">
          <Card>
            <CardContent>
              <p>High Priority: {taskStats.high}</p>
              <p>Medium Priority: {taskStats.medium}</p>
              <p>Low Priority: {taskStats.low}</p>
              <p>
                Completion Rate:{" "}
                {tasks.length
                  ? Math.round((taskStats.completed / tasks.length) * 100)
                  : 0}
                %
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;