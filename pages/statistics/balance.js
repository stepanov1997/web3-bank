import React, {useEffect, useState} from 'react';
import convertibleMarkDao from "../../core/dao/convertible-mark-contract";
import {StatisticBar} from "../../components/statistic-bar/statistic-bar";
import {Segment} from "semantic-ui-react";

export const StatisticsBalancePage = () => {
    const [transferHistory, setTransferHistory] = useState([])

    useEffect(() => {
        (async function asyncFunction() {
            const history = await convertibleMarkDao.pastEvents(null);
            setTransferHistory(history);
        })()
    }, [])

    return <div style={{textAlign: 'center'}}>
        <Segment>
            <StatisticBar history={transferHistory}
                          title={"Transactions grouped by sender"}
                          addressIndex={0}
                          dataIndex={2}
            />
        </Segment>
        <Segment>
            <StatisticBar history={transferHistory}
                          title={"Transactions grouped by receiver"}
                          addressIndex={1}
                          dataIndex={2}
            />
        </Segment>
    </div>;
}

export default StatisticsBalancePage;
