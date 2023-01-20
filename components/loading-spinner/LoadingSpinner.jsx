import React from 'react'
import Image from 'next/image'
import image from '../../public/loading.gif'

export function LoadingSpinner() {
    return (<Image src={image} alt={"no pic"} width={200} height={100}/>);
}