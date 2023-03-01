import React from 'react'
import {Dimmer, Loader} from "semantic-ui-react";

export function LoadingSpinner() {
    return (
        <Dimmer active inverted>
            <Loader inverted content='Waiting for interaction with Metamask' />
        </Dimmer>
    );
}