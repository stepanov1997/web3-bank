import {LoadingSpinner} from "../loading-spinner";
import React, {useState} from "react";
import convertibleMarkDao from "../../core/dao/convertible-mark-contract";
import {useDispatch, useSelector} from "react-redux";
import {selectAddress} from "../../redux-slices/address-slice";
import {executeRefresh} from "../../redux-slices/refresh-slice";


export const Mint = () => {
    const [loading, setLoading] = useState("")
    const [mintAmount, setMintAmount] = useState(1n);

    const address = useSelector(selectAddress);
    const dispatch = useDispatch();

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
            dispatch(executeRefresh())
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
            <h3>Ovo treba obrisati, jer nema smisla da postoji.</h3>
            <p>Mint KM for account:</p>
            <input type={"number"} value={mintAmount.toString()}
                   onChange={e => setMintAmount(e.target.value)}/>
            <input type={"submit"} value={"Mint money"}/>
            {loading === 'mint' ? <LoadingSpinner/> : ""}
        </form>
    )
}