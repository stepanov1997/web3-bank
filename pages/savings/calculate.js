import {useState, useEffect} from 'react';
import {Header, Segment, Grid, Input} from 'semantic-ui-react';
import {getInterestedRate} from "../../core/dao/savings/dao";
import useAsyncSemaphore from "../../util/semaphore";

export default function SavingsCalculatePage() {
    const {acquire, release} = useAsyncSemaphore();

    const [currentBalance, setCurrentBalance] = useState(0);
    const [savingBalance, setSavingBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const [depositError, setDepositError] = useState(undefined);
    const [withdrawError, setWithdrawError] = useState(undefined);

    useEffect(() => {
        (async function() {
            setInterestRate(await getInterestedRate());
        })()
    }, [currentBalance, savingBalance, depositAmount, withdrawAmount])

    useEffect(() => {
        (async function() {
            await acquire();
            await calculate();
            await release();
        })()
    }, [currentBalance, savingBalance, depositAmount, withdrawAmount])

    function checkDeposit() {
        if (depositAmount < 0) {
            setDepositError('Deposit amount must be greater or equals to zero');
            return false;
        }
        if (depositAmount > currentBalance) {
            setDepositError('Deposit amount must be lower or equals to current balance')
            return false;
        }
        setDepositError(undefined)
        return true;
    }

    function checkWithdraw() {
        if (withdrawAmount > depositAmount) {
            setWithdrawError('Withdraw amount must be greater than deposit amount');
            return false;
        }
        setWithdrawError(undefined)
        return true;
    }

    const calculate = async () => {
        checkDeposit();
        checkWithdraw();
    };

    return (
        <div style={{textAlign: 'center'}}>
            <Segment>
                <Header as="h2">Saving calculator</Header>
            </Segment>
            <Segment raised>
                <Grid columns={2} stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as="h4">Balance</Header>
                            <Input
                                label="Current balance"
                                type="number"
                                value={currentBalance}
                                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                                placeholder="Enter amount"
                            />
                            <Input
                                label="Saving balance"
                                type="number"
                                value={savingBalance}
                                onChange={(e) => setSavingBalance(Number(e.target.value))}
                                placeholder="Enter amount"
                            />
                            <Header as="h4">Input</Header>
                            <Input
                                label="Deposit Amount"
                                type="number"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(Number(e.target.value))}
                                placeholder="Enter amount"
                            />
                            <Input
                                label="Withdraw Amount"
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                                placeholder="Enter amount"
                            />
                        </Grid.Column>
                        <Grid.Column>
                            {(depositError || withdrawError) ? (
                                <div style={{color: 'red'}}>
                                    <Header as="h4">Errors</Header>
                                    {depositError && <p>Deposit error: {depositError}</p>}
                                    {withdrawError && <p>Withdraw error: {withdrawError}</p>}
                                    <hr/>
                                </div>
                            ) : (
                                <div>
                                    <Header as="h4">Previous account balances:</Header>
                                    <p>Old balance: {currentBalance} KM</p>
                                    <p>Old saving balance: {savingBalance} KM</p>
                                    <hr/>
                                    <Header as="h4">Balances after deposit:</Header>
                                    <p>New balance: {currentBalance - depositAmount} KM</p>
                                    <p>New saving balance: {savingBalance + depositAmount} KM</p>
                                    <hr/>
                                    <Header as="h4">Balances after withdraw:</Header>
                                    <p>New balance: {currentBalance - depositAmount + withdrawAmount} KM</p>
                                    <p>New saving balance: {savingBalance + depositAmount - withdrawAmount} KM</p>
                                    <hr/>
                                    <Header as="h4">Total:</Header>
                                    <p>Total without interest rate: {currentBalance - depositAmount + withdrawAmount} KM</p>
                                    <p>Interest rate: {withdrawAmount} * {interestRate}%
                                        = {withdrawAmount * interestRate / 100.0} KM</p>
                                    <p><b>Total: {currentBalance - depositAmount + (1 + interestRate / 100.0) * withdrawAmount} KM</b></p>
                                </div>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    );
}