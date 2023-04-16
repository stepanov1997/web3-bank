import React, {useEffect, useState} from "react";
import {pastLendEvents, pastLiquidateEvents, pastRepayEvents} from "../../core/dao/loan-withdraw-contract/dao";
import {StatisticBar} from "../../components/statistic-bar/statistic-bar";
import {pastDepositEvents, pastInterestEvents, pastWithdrawEvents} from "../../core/dao/savings/dao";
import {Segment} from "semantic-ui-react";

export default function StatisticsSavingsPage() {
    const [depositHistory, setDepositHistory] = useState([])
    const [withdrawHistory, setWithdrawHistory] = useState([])
    const [interestHistory, setInterestHistory] = useState([])

    useEffect(() => {
        (async function asyncFunction() {
            const depositHistory = await pastDepositEvents(null);
            setDepositHistory(depositHistory);

            const withdrawHistory = await pastWithdrawEvents(null);
            setWithdrawHistory(withdrawHistory);

            const interestHistory = await pastInterestEvents(null);
            setInterestHistory(interestHistory);
        })()
    }, [])

    return <div style={{textAlign: 'center'}}>
        <Segment>
            <StatisticBar history={depositHistory}
                          title={"Deposit amount"}
                          addressIndex={1}
                          dataIndex={2}
            />
        </Segment>
        <Segment>
            <StatisticBar history={withdrawHistory}
                          title={"Withdraw amount"}
                          addressIndex={1}
                          dataIndex={2}
            />
        </Segment>
        <Segment>
            <StatisticBar history={interestHistory}
                          title={"Interest amount"}
                          addressIndex={1}
                          dataIndex={2}
            />
        </Segment>
    </div>;
}