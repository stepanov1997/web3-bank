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
        animation: 'push',
        direction: 'left',
        dimmed: false,
        visible: true,
    })

    const { animation, dimmed, direction, visible } = state

    function fillSidebar() {
        switch(pathname) {
            case "/": return (
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
                    <Menu.Item as='a'>
                        <Icon name='credit card' />
                        Current balance
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name='history' />
                        History of transanctions
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name='send' />
                        Send a crypto money
                    </Menu.Item>
                </Sidebar>
            );
            case "/loan-withdraw": return (
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
                    <Menu.Item as='a'>
                        <Icon name='percent' />
                        Show current loans
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name='add' />
                        Create request for loan withdraw
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name='calculator' />
                        Calculate loan
                    </Menu.Item>
                </Sidebar>
            );
            case "/savings": return (
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
                    <Menu.Item as='a'>
                        <Icon name='box' />
                        Show current savings
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name='upload' />
                        Save a crypto money
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name='download' />
                        Take saved crypto money
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name='calculator' />
                        Calculate interesting savings
                    </Menu.Item>
                </Sidebar>
            );
            case "/statistics": return (
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
                    <Menu.Item as='a'>
                        <Icon name='chart bar' />
                        Balance statistics
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name='chart bar' />
                        Loan withdraw statistics
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name='chart bar' />
                        Savings statistics
                    </Menu.Item>
                </Sidebar>
            )
        }
    }

    return (
        <div style={{height: '100%'}}>
            <Button
                onClick={() =>
                    dispatch({ type: 'CHANGE_ANIMATION', animation: 'push' })
                }
            >
                Scale Down
            </Button>
            <Sidebar.Pushable as={Segment} style={{ overflow: 'hidden', height: '100%' }}>
                {
                    fillSidebar()
                }
                <Sidebar.Pusher dimmed={dimmed && visible}>
                    <Segment basic>
                        {children}
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>

    )
}