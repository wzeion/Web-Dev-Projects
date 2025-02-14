import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ text: '', x: 0, y: 0, show: false });
  const [editNote, setEditNote] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/notes')
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleBodyClick = (e) => {
    if (e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
      const offsetY = 45;
      setNewNote({ text: '', x: e.clientX, y: e.clientY - offsetY, show: true });
      setEditNote(null);
    }
  };

  const handleSaveNote = () => {
    if (newNote.text.trim()) {
      const noteData = { ...newNote };
      axios.post('http://localhost:5000/api/notes', noteData)
        .then((res) => {
          setNotes([...notes, res.data]);
          setNewNote({ text: '', x: 0, y: 0, show: false });
        })
        .catch((err) => console.error(err));
    }
  };

  const handleDeleteNote = (id) => {
    axios.delete(`http://localhost:5000/api/notes/${id}`)
      .then(() => setNotes(notes.filter(note => note.id !== id)))
      .catch((err) => console.error(err));
  };

  const handleEditNote = (note) => {
    setEditNote(note);
    setNewNote({ text: note.text, x: note.x, y: note.y, show: true });
  };

  const handleUpdateNote = () => {
    if (editNote && newNote.text.trim()) {
      const updatedNote = { ...newNote, id: editNote.id };
      axios.put(`http://localhost:5000/api/notes/${editNote.id}`, updatedNote)
        .then((res) => {
          setNotes(notes.map(note => note.id === editNote.id ? res.data : note));
          setEditNote(null);
          setNewNote({ text: '', x: 0, y: 0, show: false });
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="container">
      <header className="header">Keep Notes</header>
      <main className="body" onClick={handleBodyClick}>
        {notes.map((note, index) => (
          <div className="note" key={index} style={{ top: note.y, left: note.x }}>
            <div className="controls">
              <button onClick={() => handleEditNote(note)}>✏️</button>
              <button onClick={() => handleDeleteNote(note.id)}>🗑️</button>
            </div>
            {note.text}
          </div>
        ))}
        {newNote.show && (
          <div className="note-editor" style={{ top: newNote.y, left: newNote.x }}>
            <textarea
              value={newNote.text}
              onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
            />
            {editNote ? (
              <button onClick={handleUpdateNote}>Update Note</button>
            ) : (
              <button onClick={handleSaveNote}>Save Note</button>
            )}
          </div>
        )}
      </main>
      <footer className="footer">© 2025 Keep Notes</footer>
    </div>
  );
};

export default App;
