import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import {wrapper} from "../store/store";
import {Provider} from "react-redux";
import Head from "next/head";
import React from "react";
import Header from "../components/header/header";
import MySidebar from "../components/sidebar/sidebar";

export default function MyApp({Component, ...rest}) {
    const {store, props} = wrapper.useWrappedStore(rest);

    return (
        <Provider store={store}>
            <Head>
                <title>Web3 bank</title>
                <link rel="icon" href="/favicon.png"/>
            </Head>
            <Header/>
            <MySidebar>
                <Component {...props.pageProps} />
            </MySidebar>
        </Provider>
    )
}
