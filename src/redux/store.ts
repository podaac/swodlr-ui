import { configureStore } from '@reduxjs/toolkit'
import modalSlice from '../components/sidebar/actions/modalSlice'
import productSlice from '../components/sidebar/actions/productSlice'
import navbarSlice from '../components/navbar/navbarSlice'
import appSlice from '../components/app/appSlice'
import granuleSlice from '../components/sidebar/actions/productSlice'
import sidebarSlice from '../components/sidebar/actions/sidebarSlice'
// ...

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    product: productSlice,
    navbar: navbarSlice,
    app: appSlice,
    granule: granuleSlice,
    sidebar: sidebarSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch