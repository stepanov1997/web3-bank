import React, {useEffect, useState} from "react";
import providerDao from '../../core/dao/provider'
import {useDispatch, useSelector} from "react-redux";
import {selectAddress, setAddress} from "../../redux-slices/address-slice";
import {executeRefresh, selectRefresh} from "../../redux-slices/refresh-slice";
import {getCollateral, getLoan, getInterestRate, repay} from "../../core/dao/loan-withdraw-contract/dao";
import {Form, Statistic} from "semantic-ui-react";
import Image from "next/image";
import {balanceOf} from "../../core/dao/convertible-mark-contract/dao";

export default function LoanWithdrawCurrentPage() {
    const [loan, setLoan] = useState(0);
    const [collateral, setCollateral] = useState(0);

    const [repayValue, setRepayValue] = useState(0);

    const dispatch = useDispatch();
    const refresh = useSelector(selectRefresh);
    const address = useSelector(selectAddress);

    const onSubmit = async (event) => {
        event.preventDefault()
        const balance = await balanceOf(address);
        if (repayValue > balance) {
            alert(`You don't have enough money (Balance: ${balance} KM).`)
            return false;
        }
        const interestRate = await getInterestRate();
        console.log(interestRate)
        console.log(repayValue)
        const repayValueWithInterestRate = repayValue * (100 + interestRate) / 100;
        console.log(repayValueWithInterestRate)
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
        <div className="ui segment">
            <h2>Loan Status</h2>
            <div style={{textAlign: "center"}}>
                <p>{address}</p>
                {convertibleMarkLoanBalance(loan)}
                {ethereumCollateralBalance(collateral)}
            </div>
            <Form onSubmit={onSubmit} style={{textAlign: "center", marginTop: "80px"}}>
                <p>Repay the loan: </p>
                <Form.Group style={{textAlign: "center"}}>
                    <Form.Input type={"number"}
                                value={repayValue}
                                onChange={event => setRepayValue(event.target.value)}/>
                </Form.Group>
                <Form.Group style={{textAlign: "center"}}>
                    <Form.Input type="submit" value="Repay"/>KM
                </Form.Group>
            </Form>
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
