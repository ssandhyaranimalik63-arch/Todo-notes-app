import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem('tasks')) || []
  })

  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem('notes')) || []
  })

  const [task, setTask] = useState('')
  const [note, setNote] = useState('')
  const [category, setCategory] = useState('Personal')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [editTaskId, setEditTaskId] = useState(null)
  const [editNoteId, setEditNoteId] = useState(null)

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  function addTask() {
    if (!task.trim()) return

    if (editTaskId) {
      setTasks(tasks.map(item =>
        item.id === editTaskId
          ? { ...item, text: task }
          : item
      ))
      setEditTaskId(null)
    } else {
      setTasks([...tasks, {
        id: Date.now(),
        text: task,
        completed: false
      }])
    }

    setTask('')
  }

  function deleteTask(id) {
    setTasks(tasks.filter(item => item.id !== id))
  }

  function completeTask(id) {
    setTasks(tasks.map(item =>
      item.id === id
        ? { ...item, completed: !item.completed }
        : item
    ))
  }

  function addNote() {
    if (!note.trim()) return

    if (editNoteId) {
      setNotes(notes.map(item =>
        item.id === editNoteId
          ? { ...item, text: note, category }
          : item
      ))
      setEditNoteId(null)
    } else {
      setNotes([...notes, {
        id: Date.now(),
        text: note,
        category,
        date: new Date().toLocaleString()
      }])
    }

    setNote('')
  }

  function editNote(item) {
    setNote(item.text)
    setCategory(item.category)
    setEditNoteId(item.id)
  }

  function deleteNote(id) {
    setNotes(notes.filter(item => item.id !== id))
  }

  const filteredTasks = tasks.filter(item => {
    if (filter === 'Completed') return item.completed
    if (filter === 'Pending') return !item.completed
    return true
  })

  const filteredNotes = notes.filter(item =>
    item.text.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <h1>My Productivity App</h1>
      <p>Manage your tasks and notes in one place!</p>

      <section>
        <h2>My Tasks</h2>

        <input
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="Enter your task..."
        />

        <button onClick={addTask}>
          {editTaskId ? 'Update Task' : 'Add Task'}
        </button>

        <div className="filters">
          {['All', 'Pending', 'Completed'].map(value => (
            <button key={value} onClick={() => setFilter(value)}>
              {value}
            </button>
          ))}
        </div>

        <p>Total Tasks: {tasks.length}</p>
        <p>Completed: {tasks.filter(item => item.completed).length}</p>

        {filteredTasks.map(item => (
          <div className="item" key={item.id}>
            <span
              onClick={() => completeTask(item.id)}
              className={item.completed ? 'completed' : ''}
            >
              {item.text}
            </span>

            <div>
              <button onClick={() => {
                setTask(item.text)
                setEditTaskId(item.id)
              }}>
                Edit
              </button>

              <button onClick={() => deleteTask(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2>My Notes</h2>

        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Write your note..."
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option>Personal</option>
          <option>Study</option>
          <option>Work</option>
          <option>Other</option>
        </select>

        <button onClick={addNote}>
          {editNoteId ? 'Update Note' : 'Add Note'}
        </button>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notes..."
        />

        <div className="notes-grid">
          {filteredNotes.map(item => (
            <div className="item" key={item.id}>
              <div>
                <strong>{item.category}</strong>
                <p>{item.text}</p>
                <small>{item.date}</small>
              </div>

              <div>
                <button onClick={() => editNote(item)}>
                  Edit
                </button>

                <button onClick={() => deleteNote(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App