import { configureStore } from '@reduxjs/toolkit'
import addCustomProductModalSlice from '../components/footer/addCustomProductModalSlice'
// ...

export const store = configureStore({
  reducer: {
    addCustomProductModal: addCustomProductModalSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch