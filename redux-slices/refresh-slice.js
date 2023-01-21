import {createSlice} from '@reduxjs/toolkit'

export const refreshSlice = createSlice({
    name: 'refresh',
    initialState: {
        value: false,
    },
    reducers: {
        executeRefresh: (state) => {
            state.value = !state.value
        }
    },
})

// Action creators are generated for each case reducer function
export const { executeRefresh } = refreshSlice.actions
export const selectRefresh = (state) => state.refresh.value;
export default refreshSlice.reducer