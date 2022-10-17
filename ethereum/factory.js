import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

export default () => new web3.eth.Contract(
    JSON.parse(CampaignFactory.abi),
    '0x90e2b94532734E2999D4919Ea1b5263Bf35d4B0d'
)
