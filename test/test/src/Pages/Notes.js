import React, { Fragment, useEffect, useState } from "react";
import Menu from "../Component/Menu";
import Footer from "../Component/Footer";
import Note from "../Component/Note";
import AddNotePopup from "../Component/AddNotePopUp";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../Component/Styles/AddNoteButton.css";

function Notes() {
  console.log("notes");
  const [notes, setNotes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState(true);

  const deleteNote = (noteIdToRemove) => {
    const updatedNotes = notes.filter((note) => note.noteId !== noteIdToRemove);
    setNotes(updatedNotes);
  };
  const updateNotes = (editedNote) => {
    const updatedNotes = notes.map((note) =>
      note.noteId === editedNote.noteId ? editedNote : note
    );
    setNotes(updatedNotes);
  };

  useEffect(() => {
    fetch("https://localhost:44317/api/Note/")
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, []);

  useEffect(() => {
    const userIdCookie = Cookies.get("userId");
    setIsUserSignedIn(!!userIdCookie);
  }, []);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.focus();
  };

  const addNote = (newNote) => {
    setNotes([...notes, newNote]);
    window.location.reload();
  };

  const navigate = useNavigate();

  if (!isUserSignedIn) {
    navigate("/Login");
    return null;
  }

  return (
    <Fragment>
      <Menu />
      <section className="blog_section layout_padding">
        <div className="container">
          <div className="heading_container">
            <h2>Your Notes</h2>
          </div>
          <div className="row">
            <div className="col-md-12">
              <button className="button-86" onClick={openPopup}>
                Add Note
              </button>
            </div>
          </div>
          <div className="row">
            {notes.map((note) => (
              <div key={`note_${note.noteId}`} className="col-md-6 col-lg-4">
                <Note
                  key={`note_${note.noteId}`}
                  note={note}
                  onDeleteNote={deleteNote}
                  onUpdateNotes={updateNotes}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <AddNotePopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onAddNote={addNote}
        onUpdateNote={updateNotes}
      />
      <Footer />
    </Fragment>
  );
}

export default Notes;
