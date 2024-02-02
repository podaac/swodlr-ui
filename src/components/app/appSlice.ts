import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PageTypes, UserData } from '../../types/constantTypes'
import { CurrentUserData } from '../../types/graphqlTypes'
import { Session } from '../../authentication/session';
import { getUserData } from '../../user/userData';

// Define a type for the slice state
interface AppState {
  userAuthenticated: boolean,
  currentPage: PageTypes,
  currentUser: CurrentUserData | null,
  startTutorial: boolean
}

export const getCurrentUser = createAsyncThunk<CurrentUserData | null>('currentUser', async () => {
  return await getUserData();
});

// Define the initial state using that type
const initialState: AppState = {
  userAuthenticated: false,
  currentPage: 'welcome',
  currentUser: null,
  startTutorial: false
}

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    logoutCurrentUser: (state) => {
      state.userAuthenticated = false;
      state.currentUser = null;
      Session.invalidateCurrentSession();
    },
    setStartTutorial: (state, action: PayloadAction<boolean>) => {
      state.startTutorial = action.payload
    },
  },
  extraReducers(builder) {
      builder.addCase(getCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.userAuthenticated = true;
      });

      builder.addCase(getCurrentUser.rejected, (state, action) => {
        console.error(`getCurrentUser failed: ${action.error}`);
        
        // Reset everything and assume session is invalid
        state.currentUser = null;
        state.userAuthenticated = false;
        Session.invalidateCurrentSession();
      });
  },
});

export const { logoutCurrentUser, setStartTutorial } = appSlice.actions

export default appSlice.reducer
