import React, {useEffect, useState} from "react";
import convertibleMarkDao from '../../core/dao/convertible-mark-contract'
import providerDao from '../../core/dao/provider'
import {useDispatch, useSelector} from "react-redux";
import {selectAddress, setAddress} from "../../redux-slices/address-slice";
import {selectRefresh} from "../../redux-slices/refresh-slice";
import {Icon, Table} from "semantic-ui-react";
import {fromAdaptedNumber} from "../../core/convertibleMarkParser";

export default function HomeHistoryPage() {
    const dispatch = useDispatch();
    const refresh = useSelector(selectRefresh);
    const address = useSelector(selectAddress);
    const [history, setHistory] = useState([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(
        providerDao.accountsChangedCallback(
            (address) => dispatch(setAddress(address))
        ),
        [refresh]
    );

    useEffect(() => {
        (async function asyncFunction() {
            const currentAddress = await providerDao.currentAddress();
            const history = await convertibleMarkDao.pastEvents(currentAddress);
            console.log(history)
            setHistory(history);
        })()
    }, [address, refresh])

    function calculateColor(event) {
        return event.type === 'sender' ? 'red' : 'green';
    }

    function sendOrReceiverComponent(event, senderOrReceiver, receiverOrSenderAddress) {
        return <>
            {event.type === senderOrReceiver ? (
                <Icon color='green' name='checkmark' size='large'/>
            ) : (
                <span style={{color: calculateColor(event), fontWeight: 'bold'}}>
                    {receiverOrSenderAddress}
                </span>
            )}
        </>;
    }

    function paymentSnapComponent(event) {
        return <snap style={{color: calculateColor(event), fontWeight: 'bold'}}>
            {(event.type === 'sender' ? '-' : '+')} {fromAdaptedNumber(event.args[2])} KM
        </snap>;
    }

// noinspection JSValidateTypes
    return (
        <div>
            <div className="ui segment">
                History
            </div>
            <div className="ui segment">
                <Table celled structured>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell rowSpan='2' colSpan='1'>Transaction ID</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='1' colSpan='2'>Type</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2' colSpan='1'>Payment <br/>[Convertible mark]</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell>Sender</Table.HeaderCell>
                            <Table.HeaderCell>Receiver</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>{
                        history.map((event, index) => (
                            <Table.Row key={index}>
                                <Table.Cell collapsing={true}>{event.transactionHash}</Table.Cell>
                                <Table.Cell textAlign='center'>
                                    {sendOrReceiverComponent(event, 'sender', event.args.from)}
                                </Table.Cell>
                                <Table.Cell textAlign='center'>
                                    {sendOrReceiverComponent(event, 'receiver', event.args.to)}
                                </Table.Cell>
                                <Table.Cell textAlign='center'>
                                    {paymentSnapComponent(event)}
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }</Table.Body>
                </Table>
            </div>
        </div>
    )
}
