import React, {useEffect, useState} from "react";
import providerDao from '../../core/dao/provider'
import {useDispatch, useSelector} from "react-redux";
import {selectAddress, setAddress} from "../../redux-slices/address-slice";
import {selectRefresh} from "../../redux-slices/refresh-slice";
import {getCollateral, getLoan} from "../../core/dao/loan-withdraw-contract/dao";
import {Statistic} from "semantic-ui-react";
import Image from "next/image";

export default function LoanWithdrawCurrentPage() {

    const [ loan, setLoan ] = useState(0);
    const [ collateral, setCollateral ] = useState(0);

    const dispatch = useDispatch();
    const refresh = useSelector(selectRefresh);
    const address = useSelector(selectAddress);

    useEffect(() => {
        (async function asyncFunction() {
            const currentAddress = await providerDao.currentAddress();
            dispatch(setAddress(currentAddress))
            setLoan(await getLoan(currentAddress));
            setCollateral(await getCollateral(currentAddress));
        })()
    }, [address, dispatch, refresh])

    // noinspection JSValidateTypes
    return (
        <div className="ui segment">
            <h2>Loan Status</h2>
            <div style={{textAlign: "center"}}>
                <p>{address}</p>
                {convertibleMarkLoanBalance(loan)}
                {ethereumCollateralBalance(collateral)}
            </div>
            {/*<div style={{textAlign: "center"}}>*/}
            {/*    <p>Repay the loan: </p><input type={"number"} value={} onChange={event => setRepay()}/> KM<br/>*/}
            {/*    <button>Repay</button>*/}
            {/*</div>*/}
        </div>

    )
}

function ethereumCollateralBalance(collateral) {
    return <Statistic>
        <Statistic.Value>
                        <span style={{paddingRight: 10}}>
                            {collateral}
                        </span>
            <Image src={"/ethereum_logo.svg"}
                   width={10}
                   height={20}
                   alt={"No image"}
                   style={{
                       objectFit: "cover",
                       objectPosition: "center"
                   }}
            />
        </Statistic.Value>
        <Statistic.Label>Ethers</Statistic.Label>
    </Statistic>;
}

function convertibleMarkLoanBalance(loan) {
    return <Statistic>
        <Statistic.Value>
                        <span style={{paddingLeft: 50}}>
                            {loan}
                        </span>
            <Image src={"/logo-black.png"}
                   width={100}
                   height={150}
                   alt={"No image"}
                   style={{
                       objectFit: "cover",
                       objectPosition: "center"
                   }}
            />
        </Statistic.Value>
        <Statistic.Label>Convertible Mark</Statistic.Label>
    </Statistic>;
}
