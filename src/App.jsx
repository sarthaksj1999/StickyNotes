import './App.css';
import { IoAdd, IoSettingsOutline, IoClose, IoSearch, IoCheckmark, IoList, IoTrash, IoEllipsisHorizontal } from 'react-icons/io5';
import Btn from './components/Btn';
import { useState, useEffect } from 'react';

export default function App() {
  // Default structure for a new note
  const blankNote = {
    text: '', // Initially, the note text is empty
    createdon: null, // Created date will be set when the note is added
    bgcolor: '#feff9c', // Default background color for the note
    view: true, // View flag indicates if the note is visible or not
    options: false // Options flag indicates whether options for the note are shown
  };

  // Array of color options for the background of the notes
  const colorArr = ['#feff9c', '#ddc2f2', '#e4eeff', '#f8c8d4', '#ffdf9c', '#b8f0b3', '#ffb3b3', '#d1f7ff', '#fff2e6', '#e0f7d4', '#c6e2f2', '#ffd9b3'];

  // State variables to manage the app's data
  const [notes, setNotes] = useState([]); // Store the list of notes
  const [listview, setListview] = useState(true); // Flag for list view (toggle between list and card view)
  const [search, setSearch] = useState(''); // State for storing the search query
  const [filternotes, setFilternotes] = useState([]); // Store filtered notes based on the search query

  // Effect hook to filter notes whenever the search query or notes list changes
  useEffect(() => {
    if (search !== '') {
      // Filter notes by checking if their text includes the search query (case insensitive)
      const filtered = notes.filter(note => note.text.toLowerCase().includes(search.toLowerCase()));
      setFilternotes(filtered);
    } else {
      setFilternotes(notes); // If search is empty, show all notes
    }
  }, [search, notes]); // Dependency on search and notes for re-running the effect

  // Load notes from localStorage when the app first loads
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes'); // Retrieve notes from localStorage
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes)); // If notes exist, parse them and set the state
    }
  }, []);

  // Function to save notes to localStorage
  const saveNotesToLocalStorage = (newNotes) => {
    localStorage.setItem('notes', JSON.stringify(newNotes)); // Save notes array to localStorage
  };

  // Function to add a new note
  const addNote = (val = blankNote) => {
    let newNotes = [...notes]; // Create a copy of the current notes
    val.createdon = (new Date()).toDateString(); // Set the creation date of the note
    newNotes.push(val); // Add the new note to the list
    setNotes(newNotes); // Update the state with the new notes list
    saveNotesToLocalStorage(newNotes); // Save the updated notes to localStorage
  };

  // Function to update the text of an existing note
  const updateNote = (val = blankNote, i) => {
    let newNotes = [...notes]; // Create a copy of the current notes
    newNotes[i].text = val; // Update the text of the note at index 'i'
    setNotes(newNotes); // Update the state with the modified notes
    saveNotesToLocalStorage(newNotes); // Save the updated notes to localStorage
  };

  // Function to update the background color of an existing note
  const updateColor = (val = blankNote, i) => {
    let newNotes = [...notes]; // Create a copy of the current notes
    newNotes[i].bgcolor = val; // Update the background color of the note at index 'i'
    setNotes(newNotes); // Update the state with the modified notes
    saveNotesToLocalStorage(newNotes); // Save the updated notes to localStorage
  };

  // Function to toggle the visibility (view) of a note
  const updateView = (i) => {
    let newNotes = [...notes]; // Create a copy of the current notes
    newNotes[i].view = !newNotes[i].view; // Toggle the 'view' property
    setNotes(newNotes); // Update the state with the modified notes
    saveNotesToLocalStorage(newNotes); // Save the updated notes to localStorage
  };

  // Function to toggle the options (edit, delete) menu for a note
  const updateOpt = (i) => {
    let newNotes = [...notes]; // Create a copy of the current notes
    newNotes[i].options = !newNotes[i].options; // Toggle the 'options' menu visibility
    setNotes(newNotes); // Update the state with the modified notes
    saveNotesToLocalStorage(newNotes); // Save the updated notes to localStorage
  };

  // Function to delete a note from the list
  const deleteNote = (index) => {
    let newNotes = [...notes]; // Create a copy of the current notes
    newNotes.splice(index, 1); // Remove the note at the specified index
    setNotes(newNotes); // Update the state with the modified notes
    saveNotesToLocalStorage(newNotes); // Save the updated notes to localStorage
  };

  // Function to toggle list view, but prevent closing if there are no notes
  const toggleListView = () => {
    if (notes.length > 0) {
      setListview(!listview);
    }
  };

  return (
    <div className="flex p-5 flex-row">
      {/* Notes list section */}
      <div className={`noteslist ${listview ? 'w-[320px] h-full scale-100 mr-2 bg-white border' : 'w-0 h-0 scale-0'} rounded overflow-hidden transition-all duration-500 linear flex-shrink-0`}>
        {/* Toolbar with buttons for adding a new note, settings, and closing the list */}
        <div className="toolbar flex justify-between bg-black bg-opacity-10 items-center">
          <Btn click={() => addNote()} icon={<IoAdd size={20} />} />
          <div className="flex">
            <Btn icon={<IoSettingsOutline size={17} />} />
            {/* Close button is only clickable if there are notes */}
            <Btn click={toggleListView} icon={<IoClose size={20} />} disabled={notes.length === 0} />
          </div>
        </div>

        {/* Title of the notes list */}
        <h1 className="text-2xl p-2">Sticky Notes</h1>

        {/* Search input */}
        <div className="flex m-2 bg-slate-100 justify-center items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Update search state on input change
            placeholder="Search...."
            className="bg-transparent w-full p-1 focus-visible:outline-none"
          />
          <Btn click={() => { }} icon={<IoSearch size={20} />} />
        </div>

        {/* Rendering notes if search is empty */}
        {search === '' && notes.length > 0 && notes.map((x, i) => (
          <div key={i} className="m-2 relative cursor-pointer" onClick={() => updateView(i)}>
            <div className={`noteview ${x.view ? 'active' : ''} flex flex-col w-full p-2`} style={{ backgroundColor: `${x.bgcolor}` }}>
              <div className="flex justify-end">
                <span className="text-xs">{x.createdon}</span> {/* Show the created date */}
              </div>
              <textarea readOnly value={x.text} className="w-full cursor-pointer bg-transparent resize-none focus-visible:outline-none" cols="30" rows="2"></textarea>
            </div>
          </div>
        ))}

        {/* Rendering filtered notes based on the search */}
        {search !== '' && filternotes.length > 0 && filternotes.map((x, i) => (
          <div key={i} className="m-2 relative cursor-pointer" onClick={() => updateView(i)}>
            <div className={`noteview ${x.view ? 'active' : ''} flex flex-col w-full p-2`} style={{ backgroundColor: `${x.bgcolor}` }}>
              <div className="flex justify-end">
                <span className="text-xs">{x.createdon}</span>
              </div>
              <textarea readOnly value={x.text} className="w-full cursor-pointer bg-transparent resize-none focus-visible:outline-none" cols="30" rows="2"></textarea>
            </div>
          </div>
        ))}
      </div>

      {/* Notes view section */}
      <div className="notesview w-full">
        {filternotes.length > 0 && filternotes.map((x, i) => {
          if (x.view) {
            return (
              <div key={i} className="flex flex-col rounded overflow-hidden w-[500px] pb-1 mb-2" style={{ backgroundColor: `${x.bgcolor}` }}>
                <div className="toolbar flex justify-between items-center">
                  <Btn click={() => addNote()} icon={<IoAdd size={20} />} />
                  <div className="flex">
                    <Btn click={() => updateOpt(i)} icon={<IoEllipsisHorizontal size={18} />} />
                    <Btn click={() => updateView(i)} icon={<IoClose size={20} />} />
                  </div>
                </div>

                {/* Options menu */}
                {x.options &&
                  <div className="toolarea flex flex-col bg-gray-100">
                    <div className="colorarea w-full flex">
                      {colorArr.map((color, cindex) => (
                        <span key={cindex} onClick={() => updateColor(color, i)} className="flex flex-row w-full h-8 justify-center items-center cursor-pointer" style={{ backgroundColor: `${color}` }}>
                          {x.bgcolor === color ? <IoCheckmark size={20} /> : <></>} {/* Show checkmark if the color is selected */}
                        </span>
                      ))}
                    </div>

                    {/* Button to toggle list view */}
                    <button onClick={() => setListview(!listview)} className="flex justify-start items-center hover:bg-slate-200 py-1 px-2">
                      <IoList className="mr-2" /> Notes List
                    </button>

                    {/* Button to delete the note */}
                    <button onClick={() => deleteNote(i)} className="flex justify-start items-center hover:bg-slate-200 py-1 px-2">
                      <IoTrash className="mr-2" /> Delete Note
                    </button>
                  </div>
                }

                {/* Editable text area for the note */}
                <textarea value={x.text} onChange={(e) => updateNote(e.target.value, i)} className="w-full bg-transparent focus-visible:outline-none p-2" placeholder="Take a note...." id="" cols="30" rows="5"></textarea>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
