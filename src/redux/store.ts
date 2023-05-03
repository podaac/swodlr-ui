import { configureStore } from '@reduxjs/toolkit'
import customProductModalSlice from '../components/footer/customProductModalSlice'
import customizeProductsFooterSlice from '../components/footer/customizeProductsFooterSlice'
import navbarSlice from '../components/navbar/navbarSlice'
import appSlice from '../components/app/appSlice'
import granuleSlice from '../components/footer/granuleSlice'
// ...

export const store = configureStore({
  reducer: {
    customProductModal: customProductModalSlice,
    customizeProductsFooter: customizeProductsFooterSlice,
    navbar: navbarSlice,
    app: appSlice,
    granule: granuleSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch