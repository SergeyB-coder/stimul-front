import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface startState {
    userName: string;
    user_id: number
}

const initialState: startState = {
    userName: '',
    user_id: 0,
};

export const startSlice = createSlice({
    name: 'start',
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        setUserId: (state, action: PayloadAction<number>) => {
            state.user_id = action.payload;
        },
    },
});

export const {setUserName, setUserId } = startSlice.actions;


export const selectUserName = (state: RootState) => state.start.userName;
export const selectUserId = (state: RootState) => state.start.user_id;


export default startSlice.reducer;
