import React from "react";
import {useSelector} from 'react-redux'
import {selectBalance} from '../../redux-slices/balance-slice'
import {selectAddress} from "../../redux-slices/address-slice";


export const Balance = () => {
    const balance = useSelector(selectBalance);
    const address = useSelector(selectAddress);

    return (
        <p>{address}: {balance} KM</p>
    )
}