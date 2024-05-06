import React, { useEffect, useRef, useState } from "react"
import "./NodesPage.scss";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import NodeComponent from "../components/NodeComponent";
import { NodeModel } from "../models/NodeModel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { nodeActions } from "../store/nodesSlice";
import { NoteModel } from "../models/NoteModel";
import CreateNode from "../components/CreateNode";
import { MenuItem } from "../models/MenuItemModel";
import Menu from "../components/Menu";

const NodesPage = () => {
  const nodes = useAppSelector((state) => state.nodes.nodes);
  const notes = useAppSelector((state) => state.nodes.notes);
  const dispatch = useAppDispatch();
  const [activeNodesList, setActiveNodesList] = useState<NodeModel[]>([]);
  const [currentNotesList, setCurrentNotesList] = useState<NoteModel[]>([]);

  const currentNodeId = useAppSelector((state) => state.nodes.currentNodeId);

  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const isClicked = useRef<boolean>(false);

  const coords = useRef<{
    startX: number,
    startY: number,
    lastX: number,
    lastY: number
  }>({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  })
  
  var isDragging = false;
  
  useEffect(() => {
    if (!boxRef.current || !containerRef.current) return;

    const box = boxRef.current;
    const container = containerRef.current;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = false;
      setTimeout(() => isDragging = true, 100)
      isClicked.current = true;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
    }

    const onMouseUp = (e: MouseEvent) => {
      isClicked.current = false;
      coords.current.lastX = box.offsetLeft;
      coords.current.lastY = box.offsetTop;
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isClicked.current) return;

      const nextX = e.clientX - coords.current.startX + coords.current.lastX;
      const nextY = e.clientY - coords.current.startY + coords.current.lastY;

      
      if(nextY >=50){
        box.style.top = `${nextY}px`;
      }else if(nextY<50){
        box.style.top =`${nextY + 50}px`; 
      }
      
      if(nextX >=0)
      box.style.left = `${nextX}px`;
    }

    box.addEventListener('mousedown', onMouseDown);
    box.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseUp);

    const cleanup = () => {
      box.removeEventListener('mousedown', onMouseDown);
      box.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseUp);
    }

    return cleanup;
  }, [])

  var numDivs: number;
  const [divElements, setDivElements] = useState<JSX.Element[]>([]);
  const [divElementsNotes, setDivElementsNotes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    dispatch(nodeActions.updateCurrentNodeId());
    const newArray = nodes.filter(element => element.nodeAbove == currentNodeId)
    setActiveNodesList(newArray);
  }, [nodes, currentNodeId]);

  useEffect(() => {
    numDivs = activeNodesList.length;
    let divs = [];
    for (let i = 1; i <= numDivs; i++) {
    divs.push(<NodeComponent
      key={i}
      node={activeNodesList[i-1]}
      id = {activeNodesList[i-1].id}
      isDragging={isDragging}
      boxRef={boxRef}
    />);
    setDivElements(divs);
  }
  }, [activeNodesList]);

  useEffect(() => {
    const notesIds = notes.filter(element => element.nodeID == currentNodeId);
    if (notesIds) {
      setCurrentNotesList(notesIds);
    } else setCurrentNotesList([]);
  }, [currentNodeId,nodes]);

  var numDivsNotes: number;
  useEffect(() => {
    numDivsNotes = currentNotesList.length;
    var divs = [];
    if(currentNotesList){
      for (let i = 1; i <= numDivsNotes; i++) {
      divs.push(<div key={i} id = {currentNotesList[i-1].id.toString()} className="notesListElement">
            {currentNotesList[i-1].name}
          </div>);
      setDivElementsNotes(divs);
    }
  }
  }, [currentNotesList]);
  
  //Setting up Menu.tsx
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goNodeAbove = () => {
    const node = nodes.find((element) => element.id === currentNodeId);
    if(node){
    sessionStorage.setItem("currentNodeId", node!.nodeAbove.toString())
    dispatch(nodeActions.updateCurrentNodeId());
    }
  }
  const menuItems: MenuItem[] = [
    { name: 'Tree Overview', link: '/TreeOverview' },
    { name: 'Home', link: '/Home'},
    ...(currentNodeId !== 1 ? [{ name: 'Notes Page', link: '/NotesPage' }] : []),
    { name: 'Node Above', link: '/NodesPage', onClick:goNodeAbove }
  ];
  
  return (
    <main>
      <div ref={containerRef} className="mainContainer">
        <Menu items={menuItems} openModal={() => setIsModalOpen(true)} modalParameter={"New Node"}/>
        <CreateNode isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
        {(currentNodeId !==1)&&<div className="currentNodeName">{(nodes.find((element) => element.id == currentNodeId))?.name}</div>}
        <div className="nodeList">
          {activeNodesList.length ? divElements : <div/> }
        </div>
        {currentNodeId !== 1 &&
        <Link to={"/NotesPage"}>
          <div className="notesListMenu">
            <div className="notesListElement">Notes:</div>
            {currentNotesList.length ? divElementsNotes : <div/> }  
          </div>
        </Link>}
      </div>
    </main>
  );
};

export default NodesPage;
