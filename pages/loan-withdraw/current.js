import React, {useEffect, useState} from "react";
import providerDao from '../../core/dao/provider'
import {useDispatch, useSelector} from "react-redux";
import {selectAddress, setAddress} from "../../redux-slices/address-slice";
import {executeRefresh, selectRefresh} from "../../redux-slices/refresh-slice";
import {getCollateral, getLoan, getInterestRate, repay} from "../../core/dao/loan-withdraw-contract/dao";
import {Button, Form, Input, Segment, Statistic} from "semantic-ui-react";
import Image from "next/image";
import {balanceOf} from "../../core/dao/convertible-mark-contract/dao";

export default function LoanWithdrawCurrentPage() {
    const [loan, setLoan] = useState(0);
    const [collateral, setCollateral] = useState(0);

    const [repayValue, setRepayValue] = useState(0);

    const dispatch = useDispatch();
    const refresh = useSelector(selectRefresh);
    const address = useSelector(selectAddress);

    const onClick = async (event) => {
        event.preventDefault()
        const balance = await balanceOf(address);
        if (repayValue > balance) {
            alert(`You don't have enough money (Balance: ${balance} KM).`)
            return false;
        }
        const interestRate = await getInterestRate();
        const repayValueWithInterestRate = repayValue * (100 + interestRate) / 100;
        if (repayValueWithInterestRate > balance) {
            alert(`You don't have enough money to pay interest rate (${repayValueWithInterestRate - balance})`)
            return false;
        }
        const loan = await getLoan(address);
        if (repayValue > loan) {
            alert(`Your loan to return is ${loan} KM.`)
            return false;
        }

        try {
            await repay(repayValue);
        } catch (e) {
            alert(`Error code: ${e.code}, reason: ${e.reason}`)
            return false;
        }
        dispatch(executeRefresh());
        return true;
    }

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
        <div style={{textAlign: "center"}}>
            <Segment>
                <h2>Loan Status</h2>
            </Segment>
            <Segment>
                <div>
                    <p>{address}</p>
                    {convertibleMarkLoanBalance(loan)}
                    {ethereumCollateralBalance(collateral)}
                </div>
            </Segment>
            <Segment>
                <div>
                    <p>Repay the loan: </p>
                    <Input type={"number"}
                           value={repayValue}
                           onChange={event => setRepayValue(event.target.value)}/> KM
                    <br/><br/>
                    <Button onClick={onClick}>Repay</Button>
                </div>
            </Segment>
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
