import React, {useEffect, useState} from 'react';
import {pastLendEvents, pastLiquidateEvents, pastRepayEvents} from "../../core/dao/loan-withdraw-contract/dao";
import {StatisticBar} from "../../components/statistic-bar/statistic-bar";

export const StatisticsLoanWithdrawPage = () => {

    const [lentHistory, setLentHistory] = useState([])
    const [repayHistory, setRepayHistory] = useState([])
    const [liquidateHistory, setLiquidateHistory] = useState([])

    useEffect(() => {
        (async function asyncFunction() {
            const lentHistory = await pastLendEvents(null);
            setLentHistory(lentHistory);

            const repayHistory = await pastRepayEvents(null);
            setRepayHistory(repayHistory);

            const liquidateHistory = await pastLiquidateEvents(null);
            setLiquidateHistory(liquidateHistory);
        })()
    }, [])

    return <div className={"ui scroll"}>
        <StatisticBar history={lentHistory}
                      title={"Lent loans"}
                      addressIndex={1}
                      dataIndex={2}
        />
        <StatisticBar history={lentHistory}
                      title={"Lent collateral"}
                      addressIndex={1}
                      dataIndex={3}
        />
        <StatisticBar history={repayHistory}
                      title={"Repayed loans"}
                      addressIndex={1}
                      dataIndex={2}
        />
        <StatisticBar history={liquidateHistory}
                      title={"Liquidated loans"}
                      addressIndex={2}
                      dataIndex={3}
        />
    </div>;
}

export default StatisticsLoanWithdrawPage;
