import React from "react";
import {useRouter} from 'next/router'
import {Menu} from "semantic-ui-react";

export default function Header() {
    const {pathname} = useRouter()

    function isActive(pageName) {
        return pathname.substring(1) === pageName;
    }

    return (
        <Menu pointing secondary>
            <Menu.Item
                name='Home'
                active={isActive("")}
                link
                href='/'
            />
            <Menu.Item
                name='Loan withdraw'
                active={isActive("loan-withdraw")}
                link
                href='/loan-withdraw'
            />
            <Menu.Item
                name='Savings'
                active={isActive("savings")}
                link
                href='/savings'
            />
            <Menu.Item
                name='Statistics'
                active={isActive("statistics")}
                link
                href='/statistics'
            />
            <Menu.Menu position='right'>
                <Menu.Item
                    name='Logout'
                    active={isActive("logout")}
                    link
                    href='/logout'
                />
            </Menu.Menu>
        </Menu>
    )
}