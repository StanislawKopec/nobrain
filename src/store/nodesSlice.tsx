import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NodeModel } from "../models/NodeModel";
import { NoteModel } from "../models/NoteModel";

const initialState = {
  isOkay: false,
  nodes: [] as NodeModel[],
  currentNodeId: 1,
  notes: [] as NoteModel[],
  currentNoteId: 0,
}

const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    updateNodeList(state,action){
      state.nodes = action.payload;
    },
    updateCurrentNodeId(state){
      state.currentNodeId = parseInt(sessionStorage.getItem("currentNodeId")!);
    },
    updateNoteList(state,action){
      state.notes = action.payload;
    },
    updateCurrentNoteId(state, action){
      if(state.currentNoteId === action.payload){
        state.currentNoteId = 0;
      }else state.currentNoteId = action.payload;
    },
    },
});

export const nodeActions = nodesSlice.actions;
export default nodesSlice;
