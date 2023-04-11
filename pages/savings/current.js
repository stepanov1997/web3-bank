import { useState, useEffect } from 'react';
import { Header, Segment, Grid, Button, Input } from 'semantic-ui-react';
import {deposit, savings, withdraw} from "../../core/dao/savings/dao";
import {useDispatch, useSelector} from "react-redux";
import {executeRefresh, selectRefresh} from "../../redux-slices/refresh-slice";
import {selectAddress, setAddress} from "../../redux-slices/address-slice";
import providerDao from "../../core/dao/provider";
import {selectBalance, setBalance} from "../../redux-slices/balance-slice";
import {balanceOf} from "../../core/dao/convertible-mark-contract/dao";

export default function SavingsCurrentPage() {
    const [savedBalance, setSavedBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const dispatch = useDispatch();
    const refresh = useSelector(selectRefresh);
    const address = useSelector(selectAddress);
    const userBalance = useSelector(selectBalance);

    useEffect(() => {
        (async function() {
            try {
                const currentAddress = await providerDao.currentAddress();
                const balance = await balanceOf(currentAddress)
                dispatch(setBalance(balance))
                dispatch(setAddress(currentAddress))
                const savingsTotal = await savings(currentAddress)
                setSavedBalance(savingsTotal)
            } catch (error) {
                alert(error);
                setSavedBalance(0);
            }
        })();
    }, [refresh]);

    const handleDeposit = async () => {
        const depositAmountNum = Number(depositAmount);
        if (depositAmountNum <= 0) {
            alert('Deposit amount must be greater than zero');
            return;
        }

        if (depositAmountNum > userBalance) {
            alert('Deposit amount must not be greater than savedBalance')
            return;
        }

        try {
            await deposit(depositAmountNum);
            setDepositAmount('');
            dispatch(executeRefresh())
        } catch (error) {
            alert(error);
        }
    };

    const handleWithdraw = async () => {
        const withdrawAmountNum = Number(withdrawAmount);
        if (withdrawAmountNum <= 0) {
            alert('Withdrawal amount must be greater than zero');
            return;
        }

        if (withdrawAmountNum > savedBalance) {
            alert('Insufficient balance for withdrawal');
            return;
        }

        try {
            await withdraw(withdrawAmountNum);
            setWithdrawAmount('');
            dispatch(executeRefresh())
        } catch (error) {
            alert(error);
        }
    };

    return (
        <Segment raised>
            <Header as="h2">Savings Account</Header>
            <Grid columns={2} stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h4">Your Balance</Header>
                        <p>{savedBalance} KM</p>
                        <p>{userBalance} KM</p>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as="h4">Actions</Header>
                        <Input
                            label="Deposit Amount"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="Enter amount"
                        />
                        <Button onClick={handleDeposit}>Deposit</Button>
                        <Input
                            label="Withdraw Amount"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Enter amount"
                        />
                        <Button onClick={handleWithdraw}>Withdraw</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
}