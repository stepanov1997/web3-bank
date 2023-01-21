import {createSlice} from '@reduxjs/toolkit'

export const balanceSlice = createSlice({
    name: 'balance',
    initialState: {
        value: 0.0,
    },
    reducers: {
        setBalance: (state, action) => {
            state.value = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setBalance } = balanceSlice.actions
export const selectBalance = (state) => state.balance.value;
export default balanceSlice.reducer