import { useState, useEffect } from "react"

import './App.css';
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import Header from './components/Header';
import Tasks from './components/Tasks';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import About from "./components/About";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);

  const TASKS_API = 'http://localhost:5000/tasks';

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }

    getTasks();
  }, []);

  // fetch tasks
  const fetchTasks = async () => {
    const res = await fetch(TASKS_API);
    return await res.json();
  }

  const fetchTask = async (id) => {
    const res = await fetch(`${TASKS_API}/${id}`);
    return await res.json();
  }

  // add task
  const addTask = async (task) => {
    const res = await fetch(TASKS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json();
    setTasks([data, ...tasks]);
  }

  // delete task
  const deleteTask = async (id) => {
    await fetch(`${TASKS_API}/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(task => task.id !== id));
  }

  // toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(`${TASKS_API}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json();

    setTasks(
      tasks.map(task =>
        task.id === id ? { ...data } : task
      ))
  }

  return (
    <Router>
      <div className="container">
        <div className="App">
          <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={!showAddTask} />

          <Route path="/" exact render={(props) => (
            <>
              {showAddTask ? <AddTask onAdd={addTask} /> : ''}
              {tasks.length ? <Tasks
                tasks={tasks}
                onDelete={deleteTask}
                onToggle={toggleReminder} />
                : 'No tasks to show'}
            </>
          )} />

          <Route path="/about" component={About} />
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
