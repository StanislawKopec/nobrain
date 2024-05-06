import React, { useEffect, useRef, useState } from "react"
import "./Home.scss";
import { useAppSelector } from "../store/hooks";
import { Link, useNavigate } from "react-router-dom";
import { nodeActions } from "../store/nodesSlice";
import { useDispatch } from "react-redux";
import { MenuItem } from "../models/MenuItemModel";
import Menu from "../components/Menu";

const Home = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);

  const onClickNodeOpen = (id: number) => {
    sessionStorage.setItem("currentNodeId", id.toString())
    dispatch(nodeActions.updateCurrentNodeId());
  }

  const menuItems: MenuItem[] = [
    { name: 'Tree Overview', link: '/TreeOverview' },
    { name: 'About App', link: '/About' },
  ];
  
  return (
    <main>
      <div className="mainContainer">
      <Menu items={menuItems} />
        {isLoggedIn ? 
        <Link to={"/NodesPage"}>
          <div className="startNode" onClick={()=>{onClickNodeOpen(1)}}>
              Start
          </div>
        </Link>
        :
        <div className="startNode" onClick={()=>{onClickNodeOpen(1)}}>
                Start
        </div>
      }
      </div>
    </main>
  );
};

export default Home;
