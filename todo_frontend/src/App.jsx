import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [inputText, setInputText] = useState("")

  useEffect(() => {
    fetch('http://0.0.0.0:10000')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data)
        }
      })
      .catch(error => console.error("error fetching tasks:", error))
  }, [])


  const addTask = () => {
    if (!inputText.trim()) return
    fetch('http://0.0.0.0:10000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: inputText }),
    })
      .then(response => response.json())
      .then(newTask => {
        setTasks([...tasks, newTask])
        setInputText("")
      })
      .catch(error => console.error("error adding task:", error))
  }
const deleteTask = (id) => {
  fetch(`http://0.0.0.0:10000`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message)

    const updatedTasks = tasks.filter(item => item.id !==id)
    setTasks(updatedTasks)
  })
  .catch(error => console.error("error deleting task:", error))
}

const toggleTask = (id) => {
  fetch(`http://0.0.0.0:10000`, {
    method: 'PUT',
  })
    .then(response => response.json())
    .then(updatedTask => {
      const updatedTasks = tasks.map(item => {
        if (item.id === id) {
          return { ...item, completed: updatedTask.completed }
        }
        return item
      })
      setTasks(updatedTasks)
    })
    .catch(error => console.error("error toggling task:", error))
}


  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#ffffff', minHeight: '100vh' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>My Full-Stack Todo App</h1>
      <div style={{ marginBottom: '20px'}}>
        <input
        type="text"
        placeholder="Add a new task..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        style={{ padding: '10px', fontSize: '16px', marginRight: '10px'}}
       />
       <button onClick={addTask} style={{padding: '10px 20px', fontSize: '16px'}}>
        Add Task
       </button >
      </div>
      <ul style={{ listStyleType: 'square', paddingLeft: '20px' }}>
        {tasks.map(item => (
          <li key={item.id} style={{ margin: '15px 0', fontSize: '20px', letterSpacing: '0.5px' }}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleTask(item.id)}
              style={{ marginRight: '10px', width: '20px', height: '20px', cursor: 'pointer'}}
            />
            <span style={{
              textDecoration: item.completed ? 'line-through' : 'none',
              color: item.completed ? '#888' : '#ffffff',
              flexGrow: 1
            }}>
              {item.task}
            </span>
            <button
              onClick={() => deleteTask(item.id)}
              style={{ marginLeft: '15px', padding: '5px 10px', fontSize: '14px', cursor: 'pointer'}}
              >
                Delete
              </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
