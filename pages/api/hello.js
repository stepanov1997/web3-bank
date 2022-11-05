// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import web3 from "../../ethereum/web3";
const { CONTRACT_CONVERTIBLE_MARK } = process.env;

export default function handler(req, res) {
  const {abi} = require("../../ethereum/build/ConvertibleMark.json")
  const contract = web3.eth.Contract(abi, CONTRACT_CONVERTIBLE_MARK)
  let balance = contract.methods.balanceOf(web3.address);
  res.status(200).json(balance + " KM")
}
