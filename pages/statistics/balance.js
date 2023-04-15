import React, {useEffect, useState} from 'react';
import convertibleMarkDao from "../../core/dao/convertible-mark-contract";
import {StatisticBar} from "../../components/statistic-bar/statistic-bar";

export const StatisticsBalancePage = () => {
    const [transferHistory, setTransferHistory] = useState([])

    useEffect(() => {
        (async function asyncFunction() {
            const history = await convertibleMarkDao.pastEvents(null);
            setTransferHistory(history);
        })()
    }, [])

    return <div className={"ui scroll"}>
        <StatisticBar history={transferHistory}
                      title={"Transactions grouped by sender"}
                      addressIndex={0}
                      dataIndex={2}
        />
        <StatisticBar history={transferHistory}
                      title={"Transactions grouped by receiver"}
                      addressIndex={1}
                      dataIndex={2}
        />
    </div>;
}

export default StatisticsBalancePage;
