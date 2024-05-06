import React, { useState } from "react"
import "./NoteComponent.scss"
import { useAppSelector } from "../store/hooks";
import { useDispatch } from "react-redux";
import { NoteModel } from "../models/NoteModel";
import { nodeActions } from "../store/nodesSlice";
import axios from "axios";
import ReactDOM from "react-dom";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";

const NoteComponent:React.FC<NoteProps> = ({note}) => {
    const dispatch = useDispatch();
    const [popUpOpen, setPopUpOpen] = useState(false);
    const [popUpPosition, setPopUpPosition] = useState({ top: 0, left: 0 });
    const currentNoteId = useAppSelector((state) => state.nodes.currentNoteId);

    const onClickNoteOpen = () => {
        dispatch(nodeActions.updateCurrentNoteId(note.id));
    }

    const handleContextMenu = (e:React.MouseEvent<HTMLDivElement,MouseEvent>) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        setPopUpPosition({ top: rect.bottom, left: rect.left });
        setPopUpOpen(true);
    }
    const handleClosePopUp = () => {
        setPopUpOpen(false);
      };

    return (
        <div>
            <div
            onContextMenu={handleContextMenu}
            className="noteKulka"
            style={{ backgroundColor: currentNoteId === note.id ? 'rgba(77, 156, 79, 0.86)' : '' }}
            onClick={() => {
                 onClickNoteOpen();
            }}
            >
             {note.name}   
            </div>
            <NoteMenu isOpen={popUpOpen} position={popUpPosition} onClose={handleClosePopUp} noteId={note.id}></NoteMenu>
        </div>
    );
};

const NoteMenu: React.FC<NodeMenuProps> = ({ isOpen, position, onClose, noteId}) => {
    const dispatch = useDispatch();
    const currentNodeId = useAppSelector((state) => state.nodes.currentNodeId);
    const userId = useAppSelector((state) => state.auth.loggedInUserId);
    const [editNameWindow, setEditNameWindow] = useState(false);
    if (!isOpen) return null;

    const toggleEditNameWindow = () => {
        setEditNameWindow(!editNameWindow);
    }

    const params = {
      userId: userId,
    };

    const handleDeleteNote = () =>{
        axios
            .delete(`${BASE_URL}/api/Notes/Delete/${noteId}`) //Delete note
            .then((response) => {
                toast.success('Note deleted successufully!');
                axios.get(`${BASE_URL}/api/Notes/GetAllNotes`, {params}) //Update notes    
                  .then((response) => {
                      dispatch(nodeActions.updateNoteList(response.data))
                      axios.get(`${BASE_URL}/api/Nodes/GetNodes`, {params}) // Update nodes
                          .then((response) => {
                          onClose();
                          dispatch(nodeActions.updateNodeList(response.data))
                          })
                          .catch((error) => {
                            console.error('Error:', error);
                          });
                })
                .catch((error) => {
                  toast.warning('Error!');
                  console.error('Error:', error);
                });
            })
            .catch((error) => {
                toast.warning('Error making DELETE request!');
                console.error('Error making DELETE request', error);
            });
    }

    let inputValue = "";
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        editNoteName(inputValue);
      };

    const editNoteName = (newName: string) => {
        axios.put(`${BASE_URL}/api/Notes/EditNoteName`, {id:noteId, name:newName})
        .then((response) => {
            axios.get(`${BASE_URL}/api/Notes/GetAllNotes`, {params})
            .then((response) => {
              console.log(response.data)
              dispatch(nodeActions.updateNoteList(response.data))
              onClose();
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          console.log('PUT request successful:', response.data);
        })
        .catch((error) => {
          console.error('PUT request error:', error);
        });
    }
  
    return ReactDOM.createPortal(
        <div>
            <div style={position} className="nodeMenu">
                <div className="nodeMenuButtons">
                    <button onClick={handleDeleteNote}>Delete note</button>
                    <button onClick={toggleEditNameWindow}>Edit node name</button>
                    <button onClick={onClose}>Close</button>
                </div>
                <div className={editNameWindow ? "editNameWindow" : "displayNone"}>
                    <form onSubmit={handleSubmit}>
                        <input
                        type="text"
                        onChange={(e) => (inputValue = e.target.value)}
                        placeholder="Enter new name"></input>
                        <button type="submit">Submit</button>
                    </form>
                </div>
        </div>
      <div className={"popUpBackground"} onClick={onClose}/>
      </div>,
      document.body
    );
  };

export default NoteComponent;

interface NoteProps {
    note: NoteModel;
    id: number;
}
interface NodeMenuProps {
    isOpen: boolean;
    position: { top: number; left: number };
    onClose: () => void;
    noteId: number;
}