cd hardhat || exit 1
#npx hardhat node &
npx hardhat run --network localhost scripts/deploy.js
cd ..
npm run dev