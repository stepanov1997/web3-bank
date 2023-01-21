import {LoadingSpinner} from "../loading-spinner";
import React, {useState} from "react";
import convertibleMarkDao from "../../core/dao/convertible-mark-contract";
import {useDispatch, useSelector} from "react-redux";
import {selectBalance} from "../../redux-slices/balance-slice";
import {executeRefresh} from "../../redux-slices/refresh-slice";


export const SendTransaction = () => {
    const [loading, setLoading] = useState(false)
    const [receiverAddress, setReceiverAddress] = useState("");
    const [receiverAmount, setReceiverAmount] = useState(10);

    const balance = useSelector(selectBalance);
    const dispatch = useDispatch();

    async function sendTransaction(event) {
        event.preventDefault();

        setLoading(true)

        if (receiverAmount > balance) {
            window.alert("Receiver amount is less than current balance!")
            setLoading(false)
            return false;
        }

        const status = await convertibleMarkDao.sendTransaction(receiverAddress, receiverAmount)

        if (status === 0 || status === null) {
            window.alert('Transaction is not processed successfully.')
            setLoading(false)
            return false;
        }
        window.alert("You successfully sent a transaction!")
        dispatch(executeRefresh())
        setLoading(false)
        return true;
    }

    return (
        <form onSubmit={async event => await sendTransaction(event)}>
            <p>Send crypto KM to wallet:</p>
            <input type={"text"} value={receiverAddress} onChange={e => setReceiverAddress(e.target.value)}/>
            <input type={"number"} value={receiverAmount}
                   onChange={e => setReceiverAmount(e.target.value)}/>
            <input type={"submit"} value={"Send money"}/>
            {loading ? <LoadingSpinner/> : ""}
        </form>
    )
}