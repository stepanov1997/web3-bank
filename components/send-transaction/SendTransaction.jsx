import {LoadingSpinner} from "../loading-spinner";
import React, {useState} from "react";
import convertibleMarkDao from "../../core/dao/convertible-mark-contract";
import {useDispatch, useSelector} from "react-redux";
import {selectBalance} from "../../redux-slices/balance-slice";
import {executeRefresh} from "../../redux-slices/refresh-slice";
import {Form, Input, Segment} from "semantic-ui-react";


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
        <>
            <Segment>
                <h3>Send crypto KM to wallet:</h3>
            </Segment>
            <Segment>
                <Form onSubmit={async event => await sendTransaction(event)}>
                    Receiver address: <Input type={"text"} value={receiverAddress}
                                             onChange={e => setReceiverAddress(e.target.value)}/><br/>
                    Amount: <Input type={"number"} value={receiverAmount}
                                   onChange={e => setReceiverAmount(e.target.value)}/> KM<br/><br/>
                    <Input type={"submit"} value={"Send money"}/><br/>
                    {loading ? <LoadingSpinner/> : ""}
                </Form>
            </Segment>
        </>

    )
}