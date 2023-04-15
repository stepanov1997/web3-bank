import {useState, useEffect} from 'react';
import {Header, Segment, Grid, Button, Input} from 'semantic-ui-react';
import {deposit, getInterestedRate, savings, withdraw} from "../../core/dao/savings/dao";
import {useDispatch, useSelector} from "react-redux";
import {executeRefresh, selectRefresh} from "../../redux-slices/refresh-slice";
import {selectAddress, setAddress} from "../../redux-slices/address-slice";
import providerDao from "../../core/dao/provider";
import {selectBalance, setBalance} from "../../redux-slices/balance-slice";
import {balanceOf} from "../../core/dao/convertible-mark-contract/dao";

export default function SavingsCalculatePage() {
    const [currentBalance, setCurrentBalance] = useState(0);
    const [savingBalance, setSavingBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [depositError, setDepositError] = useState(undefined);
    const [withdrawError, setWithdrawError] = useState(undefined);

    const [newBalanceAfterDeposit, setNewBalanceAfterDeposit] = useState(0);
    const [newSavingBalanceAfterDeposit, setNewSavingBalanceAfterDeposit] = useState(0);
    const [newBalanceAfterWithdraw, setNewBalanceAfterWithdraw] = useState(0);
    const [newSavingBalanceAfterWithdraw, setNewSavingBalanceAfterWithdraw] = useState(0);
    const [potentialInterestRate, setPotentialInterestRate] = useState(0);
    const [totalWithInterestedRate, setTotalWithInterestedRate] = useState(0);

    useEffect(() => {
        calculate();
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
        const isDepositOk = checkDeposit();
        const isWithdrawOk = checkWithdraw();

        if (!(isWithdrawOk || isDepositOk)) {
            return;
        }

        setNewBalanceAfterDeposit(currentBalance - depositAmount);
        setNewSavingBalanceAfterDeposit(savingBalance + depositAmount);

        const interestRate = await getInterestedRate();
        setPotentialInterestRate(interestRate);

        setNewBalanceAfterWithdraw(currentBalance - depositAmount + withdrawAmount);
        setNewSavingBalanceAfterWithdraw(savingBalance + depositAmount - withdrawAmount);
        setTotalWithInterestedRate(newSavingBalanceAfterWithdraw + interestRate * depositAmount / 100.0);
    };

    return (
        <Segment raised>
            <Header as="h2">Saving calculator</Header>
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
                                <p>New balance: {newBalanceAfterDeposit} KM</p>
                                <p>New saving balance: {newSavingBalanceAfterDeposit} KM</p>
                                <hr/>
                                <Header as="h4">Balances after withdraw:</Header>
                                <p>New balance: {newBalanceAfterWithdraw} KM</p>
                                <p>New saving balance: {newSavingBalanceAfterWithdraw} KM</p>
                                <hr/>
                                <Header as="h4">Total:</Header>
                                <p>Total without interest rate: {newSavingBalanceAfterWithdraw} KM</p>
                                <p>Interest rate: {potentialInterestRate}%
                                    = {Math.round((totalWithInterestedRate - newSavingBalanceAfterWithdraw)*100)/100.0} KM</p>
                                <p><b>Total: {totalWithInterestedRate} KM</b></p>
                            </div>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
}