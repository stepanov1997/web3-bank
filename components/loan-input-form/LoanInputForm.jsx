import React, {useEffect, useState} from 'react'
import {Form} from "semantic-ui-react";

export const LoanInputForm = () => {
    const [loanValue, setLoanValue] = useState(BigInt(0))
    const [loanValueError, setLoanValueError] = useState(undefined)

    const [physicalCollateral, setPhysicalCollateral] = useState(false)

    const [physicalCollateralValue, setPhysicalCollateralValue] = useState(BigInt(0))
    const [physicalCollateralValueError, setPhysicalCollateralValueError] = useState(undefined)

    const [physicalCollateralCurrency, setPhysicalCollateralCurrency] = useState("USD")
    const [physicalCollateralDescription, setPhysicalCollateralDescription] = useState(undefined)

    const [cryptoCollateral, setCryptoCollateral] = useState(BigInt(0))
    const [cryptoCollateralError, setCryptoCollateralError] = useState(undefined)


    const [physicalCurrencies, setPhysicalCurrencies] = useState([])
    const [physicalOwnershipContract, setPhysicalOwnershipContract] = useState(undefined)

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setPhysicalOwnershipContract(file)
    };
    async function getCurrencies() {
        const url = 'https://openexchangerates.org/api/currencies.json';

        try {
            const response = await fetch(`${url}`);
            if (response.ok) {
                const currencies = await response.json();
                let options = Object
                    .entries(currencies)
                    .map(([symbol, description]) => ({
                        text:`${symbol} (${description})`,
                        value: symbol
                    }));
                setPhysicalCurrencies(options)
            } else {
                console.error(`Request failed with status code ${response.status}`);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    useEffect(
        () => {
            if (physicalCollateral) {
                setCryptoCollateral(undefined)
            } else {
                setPhysicalCollateralDescription(undefined);
                setPhysicalCollateralCurrency(undefined)
                setPhysicalCollateralValue(undefined)
            }
            (async function () {
                if(physicalCurrencies.length===0){
                    await getCurrencies()
                }
            })()
        }, []
    )

    return (
        <Form onSubmit={async () => {
            let doc = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(physicalOwnershipContract);
            });
            console.log({
                loanValue,
                physicalCollateralDescription,
                doc,
                physicalCollateralValue,
                physicalCollateral,
                cryptoCollateral,
                physicalCollateralCurrency
            })
        }
        }>
            <Form.Group widths='equal'>
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
            <Form.Group widths='equal'>{
                <>
                    <Form.Checkbox label='Is collateral physical?' checked={physicalCollateral} slider={true}
                                   onChange={(event, data) => setPhysicalCollateral(data.checked)}/>
                    {physicalCollateral ? (
                        <>
                            <Form.TextArea required label='Physical collateral description'
                                           placeholder='Tell us more about your collateral what do you offer!'
                                           value={physicalCollateralDescription}
                                           onChange={(event, data) => setPhysicalCollateralDescription(data.value)}/>
                            <Form.Input
                                type='file'
                                label='Upload a contract of ownership.'
                                onChange={handleFileChange}
                            />
                            <Form.Input required fluid type='number' label='Physical collateral value'
                                        placeholder='Physical currency value.'
                                        error={physicalCollateralValueError}
                                        onChange={(event, data) => {
                                            console.log(data.value)
                                            if (RegExp("^\\d+$").test(data.value)) {
                                                setPhysicalCollateralValueError(undefined)
                                                setPhysicalCollateralValue(BigInt(data.value));
                                            } else {
                                                setPhysicalCollateralValueError(`Integer value is required. ${data.value} is not integer value.`)
                                            }
                                        }}/>
                            <Form.Select required fluid label='Physical collateral currency'
                                options={physicalCurrencies}
                                placeholder='Choose Currency'
                                onChange={(event, data) => setPhysicalCollateralCurrency(data.value)}
                            />
                        </>
                    ) : (
                        <Form.Input required fluid type='number' label='Crypto collateral value'
                                    placeholder='Ethereum value.'
                                    error={cryptoCollateralError}
                                    onChange={(event, data) => {
                                        console.log(data.value)
                                        if (RegExp("^\\d+$").test(data.value)) {
                                            setCryptoCollateralError(undefined)
                                            setCryptoCollateral(BigInt(data.value));
                                        } else {
                                            setCryptoCollateralError(`Integer value is required. ${data.value} is not integer value.`)
                                        }
                                    }}/>
                    )}
                </>

            }</Form.Group>
            <Form.Checkbox required label='I agree to the Terms and Conditions'/>
            <Form.Button>Submit</Form.Button>
        </Form>
    )
}