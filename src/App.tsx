import {Route, Routes, BrowserRouter, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Home from "./pages/Home";
import NotesPage from "./pages/NotesPage";
import { useEffect, useRef, useState } from "react";
import nodesSlice, { nodeActions } from "./store/nodesSlice";
import axios from "axios";
import NodesPage from "./pages/NodesPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RouteGuard from "./store/RouteGuard";
import NotFoundPage from "./pages/NotFoundPage";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import authSlice, { authActions } from "./store/auth-slice";
import TreeOverview from "./pages/TreeOverview";
import NodeOverview from "./pages/NodeOverview";
import { BASE_URL } from "./config";
import About from "./pages/About";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.loggedInUserId);
  const params = {
    userId: userId,
  };

  useEffect(()=>{
    if(userId)
    axios.get(`${BASE_URL}/api/Nodes/GetNodes`, {params})
        .then((response) => {
          dispatch(nodeActions.updateNodeList(response.data))
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  },[userId])
  useEffect(()=>{
    if(userId)
    axios.get(`${BASE_URL}/api/Notes/GetAllNotes`, {params})
        .then((response) => {
          dispatch(nodeActions.updateNoteList(response.data))
          
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  },[userId])
  useEffect(()=>{
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    const loggedInUserId = sessionStorage.getItem("loggedInUserId");
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    if(loggedIn == "true"){
      dispatch(authActions.login({ username: loggedInUser, userId: loggedInUserId }))
    }
  })

  /*useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch((error) => {
            console.error('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);*/  
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register/>} />
        <Route path="/NotesPage" element={<RouteGuard><NotesPage /></RouteGuard>} />
        <Route path="/NodesPage" element={<RouteGuard><NodesPage /></RouteGuard>} />
        <Route path="/TreeOverview" element={<RouteGuard><TreeOverview /></RouteGuard>} />
        <Route path="/NodeOverview" element={<RouteGuard><NodeOverview /></RouteGuard>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer limit={3} newestOnTop={true} autoClose={1000}/>
    </div>
  );
}

export default App;
