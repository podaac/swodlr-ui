import { configureStore } from '@reduxjs/toolkit'
import addCustomProductModalSlice from '../components/footer/addCustomProductModalSlice'
import customizeProductsFooterSlice from '../components/footer/customizeProductsFooterSlice'
// ...

export const store = configureStore({
  reducer: {
    addCustomProductModal: addCustomProductModalSlice,
    customizeProductsFooter: customizeProductsFooterSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch