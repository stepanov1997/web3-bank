import {LoadingSpinner} from "../loading-spinner";
import React, {useState} from "react";
import convertibleMarkDao from "../../core/dao/convertible-mark-contract";


export const Mint = ({address, refresh}) => {
    const [loading, setLoading] = useState("")
    const [mintAmount, setMintAmount] = useState(1n);

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
            const status = await convertibleMarkDao.mint(address, mintAmount)
            if (status === 0 || status === null) {
                window.alert('Transaction is not processed successfully.')
                setLoading("")
                return false;
            }
            window.alert("You successfully sent a mint transaction!")
            refresh()
        } catch (e) {
            console.error("Mint error: " + e)
            return false;
        } finally {
            setLoading("")
        }
        return true;
    }

    return (
        <form onSubmit={async event => await mint(event)}>
            <p>Mint KM for account:</p>
            <input type={"number"} value={mintAmount.toString()}
                   onChange={e => setMintAmount(e.target.value)}/>
            <input type={"submit"} value={"Mint money"}/>
            {loading === 'mint' ? <LoadingSpinner/> : ""}
        </form>
    )
}