import React, {useEffect, useState} from 'react'
import {Form} from "semantic-ui-react";
import {convertEthsToKm, getLtvRatio, lend} from "../../core/dao/loan-withdraw-contract/dao";
import {LoadingSpinner} from "../loading-spinner";

export const LoanInputForm = () => {
    const [loading, setLoading] = useState(false)

    const [loanValue, setLoanValue] = useState(BigInt(0))
    const [loanValueError, setLoanValueError] = useState(undefined)

    const [collateral, setCollateral] = useState(BigInt(0))
    const [collateralError, setCollateralError] = useState(undefined)

    const [lendMessage, setLendMessage] = useState(undefined)

    return (
        <Form onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true)
            let convertedCollateral = await convertEthsToKm(collateral);
            let minimalLtvRatio = await getLtvRatio();
            let calculatedLtvRatio = convertedCollateral / Number(loanValue);
            if(calculatedLtvRatio * 100 < minimalLtvRatio) {
                setLendMessage(`Ratio is not as expected: ${calculatedLtvRatio.toFixed(3)*100}% < ${minimalLtvRatio}%`)
                setLoading(false)
                return false;
            }
            try {
                await lend(loanValue, collateral)
                setLendMessage(`The Loan of ${loanValue} KM is successfully lent.`)
            } catch (e) {
                setLendMessage("Error with lending a loan. Message: " + e.message)
            }
            setLoading(false)
            return true;
        }
        }>
            <Form.Group widths={5} style={{ display: 'flex', justifyContent: 'center' }}>
                <Form.Input required fluid type='number' label='Loan amount' placeholder='In Convertible marks'
                            error={loanValueError}
                            onChange={(event, data) => {
                                console.log(data.value)
                                if (RegExp("^\\d+$").test(data.value)) {
                                    setLoanValueError(undefined)
                                    setLoanValue(BigInt(data.value));
                                } else {
                                    setLoanValueError(`Integer value is required. ${data.value} is not integer value.`)
                                }
                            }}/>
            </Form.Group>
            <Form.Group widths={5} style={{ display: 'flex', justifyContent: 'center' }}>
                <Form.Input required fluid type='number' label='Crypto collateral value'
                            placeholder='Ethereum value.'
                            error={collateralError}
                            onChange={(event, data) => {
                                console.log(data.value)
                                if (RegExp("^\\d+$").test(data.value)) {
                                    setCollateralError(undefined)
                                    setCollateral(BigInt(data.value));
                                } else {
                                    setCollateralError(`Integer value is required. ${data.value} is not integer value.`)
                                }
                            }}/>
            </Form.Group>
            {!!loading ? <LoadingSpinner/> : (
                <Form.Group widths={5} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Form.Button>Submit</Form.Button>
                </Form.Group>
            )}
            <p>{lendMessage ?? ""}</p>
        </Form>
    )
}