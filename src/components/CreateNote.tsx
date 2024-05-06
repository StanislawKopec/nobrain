import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useAppSelector } from '../store/hooks';
import { BASE_URL } from '../config';
import { nodeActions } from '../store/nodesSlice';
import { NoteModel } from '../models/NoteModel';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}
 
export const CreateNote: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [currentNotesList, setCurrentNotesList] = useState<NoteModel[]>([]);
    const currentNodeId = useAppSelector((state) => state.nodes.currentNodeId);
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState<string>('');
    const notes = useAppSelector((state) => state.nodes.notes);
    const nodes = useAppSelector((state) => state.nodes.nodes);
    const user = useAppSelector((state) => state.auth.loggedInUserId);

    const params = {
        userId :user,
    }

    useEffect(() => {
        const notesIds = notes.filter(element => element.nodeID == currentNodeId);
        if (notesIds) {
        setCurrentNotesList(notesIds);
        } 
    }, [currentNodeId, nodes, notes]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if(currentNotesList.find((element) => element.name == inputValue)){
        console.log("Name already exists");
        return null;
    }

    axios
        .post(`${BASE_URL}/api/Notes/CreateNewNote`, { //Create note
        name: inputValue,
        note: '',
        nodeID: currentNodeId,
        userID: user,
        })
        .then(() => {
        axios
            .get(`${BASE_URL}/api/Notes/GetAllNotes`, {params}) //Get updated notes list
            .then((response) => {
                dispatch(nodeActions.updateNoteList(response.data));
                onClose();
            })
            .catch((error) => {
            console.error('Error:', error);
            });
        })
        .catch((error) => {
        console.error('Error:', error);
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSubmit(e);
    }
    };

    return ReactDOM.createPortal(
    <div>
        <div className={isOpen? "popUpContainer" : "displayNone"}>
            <form onSubmit={handleSubmit}>
            <input
            className="createNodeInput"
            type="text"
            placeholder="Note name"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            />
            <button type="submit" className="submitButton">Submit</button>
        </form>
        <button onClick={onClose} className="closeButton">Close</button>
        </div>
        <div className={isOpen? "popUpBackground" : "displayNone"} onClick={onClose} />
    </div>,
    document.body
    );
};

export default CreateNote;