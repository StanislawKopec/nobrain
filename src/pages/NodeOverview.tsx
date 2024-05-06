import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import "./NodeOverview.scss"
import { NodeModel } from "../models/NodeModel";
import { useAppSelector } from "../store/hooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { nodeActions } from "../store/nodesSlice";
import { MenuItem } from "../models/MenuItemModel";
import Menu from "../components/Menu";

const NodeOverview = () => {
  const nodes = useAppSelector((state) => state.nodes.nodes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [lines, setLines] = useState<JSX.Element[]>([]);

  const onClickNodeOpen = (id: number) => {
    sessionStorage.setItem("currentNodeId", id.toString())
    dispatch(nodeActions.updateCurrentNodeId());
    navigate("/NodesPage")
  }

  useEffect(() => {
    const updateLines = () => {
      const newLines = generateLines(nodes);
      setLines(newLines);
    };
    updateLines();
    const handleResize = () => {
      if (divRef.current) {
        const rect = divRef.current.getBoundingClientRect();
        startingNodePositionRef.current = { x: rect.left + rect.width/2, y: rect.top + rect.height/2 };
      }
      updateLines();
    }

  }, [nodes]); 

  const generateLines = (nodes: NodeModel[]): JSX.Element[] => {
    const newLines: JSX.Element[] = [];
    nodes.forEach(node => {
        if (node.nodeAbove) {
            const parentDiv = document.getElementById(node.nodeAbove.toString());
            const childDiv = document.getElementById(node.id.toString());
            if (parentDiv && childDiv) {
                const parentRect = parentDiv.getBoundingClientRect();
                const childRect = childDiv.getBoundingClientRect();
                const line = <svg key={`${node.nodeAbove}-${node.id}`}>
                  <line x1={parentRect.left + parentRect.width / 2} y1={parentRect.bottom - parentRect.height/2} 
                  x2={childRect.left + childRect.width / 2} y2={childRect.bottom -childRect.height/2} stroke="black" strokeWidth="1" />;
                </svg>
                newLines.push(line);
            }
        }
    });
    return newLines;
};
  
  const segregateNodes = (nodes: NodeModel[], parentId: number, parentPosition?:{x:number,y:number}): JSX.Element[] => {
    const children = nodes.filter(node => parseInt(node.nodeAbove.toString()) === parentId);

    if (children.length === 0) {return []};

    const numChildren = children.length;
    const radius = 200; 
    const angleIncrement = (2 * Math.PI) / numChildren;

    return children.map((child, index) => {
      const angle = index * angleIncrement; 
      let x = radius * Math.cos(angle);
      let y = radius * Math.sin(angle);

      if(parentId==1){
        x = parentPosition!.x + radius * Math.cos(angle);
        y = parentPosition!.y + radius * Math.sin(angle);
      }

      return (
        <div key={child.id} className="childContainerN" style={{position: 'absolute', left: `${x}px`, top: `${y}px` }}>
          <div className="boxN" id={child.id.toString()} onClick={() => onClickNodeOpen(child.id)}>
            <p>{child.name}</p>
          </div>
          {segregateNodes(nodes, child.id)}
        </div>
      );
    });
  };

  const divRef = useRef<HTMLDivElement>(null);
  const startingNodePositionRef = useRef<{ x: number; y: number } | null>(null);
  const [shouldRenderSegregateNodes, setShouldRenderSegregateNodes] = useState(false);

  useLayoutEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      startingNodePositionRef.current = { x: rect.left + rect.width/2, y: rect.top + rect.height/2 };
      setShouldRenderSegregateNodes(true);
    }
  }, []);

  const menuItems: MenuItem[] = [
    {name: 'Home', link: '/Home' },
    {name: 'Tree Overview', link: '/TreeOverview'}
  ];
  
  return (
    <div className="mainContainer">
      <Menu items={menuItems}/>
      
      <div style={{marginTop: '100px' }}>
          <div id="1" className="startingNode" ref={divRef}>Start</div>
          {shouldRenderSegregateNodes && segregateNodes(nodes,1,startingNodePositionRef.current!)}
          <svg style={{zIndex:0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none'}}>
                {lines}
          </svg>
      </div>

    </div>
  )
};

export default NodeOverview;
