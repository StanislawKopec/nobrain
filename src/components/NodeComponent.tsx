import React, { useState } from "react"
import { NodeModel } from "../models/NodeModel";
import "./NodeComponent.scss";
import ReactDOM from "react-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { nodeActions } from "../store/nodesSlice";
import { useAppSelector } from "../store/hooks";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";

interface NodeProps {
  node: NodeModel;
  id: number;
  isDragging: boolean;
  boxRef: React.RefObject<HTMLDivElement>;
}

const NodeComponent: React.FC<NodeProps> = ({ node, isDragging, boxRef})=> {
    
    const currentNodeId = useAppSelector((state) => state.nodes.currentNodeId);
    const dispatch = useDispatch();

    const onClickNodeOpen = (id: number) => {
        sessionStorage.setItem("currentNodeId", id.toString())
        dispatch(nodeActions.updateCurrentNodeId());
        dispatch(nodeActions.updateCurrentNoteId(""));
    }

    const handleContextMenu = (e:React.MouseEvent<HTMLDivElement,MouseEvent>) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        setPopUpPosition({ top: rect.bottom, left: rect.left });
        setPopUpOpen(true);
    }

      const [popUpOpen, setPopUpOpen] = useState(false);
      const [popUpPosition, setPopUpPosition] = useState({ top: 0, left: 0 });
    
      const handleClosePopUp = () => {
        setPopUpOpen(false);
      };

    return (
        <div>
            <div
            onContextMenu={handleContextMenu}
            ref={boxRef}
            className={(currentNodeId == node.id) ? "currentKulka" : "kulka"}
            onClick={() => {
                if (!isDragging) onClickNodeOpen(node.id);
            }}
            >
            {node.name}
            </div>
            <NodeMenu isOpen={popUpOpen} position={popUpPosition} onClose={handleClosePopUp} nodeId={node.id}></NodeMenu>
            <div className={popUpOpen? "popUpBackground" : "displayNone"} onClick={handleClosePopUp} />
        </div>
    );
};

interface NodeMenuProps {
  isOpen: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  nodeId: number;
}

const NodeMenu: React.FC<NodeMenuProps> = ({ isOpen, position, onClose, nodeId}) => {
  const dispatch = useDispatch();
  const [editNameWindow, setEditNameWindow] = useState(false);
  const userId = useAppSelector(state => state.auth.loggedInUserId);
  if (!isOpen) return null;

  const toggleEditNameWindow = () => {
      setEditNameWindow(!editNameWindow);
  }

  const params = {
    userId: userId,
  };

  const handleDeleteNode = () =>{
      axios
          .delete(`${BASE_URL}/api/Nodes/Delete/${nodeId}`)
          .then((response) => {
              axios.get(`${BASE_URL}/api/Nodes/GetNodes`, {params})
              .then((response) => {
                dispatch(nodeActions.updateNodeList(response.data))
                toast.success('Node deleted successufully!');
                onClose();
              })
              .catch((error) => {
                toast.warning('Error! Cannot delete node with notes!');
              });
              console.log('DELETE request successful');
          })
          .catch((error) => {
              toast.warning('Error! Cannot delete node with notes!');
              console.error('Error making DELETE request', error);
          });
  }

  let inputValue = "";
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault(); // Prevent the form from submitting and reloading the page
      editNodeName(inputValue);
    };

  const editNodeName = (newName: string) => {
      axios.put(`${BASE_URL}/api/Nodes/EditNodeName`, {id:nodeId, name:newName})
      .then((response) => {
          axios.get(`${BASE_URL}/api/Nodes/GetNodes`, {params})
          .then((response) => {
            dispatch(nodeActions.updateNodeList(response.data))
            toast.success('Node name changed!');
            onClose();
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      })
      .catch((error) => {
        console.error('PUT request error:', error);
      });
  }

  return ReactDOM.createPortal(
      <div style={position} className="nodeMenu">
          <div className="nodeMenuButtons">
              <button onClick={handleDeleteNode}>Delete node</button>
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
    </div>,
    document.body
  );
};

export default NodeComponent;

