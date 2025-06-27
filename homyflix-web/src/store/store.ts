import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// Importe os reducers dos slices aqui quando eles forem criados
// import movieReducer from './slices/movieSlice';
// import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Adicione os reducers aqui
    // movies: movieReducer,
    // user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
