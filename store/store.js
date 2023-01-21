import {configureStore} from "@reduxjs/toolkit";
import {balanceSlice} from "../redux-slices/balance-slice";
import {addressSlice} from "../redux-slices/address-slice";
import {createWrapper} from "next-redux-wrapper";
import {refreshSlice} from "../redux-slices/refresh-slice";

const makeStore = () =>
    configureStore({
        reducer: {
            [balanceSlice.name]: balanceSlice.reducer,
            [addressSlice.name]: addressSlice.reducer,
            [refreshSlice.name]: refreshSlice.reducer,
        },
        devTools: true,
    });


export const wrapper = createWrapper(makeStore);