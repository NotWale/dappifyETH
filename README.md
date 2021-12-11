# dappifyETH
Very barebone Spotify/Soundcloud(?) dapp clone. Allows you to upload music to IPFS and save the hash on the blockchain.
It lets you upload mp3 files to ipfs, play them on the website and tip the user who uploaded it in eth.

Requirements:
Truffle: https://trufflesuite.com/

Ganache: https://trufflesuite.com/ganache/

How to use:

1. Open Ganache Server
2. Compile/Deploy the smart contract Dappify.sol in the main project folder using "truffle migrate --reset"
3. Install dependencies using "yarn" in the main project folder
4. Afterwards run the frontend with "yarn run start"
5. Connect to Ganache network with Metamask and import at least one account from Ganache using private keys.

