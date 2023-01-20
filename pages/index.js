import Head from 'next/head'
import styles from '../styles/Home.module.css'
import convertibleMarkContract from "../util/contractDao/ConvertibleMarkContract";
import React, {useEffect, useState} from "react";
import providerDao from "../util/providerDao";
import {LoadingSpinner} from "../components/loading-spinner";

export default function Home() {
    const [balance, setBalance] = useState(0.0);
    const [address, setAddress] = useState(undefined);
    const [addresses, setAddresses] = useState([]);
    const [receiverAddress, setReceiverAddress] = useState("");
    const [receiverAmount, setReceiverAmount] = useState(10);

    const [mintAmount, setMintAmount] = useState(1n);

    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState("")

    const provider = providerDao?.getMetamaskProvider();
    const signer = provider?.getSigner()

    const connect = async () => {
        try {
            const addresses = await provider.provider.request({method: "eth_requestAccounts"});
            setAddresses(addresses)
            setAddress(addresses[0])
        } catch (e) {
            console.log("error in request", e);
            location.reload();
        }
    };

    const accountChangedListener = (accounts) => {
        setAddresses(accounts)
        setAddress(accounts[0])
    };

    useEffect(() => {
        provider?.provider.on("accountsChanged", accountChangedListener);
        return () => {
            if (provider && provider.removeListener) {
                provider.provider.removeListener("accountsChanged", accountChangedListener);
            }
        };
    }, []);

    useEffect(() => {
        async function asyncFunction() {
            const accounts = await provider?.listAccounts();

            if (!accounts || accounts.length === 0) {
                return;
            }

            try {
                const blnc = await convertibleMarkContract.balanceOf(accounts[0]);
                setBalance(fromAdaptedNumber(blnc))
            } catch (e) {
                console.log("Can't get a balance.", e)
            }

            setAddresses(accounts)
            setAddress(accounts[0])
        }

        asyncFunction()
    }, [address, refresh, loading])

    async function sendTransaction(event) {
        event.preventDefault();

        setLoading("transaction")

        if (receiverAmount > balance) {
            window.alert("Receiver amount is less than current balance!")
            setLoading("")
            return false;
        }
        if (!address) {
            window.alert('There is no address of wallet.')
            setLoading("")
            return false;
        }
        const contract = convertibleMarkContract.connect(signer);
        const transactionHash = await contract.transfer(receiverAddress, adaptNumber(receiverAmount));
        const status = await provider.waitForTransaction(transactionHash.hash)
        if (status === 0 || status === null) {
            window.alert('Transaction is not processed successfully.')
            setLoading("")
            return false;
        }
        window.alert("You successfully sent a transaction!")
        setRefresh(oldState => !oldState)
        setLoading("")
        return true;
    }

    async function mint(event) {
        event.preventDefault();

        setLoading('mint')

        try {
            if (!confirm(`Are you sure you want to mint ${mintAmount} KM?`)) {
                window.alert("Ok.")
                setLoading("")
                return false;
            }
            if (!address) {
                window.alert('There is no address of wallet.')
                setLoading("")
                return false;
            }
            const contract = convertibleMarkContract.connect(signer);
            const transactionHash = await contract.mint(address, adaptNumber(mintAmount));
            const status = await provider.waitForTransaction(transactionHash.hash)
            if (status === 0 || status === null) {
                window.alert('Transaction is not processed successfully.')
                setLoading("")
                return false;
            }
            window.alert("You successfully sent a mint transaction!")
            setRefresh(oldState => !oldState)
        } catch (e) {
            console.error("Mint error: " + e)
            return false;
        } finally {
            setLoading("")
        }
        return true;
    }

    function adaptNumber(amount) {
        const amountN = BigInt(amount);
        const decimalsN = BigInt(Math.pow(10, 18));
        return (amountN * decimalsN).toString();
    }

    function fromAdaptedNumber(amount) {
        const amountN = BigInt(amount);
        const decimalsN = BigInt(Math.pow(10, 16));
        const balanceString = (amountN / decimalsN).toString();
        return parseFloat(balanceString) / 100;
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <button onClick={connect}>Connect</button>
            <select>
                {
                    addresses?.map((value, index) => (
                        <option key={index}>{value}</option>
                    ))
                }
            </select>
            <p>{balance} KM ({address})</p>

            <form onSubmit={async event => await sendTransaction(event)}>
                <p>Send crypto KM to wallet:</p>
                <input type={"text"} value={receiverAddress} onChange={e => setReceiverAddress(e.target.value)}/>
                <input type={"number"} value={receiverAmount}
                       onChange={e => setReceiverAmount(parseFloat(e.target.value))}/>
                <input type={"submit"} value={"Send money"}/>
                {loading === 'transaction' ? <LoadingSpinner/> : ""}
            </form>
            <br></br>

            <form onSubmit={async event => await mint(event)}>
                <p>Mint KM for account:</p>
                <input type={"number"} value={mintAmount}
                       onChange={e => setMintAmount(parseFloat(e.target.value))}/>
                <input type={"submit"} value={"Mint money"}/>
                {loading === 'mint' ? <LoadingSpinner/> : ""}
            </form>

        </div>
    )
}
