import React from "react";
import {useSelector} from 'react-redux'
import {selectBalance} from '../../redux-slices/balance-slice'
import {selectAddress} from "../../redux-slices/address-slice";
import {Icon, Statistic} from "semantic-ui-react";


export const Balance = () => {
    const balance = useSelector(selectBalance);
    const address = useSelector(selectAddress);

    return (
        <div style={{ textAlign: "center"}}>
            <p>{address}</p>
            <Statistic>
                <Statistic.Value><Icon name={'bitcoin'}/>{balance}</Statistic.Value>
                <Statistic.Label>KM</Statistic.Label>
            </Statistic>
        </div>
    )
}