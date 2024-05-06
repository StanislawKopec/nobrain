import React, { useEffect, useRef, useState,MouseEvent } from "react"
import "./TreeOverview.scss"
import { useAppSelector } from "../store/hooks";
import { NodeModel } from "../models/NodeModel";
import { nodeActions } from "../store/nodesSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MenuItem } from "../models/MenuItemModel";
import Menu from "../components/Menu";

const TreeOverview = () => {
  const nodes = useAppSelector((state) => state.nodes.nodes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

   const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setScrollPos({
      left: e.clientX,
      top: e.clientY,
    });
  };

  useEffect(() => {
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('mouseleave', handleMouseLeave);
  
    return () => {
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  function handleMouseLeave() {
      setIsDragging(false);
    }
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - scrollPos.left;
    const dy = e.clientY - scrollPos.top;
    containerRef.current.scrollLeft -= dx;
    containerRef.current.scrollTop -= dy;
    setScrollPos({
      left: e.clientX,
      top: e.clientY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
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
        updateLines();
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
  }, [nodes]);
  useEffect(()=>{
    const newLines = generateLines(nodes);
    setLines(newLines);
  },[scrollPos])


  const [lines, setLines] = useState<JSX.Element[]>([]);
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
                  <line x1={parentRect.left + parentRect.width / 2} y1={parentRect.bottom } x2={parentRect.left + parentRect.width / 2} y2={parentRect.bottom +(childRect.top - parentRect.bottom )/2} stroke="black" strokeWidth="1" />;
                  <line x1={parentRect.left + parentRect.width / 2} y1={parentRect.bottom +(childRect.top - parentRect.bottom )/2} x2={childRect.left + childRect.width / 2} y2={parentRect.bottom +(childRect.top - parentRect.bottom )/2} stroke="black" strokeWidth="1" />;
                  <line x1={childRect.left + childRect.width / 2} y1={parentRect.bottom +(childRect.top - parentRect.bottom )/2} x2={childRect.left + childRect.width / 2} y2={childRect.top} stroke="black" strokeWidth="1" />;          
                </svg>
                newLines.push(line);
            }
        }
    });
    return newLines;
};
    
  const segregateNodes = (nodes: NodeModel[], parentId?: number): JSX.Element[] => {
    const children = nodes.filter(node => node.nodeAbove === parentId);

    if (children.length === 0) {return []};

    return children.map(child => (
        <div key={child.id}  className="childContainer">
          <div className="box" id={child.id.toString()} onClick={() => {
              onClickNodeOpen(child.id);
          }}>
            <p>{child.name}</p>
          </div>
          <div className="ccContainer">
              {segregateNodes(nodes, child.id)}
          </div>
          
        </div>
    ));
  };

  const menuItems: MenuItem[] = [
    { name: 'Home', link: '/Home' },
  ];

  return (
    <div className="mainContainerTree"  
    ref={containerRef} 
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}>
      <Menu items={menuItems}/>

      <div className="contentContainerTree">
        {segregateNodes(nodes,1)} 
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {lines}
        </svg>
      </div>
        
      
    </div>
  )
};

export default TreeOverview;


