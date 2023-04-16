import React, {useEffect, useState} from 'react';
import {Form, Input, Select, Button, Loader, Label, Icon, Segment} from 'semantic-ui-react';
import {
    convertEthsToKm,
    convertKmsToEth,
    getInterestRate,
    getLtvRatio
} from "../../core/dao/loan-withdraw-contract/dao";
import {totalSupply} from "../../core/dao/convertible-mark-contract/dao";
import useAsyncSemaphore from "../../util/semaphore";

// Konverzija valute
const currencyConverter = async (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === 'KM' && toCurrency === 'ETH') {
        return await convertKmsToEth(amount)
    }
    if (fromCurrency === 'ETH' && toCurrency === 'KM') {
        return await convertEthsToKm(amount)
    }
    return new Promise((resolve, reject) => reject("Unsupported currency..."))
};

const LoanWithdrawCalculatePage = x => {
    const {acquire, release} = useAsyncSemaphore();

    const [collateralAmount, setCollateralAmount] = useState(0);
    const [collateralCurrency, setCollateralCurrency] = useState('ETH');
    const [loanAmount, setLoanAmount] = useState(0);
    const [loanCurrency, setLoanCurrency] = useState('KM');
    const [expectedLtvRatio, setExpectedLtvRation] = useState(undefined);
    const [interestRate, setInterestRate] = useState(undefined);
    const [collateralValueInKm, setCollateralValueInKm] = useState(0);
    const [loanAmountValueInEth, setLoanAmountValueInEth] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async function () {
            await handleSubmit();
        })()
    }, [loanAmount, collateralAmount])

    const handleSubmit = async () => {
        await acquire();
        setLoading(true);

        try {
            // Get LTV ratio
            const ltvRatio = await getLtvRatio();
            setExpectedLtvRation(ltvRatio)

            // Konverzija valute
            const convertedCollateralAmount = await currencyConverter(collateralAmount, collateralCurrency, loanCurrency);
            setCollateralValueInKm(convertedCollateralAmount)

            // Konverzija valute
            const convertedLoanAmount = await currencyConverter(loanAmount, loanCurrency, collateralCurrency);
            setLoanAmountValueInEth(convertedLoanAmount)

            // Get LTV ratio
            const interestRate = await getInterestRate();
            setInterestRate(interestRate)

        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
            release();
        }
    };

    const total = loanAmount * (100 + interestRate) / 100;

    const collateralDownLimit = loanAmountValueInEth * (expectedLtvRatio) / 100;
    const collateralUpLimit = loanAmountValueInEth;

    const loanDownLimit = collateralValueInKm;
    const loanUpLimit = collateralValueInKm * (200 - expectedLtvRatio) / 100;

    const loanValidation = (loanAmount >= loanDownLimit && loanAmount <= loanUpLimit)
        ? (<span>
            <Icon name={"checkmark"}/>
        </span>)
        : (<span>
            <Icon name={"x"}/> (Not in range)
        </span>)

    const collateralValidation = (collateralAmount >= collateralDownLimit && collateralAmount <= collateralUpLimit)
        ? (<span>
            <Icon name={"checkmark"}/>
        </span>)
        : (<span>
            <Icon name={"x"}/> (Not in range)
        </span>)
    return (
        <div style={{textAlign: 'center'}}>
            <Segment>
                <h3>Loan Calculator</h3>
            </Segment>
            <Segment>
                <Form>
                    <Form.Group widths="equal">
                        <Form.Field
                            control={Input}
                            type="number"
                            label="Loan Amount"
                            value={loanAmount}
                            onChange={async (e, {value}) => {
                                setLoanAmount(value);
                            }}
                        />
                        <Form.Field
                            control={Select}
                            label="Loan Currency"
                            options={[
                                {key: 'KM', text: 'KM', value: 'KM'},
                            ]}
                            value={'KM'}
                            disabled={true}
                            onChange={(e, {value}) => setLoanCurrency(value)}
                        />
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Field
                            control={Input}
                            type="number"
                            label="Collateral Amount"
                            value={collateralAmount}
                            onChange={async (e, {value}) => {
                                setCollateralAmount(value);
                            }}
                        />
                        <Form.Field control={Select}
                                    label="Collateral Currency"
                                    options={[
                                        {key: 'ETH', text: 'ETH', value: 'ETH'}
                                    ]}
                                    value={'ETH'}
                                    disabled={true}
                                    onChange={(e, {value}) => setCollateralCurrency(value)}
                        />
                    </Form.Group>
                </Form>
                <br/>
                {loading && <Loader active inline="centered"/>}
            </Segment>
            <Segment>
                {collateralValueInKm !== 0 && (
                    <div style={{textAlign: "center"}}>
                        <h3>Loan Details:</h3>
                        <hr/>
                        <p>
                            Collateral
                            Amount: {collateralAmount} {collateralCurrency} (<b>{collateralValueInKm} {loanCurrency}</b>)
                        </p>
                        <p>
                            Allowed loan
                            range: <b>{loanDownLimit}</b> - <b>{loanUpLimit} {loanCurrency}</b> (LTV: {expectedLtvRatio}%)
                        </p>
                        <p>
                            Allowed collateral
                            range: <b>{collateralDownLimit}</b> - <b>{collateralUpLimit} {collateralCurrency}</b> (LTV: {expectedLtvRatio}%)
                        </p>
                        <p>Loan Amount: {loanAmount} {loanCurrency} {loanValidation}</p>
                        <p>Collateral Amount: {collateralAmount} {collateralCurrency} {collateralValidation}</p>
                        <hr/>
                        <p>Loan Amount: {loanAmount} {loanCurrency}</p>
                        <p>Interest rate: {loanAmount * (interestRate) / 100} {loanCurrency} ({interestRate}%)</p>
                        <h4>Total: {total} {loanCurrency}</h4>
                    </div>
                )}
            </Segment>
        </div>
    );
};

export default LoanWithdrawCalculatePage;