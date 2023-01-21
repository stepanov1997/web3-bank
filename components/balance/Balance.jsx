import React from "react";


export const Balance = ({address, balance}) => {
    return (
        <p>{address}: {balance} KM</p>
    )
}