import React, { useEffect, useRef, useState } from "react"
import "./NotesPage.scss"
import axios from "axios";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../store/hooks";
import { NoteModel } from "../models/NoteModel";
import NoteComponent from "../components/NoteComponent";
import { nodeActions } from "../store/nodesSlice";
import { BASE_URL } from "../config";
import { MenuItem } from "../models/MenuItemModel";
import CreateNote from "../components/CreateNote";
import Menu from "../components/Menu";
import {  toast } from 'react-toastify';

const NotesPage = () => {
  
  if(sessionStorage.getItem("currentNodeId")===null){
    sessionStorage.setItem("currentNodeId", "1");
  }
  const userId = useAppSelector((state) => state.auth.loggedInUserId);
  const nodes = useAppSelector((state) => state.nodes.nodes);
  const notes = useAppSelector((state) => state.nodes.notes);
  const currentNodeId = useAppSelector((state) => state.nodes.currentNodeId);
  const currentNoteId = useAppSelector((state) => state.nodes.currentNoteId);
  const [textValue, setTextValue] = useState<string>('');
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [divElements, setDivElements] = useState<JSX.Element[]>([]);
  const [currentNotesList, setCurrentNotesList] = useState<NoteModel[]>([]);
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(event.target.value);
    setCursorPosition(event.target.selectionStart || 0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
        event.preventDefault();
        const { selectionStart, selectionEnd, value } = event.currentTarget;
        const newValue =
            value.substring(0, selectionStart) +
            '\t' +
            value.substring(selectionEnd);

        setTextValue(newValue);

        const newPosition = selectionStart + 1;
        setCursorPosition(newPosition);
    }
  };

  const params = {
    userId: userId,
  }

  const saveNotes = () =>{
    axios.put(`${BASE_URL}/api/Notes/EditNote`, {id:currentNoteId, notes:textValue})
      .then((response) => {
        toast.success('Note saved successfully!', {
          theme: 'colored',
        });
        axios
        .get(`${BASE_URL}/api/Notes/GetAllNotes`, {params}) //Get updated notes list
        .then((response) => {
          dispatch(nodeActions.updateNoteList(response.data));
        });
      })
      .catch((error) => {
        toast.warning('Note saving error!', {
          theme: 'colored',
        });
        console.error('PUT request error:', error);
      });
  }

  useEffect(() => {
    dispatch(nodeActions.updateCurrentNodeId());
    const currentNotes = notes.filter(element => element.nodeID == currentNodeId);
    setCurrentNotesList(currentNotes);    
  }, [currentNodeId, nodes, notes]);

  var numDivs: number;
  useEffect(() => {
    numDivs = currentNotesList.length;
    var divs = [];
    if(currentNotesList){
      for (let i = 1; i <= numDivs; i++) {
      divs.push(<NoteComponent
          key={i}
          note={currentNotesList[i-1]}
          id = {currentNotesList[i-1].id}
      />);
      setDivElements(divs);
     }
    }
  }, [currentNotesList]);

  useEffect(()=>{
    let noteInNotesArray = notes.findIndex((element)=> element.id == currentNoteId);
    if(currentNoteId)
    setTextValue(notes[noteInNotesArray].note);
  }, [currentNoteId])

  //Setting up Menu.tsx
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { name: 'Tree Overview', link: '/TreeOverview' },
    { name: 'Home', link: '/Home'},
    ...(currentNodeId !== 1 ? [{ name: 'Nodes Page', link: '/NodesPage' }] : []),
  ];

  return (
    <div className="mainContainer" id="modal-root">
      <CreateNote isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
      <Menu items={menuItems} openModal={() => setIsModalOpen(true)} modalParameter={"New Note"}/>
      <div className="notesList">
        {currentNotesList.length ? divElements : <div/> }
      </div>
      <div className="currentNodeName">{(nodes.find((element) => element.id == currentNodeId))?.name}</div>
      <div className={currentNoteId ? "noteContainer": "displayNone"}>
        <textarea id="textarea" rows={4} cols={50} value={textValue}
         onChange={handleChange} onKeyDown={handleKeyDown}
          ref={(textarea) => {
            if (textarea) textarea.setSelectionRange(cursorPosition, cursorPosition);
          }}/>
        <button className="saveNotesButton" onClick={saveNotes}>Save</button>
      </div>
    </div>
  );
};


export default NotesPage;
