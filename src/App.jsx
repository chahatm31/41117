import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
  CheckCircle,
  Circle,
  Play,
  Pause,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Clock,
  List,
  BarChart,
} from "lucide-react";

const TaskItem = ({ task, onToggleComplete, onDelete, onChangePriority }) => (
  <div className="flex items-center justify-between p-3 border-b hover:bg-gray-50 transition-colors">
    <div className="flex items-center space-x-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleComplete(task.id)}
      >
        {task.completed ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </Button>
      <div className="flex flex-col">
        <span
          className={`text-lg ${
            task.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {task.text}
        </span>
        <span className="text-sm text-gray-500">
          {task.date} - Priority: {task.priority}
        </span>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <div className="flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChangePriority(task.id, "up")}
          disabled={task.priority === "high"}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChangePriority(task.id, "down")}
          disabled={task.priority === "low"}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const TaskList = ({ tasks, onToggleComplete, onDelete, onChangePriority }) => (
  <div className="mt-4 max-h-96 overflow-y-auto">
    {tasks.map((task) => (
      <TaskItem
        key={task.id}
        task={task}
        onToggleComplete={onToggleComplete}
        onDelete={onDelete}
        onChangePriority={onChangePriority}
      />
    ))}
  </div>
);

const PomodoroTimer = ({
  isRunning,
  timeLeft,
  onToggle,
  onReset,
  onCustomTimeSet,
}) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Pomodoro Timer</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-5xl font-bold text-center mb-6">
        {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <Button onClick={onToggle} className="w-32">
          {isRunning ? (
            <Pause className="h-5 w-5 mr-2" />
          ) : (
            <Play className="h-5 w-5 mr-2" />
          )}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="outline" onClick={onReset} className="w-32">
          <RotateCcw className="h-5 w-5 mr-2" />
          Reset
        </Button>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Label htmlFor="custom-time">Custom Time (minutes):</Label>
        <Input
          id="custom-time"
          type="number"
          min="1"
          max="60"
          className="w-20"
          onChange={(e) => onCustomTimeSet(parseInt(e.target.value, 10))}
        />
      </div>
    </CardContent>
  </Card>
);

const ProgressBar = ({ completed, total }) => (
  <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
    <div
      className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
      style={{ width: `${(completed / total) * 100}%` }}
    ></div>
  </div>
);

const PriorityDistribution = ({ tasks }) => {
  const priorityCount = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  const total = tasks.length;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Priority Distribution</h3>
      {["high", "medium", "low"].map((priority) => (
        <div key={priority} className="flex items-center mb-2">
          <div className="w-20 capitalize">{priority}:</div>
          <div className="flex-grow bg-gray-200 h-4 rounded-full">
            <div
              className={`h-4 rounded-full ${
                priority === "high"
                  ? "bg-red-500"
                  : priority === "medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{
                width: `${((priorityCount[priority] || 0) / total) * 100}%`,
              }}
            ></div>
          </div>
          <div className="w-12 text-right">
            {Math.round(((priorityCount[priority] || 0) / total) * 100)}%
          </div>
        </div>
      ))}
    </div>
  );
};

const TaskCompletion = ({ tasks }) => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Task Completion</h3>
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-6">
          <div
            className="bg-green-500 h-6 rounded-full text-center text-white text-sm leading-6"
            style={{ width: `${completionPercentage}%` }}
          >
            {completionPercentage}%
          </div>
        </div>
      </div>
      <div className="text-center mt-2">
        {completedTasks} of {totalTasks} tasks completed
      </div>
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [taskDate, setTaskDate] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(4);
  const [activeTab, setActiveTab] = useState("tasks");

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setSessionsCompleted((prevSessions) => prevSessions + 1);
      setTimeLeft(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const addTask = () => {
    if (newTask.trim() && taskDate) {
      setTasks((prevTasks) => {
        const newTaskObj = {
          id: Date.now(),
          text: newTask,
          completed: false,
          priority,
          date: taskDate,
        };
        const updatedTasks = [...prevTasks, newTaskObj];
        return sortTasks(updatedTasks);
      });
      setNewTask("");
      setTaskDate("");
    }
  };

  const sortTasks = (tasksToSort) => {
    return tasksToSort.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      sortTasks(
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) =>
      sortTasks(prevTasks.filter((task) => task.id !== id))
    );
  };

  const changePriority = (id, direction) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.id === id) {
          const priorities = ["low", "medium", "high"];
          const currentIndex = priorities.indexOf(task.priority);
          const newIndex =
            direction === "up"
              ? Math.min(currentIndex + 1, 2)
              : Math.max(currentIndex - 1, 0);
          return { ...task, priority: priorities[newIndex] };
        }
        return task;
      });
      return sortTasks(updatedTasks);
    });
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const setCustomTime = (minutes) => {
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Productivity Master
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="tasks">
              <List className="mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="pomodoro">
              <Clock className="mr-2" />
              Pomodoro
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart className="mr-2" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="Enter a new task"
                      className="flex-grow"
                    />
                    <Input
                      type="date"
                      value={taskDate}
                      onChange={(e) => setTaskDate(e.target.value)}
                      className="w-40"
                    />
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addTask}>Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <TaskList
              tasks={tasks}
              onToggleComplete={toggleComplete}
              onDelete={deleteTask}
              onChangePriority={changePriority}
            />
          </TabsContent>

          <TabsContent value="pomodoro">
            <PomodoroTimer
              isRunning={isRunning}
              timeLeft={timeLeft}
              onToggle={toggleTimer}
              onReset={resetTimer}
              onCustomTimeSet={setCustomTime}
            />

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Daily Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span>Sessions Completed: {sessionsCompleted}</span>
                  <span>Goal: {dailyGoal}</span>
                </div>
                <ProgressBar completed={sessionsCompleted} total={dailyGoal} />
                <div className="mt-4">
                  <Label htmlFor="daily-goal">Adjust Daily Goal</Label>
                  <Slider
                    id="daily-goal"
                    min={1}
                    max={10}
                    step={1}
                    value={[dailyGoal]}
                    onValueChange={(value) => setDailyGoal(value[0])}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Task Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <PriorityDistribution tasks={tasks} />
                <TaskCompletion tasks={tasks} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}