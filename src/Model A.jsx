import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskManager from "./components/TaskManager";
import PomodoroTimer from "./components/PomodoroTimer";
import Statistics from "./components/Statistics";

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <TaskManager />
        </TabsContent>
        <TabsContent value="pomodoro">
          <PomodoroTimer />
        </TabsContent>
        <TabsContent value="stats">
          <Statistics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
