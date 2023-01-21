import {createSlice} from '@reduxjs/toolkit'

export const addressSlice = createSlice({
    name: 'address',
    initialState: {
        value: '',
    },
    reducers: {
        setAddress: (state, action) => {
            state.value = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setAddress } = addressSlice.actions
export const selectAddress = (state) => state.address.value;
export default addressSlice.reducer