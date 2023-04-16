import React from 'react'

import {Icon, Sidebar, Menu, Segment, Button,} from "semantic-ui-react";
import {useRouter} from "next/router";

function exampleReducer(state, action) {
    switch (action.type) {
        case 'CHANGE_ANIMATION':
            return { ...state, animation: action.animation, visible: !state.visible }
        case 'CHANGE_DIMMED':
            return { ...state, dimmed: action.dimmed }
        case 'CHANGE_DIRECTION':
            return { ...state, direction: action.direction, visible: false }
        default:
            throw new Error()
    }
}

export default function MySidebar({children}) {
    const {pathname} = useRouter()
    const [state, dispatch] = React.useReducer(exampleReducer, {
        animation: 'overlay',
        direction: 'left',
        dimmed: false,
        visible: false,
    })
    const { animation, dimmed, direction, visible } = state

    function fillSidebar() {
        if (pathname.startsWith("/home")) {
            return (
                <Sidebar
                    as={Menu}
                    animation={animation}
                    direction={direction}
                    icon='labeled'
                    inverted
                    vertical
                    visible={visible}
                    width='thin'
                >
                    <Menu.Item as='a' link={true} href={'/home/balance'}>
                        <Icon name='credit card'/>
                        Current balance
                    </Menu.Item>
                    <Menu.Item as='a' link={true} href={'/home/history'}>
                        <Icon name='history'/>
                        History of transanctions
                    </Menu.Item>
                    <Menu.Item as='a' link={true} href={'/home/send'}>
                        <Icon name='send'/>
                        Send a crypto money
                    </Menu.Item>
                </Sidebar>
            );
        } else if (pathname.startsWith("/loan-withdraw")) {
            return (
                <Sidebar
                    as={Menu}
                    animation={animation}
                    direction={direction}
                    icon='labeled'
                    inverted
                    vertical
                    visible={visible}
                    width='thin'
                >
                    <Menu.Item as='a' link={true} href={'/loan-withdraw/current'}>
                        <Icon name='percent'/>
                        Show current loans
                    </Menu.Item>
                    <Menu.Item as='a' link={true} href={'/loan-withdraw/request'}>
                        <Icon name='add'/>
                        Create request for loan withdraw
                    </Menu.Item>
                    <Menu.Item as='a' link={true} href={'/loan-withdraw/calculate'}>
                        <Icon name='calculator'/>
                        Calculate loan
                    </Menu.Item>
                </Sidebar>
            );
        } else if (pathname.startsWith("/savings")) {
            return (
                <Sidebar
                    as={Menu}
                    animation={animation}
                    direction={direction}
                    icon='labeled'
                    inverted
                    vertical
                    visible={visible}
                    width='thin'
                >
                    <Menu.Item as='a' link={true} href={'/savings/current'}>
                        <Icon name='box'/>
                        Show current savings
                    </Menu.Item>
                    <Menu.Item as='a' link={true} href={'/savings/calculate'}>
                        <Icon name='calculator'/>
                        Calculate interesting savings
                    </Menu.Item>
                </Sidebar>
            );
        } else if (pathname.startsWith("/statistics")) {
            return (
                <Sidebar
                    as={Menu}
                    animation={animation}
                    direction={direction}
                    icon='labeled'
                    inverted
                    vertical
                    visible={visible}
                    width='thin'
                >
                    <Menu.Item as='a' link={true} href={'/statistics/balance'}>
                        <Icon name='chart bar'/>
                        Balance statistics
                    </Menu.Item>
                    <Menu.Item as='a' link={true} href={'/statistics/loan-withdraw'}>
                        <Icon name='chart bar'/>
                        Loan withdraw statistics
                    </Menu.Item>
                    <Menu.Item as='a' link={true} href={'/statistics/savings'}>
                        <Icon name='chart bar'/>
                        Savings statistics
                    </Menu.Item>
                </Sidebar>
            )
        }
    }

    return (
        <div>
            <Button
                onClick={() =>
                    dispatch({ type: 'CHANGE_ANIMATION', animation: 'overlay' })
                }
            >
            {visible ? "Hide menu" : "Show menu"}
            </Button>
            <Sidebar.Pushable as={Segment}>
                {fillSidebar()}
                <Sidebar.Pusher dimmed={dimmed && visible}>
                    <Segment basic>
                        {children}
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>

    )
}