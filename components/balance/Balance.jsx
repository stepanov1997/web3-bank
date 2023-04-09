import React from "react";
import {useSelector} from 'react-redux'
import {selectBalance} from '../../redux-slices/balance-slice'
import {selectAddress} from "../../redux-slices/address-slice";
import {Statistic} from "semantic-ui-react";


export const Balance = () => {
    const balance = useSelector(selectBalance);
    const address = useSelector(selectAddress);

    return (
        <div style={{ textAlign: "center"}}>
            <p>{address}</p>
            <Statistic>
                <Statistic.Value><span style={{paddingLeft: 50}}>{balance}</span><img src={"/logo-black.png"} alt={"No image"} style={{height: 150, width: 100, objectFit: "cover", objectPosition: "center"}}/></Statistic.Value>
                <Statistic.Label>Convertible Mark</Statistic.Label>
            </Statistic>
        </div>
    )
}