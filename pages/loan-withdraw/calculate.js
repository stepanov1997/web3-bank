import React, {useEffect, useState} from 'react';
import {Form, Input, Select, Button, Loader, Label, Icon} from 'semantic-ui-react';
import {convertEthsToKm, convertKmsToEth, getLtvRatio} from "../../core/dao/loan-withdraw-contract/dao";
import {totalSupply} from "../../core/dao/convertible-mark-contract/dao";
import useAsyncSemaphore from "../../util/semaphore";

// Konverzija valute
const currencyConverter = async (amount, fromCurrency, toCurrency) => {
    if(fromCurrency==='KM' && toCurrency==='ETH') {
        return await convertKmsToEth(amount)
    }
    if(fromCurrency==='ETH' && toCurrency==='KM') {
        return await convertEthsToKm(amount)
    }
    return new Promise((resolve, reject) => reject("Unsupported currency..."))
};

const LoanWithdrawCalculatePage = x => {
    const { acquire, release } = useAsyncSemaphore();

    const [collateralAmount, setCollateralAmount] = useState(0);
    const [collateralCurrency, setCollateralCurrency] = useState('ETH');
    const [loanAmount, setLoanAmount] = useState(0);
    const [loanCurrency, setLoanCurrency] = useState('KM');
    const [expectedLtvRatio, setExpectedLtvRation] = useState(undefined);
    const [collateralValueInEth, setCollateralValueInEth] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async function() {
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
            setCollateralValueInEth(convertedCollateralAmount)

        }catch (e) {
            console.log(e)
        }
        finally {
            setLoading(false);
            release();
        }
    };

    let calculatedLTV = loanAmount === 0 ? 0 : collateralValueInEth * 100 / loanAmount;

    let ltvRatioValidation = (calculatedLTV <= 100 && calculatedLTV > 0 && calculatedLTV >= expectedLtvRatio)
        ? (<span>
            {calculatedLTV.toFixed(2) + '%'}
            <Icon name={"checkmark"}/>
        </span>)
        : (<span>
            <Icon name={"x"}/>(Invalid ratio: {calculatedLTV})
        </span>)

    return (
        <div className="ui segment">
            <h2>Loan Calculator</h2>
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
                            { key: 'KM', text: 'KM', value: 'KM' },
                        ]}
                        value={'KM'}
                        disabled={true}
                        onChange={(e, { value }) => setLoanCurrency(value)}
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
                                    { key: 'ETH', text: 'ETH', value: 'ETH' }
                                ]}
                                value={'ETH'}
                                disabled={true}
                                onChange={(e, { value }) => setCollateralCurrency(value)}
                    />
                </Form.Group>
            </Form>
            <br />
            {loading && <Loader active inline="centered" />}
            {collateralValueInEth !== 0 && (
                <div>
                    <h3>Loan Details:</h3>
                    <br/>
                    <p>
                        Collateral Amount: {collateralAmount} {collateralCurrency} ({collateralValueInEth} {loanCurrency})
                    </p>
                    <p>
                        Loan Amount: {loanAmount} {loanCurrency}
                    </p>
                    <br/>
                    <p>
                        Expected LTV: {expectedLtvRatio}%
                    </p>
                    <p>
                        Calculated loan LTV: {ltvRatioValidation}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LoanWithdrawCalculatePage;