import React, {useEffect} from "react";
import convertibleMarkDao from '../../core/dao/convertible-mark-contract'
import providerDao from '../../core/dao/provider'
import Balance from "../../components/balance";
import {useDispatch, useSelector} from "react-redux";
import {setBalance} from '../../redux-slices/balance-slice'
import {selectAddress, setAddress} from "../../redux-slices/address-slice";
import {selectRefresh} from "../../redux-slices/refresh-slice";
import {Segment} from "semantic-ui-react";

export default function HomeBalancePage() {
    const dispatch = useDispatch();
    const refresh = useSelector(selectRefresh);
    const address = useSelector(selectAddress);

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
            try {
                dispatch(setBalance(await convertibleMarkDao.balanceOf(currentAddress)))
            } catch (e) {
                console.log("Can't get a balance.js.", e)
            }
            dispatch(setAddress(currentAddress))
        })()
    }, [address, refresh])

    // noinspection JSValidateTypes
    return (
        <div style={{textAlign: 'center'}}>
            <Segment>
                <h3>Account balance</h3>
            </Segment>
            <Segment>
                <Balance/>
            </Segment>
        </div>
    )
}
