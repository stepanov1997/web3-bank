function adaptNumber(amount) {
    const amountN = BigInt(amount);
    const decimalsN = BigInt(Math.pow(10, 18));
    return (amountN * decimalsN).toString();
}

function fromAdaptedNumber(amount) {
    const amountN = BigInt(amount);
    const decimalsN = BigInt(Math.pow(10, 16));
    const balanceString = (amountN / decimalsN).toString();
    return parseFloat(balanceString) / 100;
}

export {adaptNumber,fromAdaptedNumber}