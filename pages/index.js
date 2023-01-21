import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from "react";
import convertibleMarkDao from '../core/dao/convertible-mark-contract'
import providerDao from '../core/dao/provider'
import SendTransaction from "../components/send-transaction";
import Mint from "../components/mint";
import Balance from "../components/balance";

export default function Home() {
    const [balance, setBalance] = useState(0.0);
    const [address, setAddress] = useState("undefined");
    const [refresh, setRefresh] = useState(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(
        providerDao.accountsChangedCallback(
            (address) => setAddress(address)
        ),
        [refresh]
    );

    useEffect(() => {
        (async function asyncFunction() {
            const currentAddress = await providerDao.currentAddress();
            try {
                setBalance(await convertibleMarkDao.balanceOf(currentAddress))
            } catch (e) {
                console.log("Can't get a balance.", e)
            }
            setAddress(currentAddress)
        })()
    }, [address, refresh])

    const refreshMethod = () => setRefresh(old => !old)

    // noinspection JSValidateTypes
    return (
        <div className={styles.container}>
            <Head>
                <title>Web3 bank</title>
                <link rel="icon" href="/favicon.png"/>
            </Head>
            <Balance address={address} balance={balance}/>
            <SendTransaction balance={balance} refresh={refreshMethod}/>
            <br></br>
            <Mint address={address} refresh={refreshMethod}/>
        </div>
    )
}
