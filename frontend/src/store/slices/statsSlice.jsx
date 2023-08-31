import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API;

// Create an async thunk to fetch transaction data with query parameters
export const fetchStats = createAsyncThunk(
    '/data/stats',
    async (queryParams) => { // Destructure api from arguments
        try {
            const response = await axios.get(`${API}/stats`, { params: queryParams });
            return response.data.filteredData; // Return the fetched data
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
);

const initialState = {
    isLoading: true,
    stats: {},
    isError: null,
};

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.filteredData = action.payload; // Update the correct property
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.error.message;
            });
    }
});
export default statsSlice.reducer;
