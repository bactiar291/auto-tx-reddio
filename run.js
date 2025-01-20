import { ethers } from "ethers";
import readline from "readline";
import chalk from "chalk";
import figlet from "figlet";

figlet('bactiar 291', (err, data) => {
  if (err) {
    console.log('Error generating banner:', err);
    return;
  }

  console.log(chalk.greenBright(data));
  console.log(chalk.yellowBright("\nPlease enter your private key below:\n"));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Private key: ', (privateKey) => {
      rl.close();

      
      const rpcUrl = 'https://reddio-dev.reddio.com';
      const network = {
          name: "reddio-devnet",
          chainId: 50341,
          nativeCurrency: {
              name: "RED",
              symbol: "RED",
              decimals: 18
          },
          rpcUrls: [rpcUrl],
          blockExplorerUrls: ["https://reddio-devnet.l2scan.co"]
      };

      const provider = new ethers.JsonRpcProvider(rpcUrl, network);

      const wallet = new ethers.Wallet(privateKey, provider);

      const generateRandomAddress = () => {
          const randomWallet = ethers.Wallet.createRandom();
          return randomWallet.address;
      };

      const sendTransaction = async () => {
          const randomAddress = generateRandomAddress();
          const tx = {
              to: randomAddress,
              value: ethers.parseUnits("0.0000000025", "ether"),  
          };

          try {
              const transaction = await wallet.sendTransaction(tx);
              console.log(`Transaction sent: ${transaction.hash}`);
              await transaction.wait();
              console.log(`Transaction confirmed: ${transaction.hash}`);
          } catch (error) {
              console.error("Error sending transaction:", error);
          }
      };

      const autoSend = async () => {
          while (true) {
              await sendTransaction();
          }
      };

      autoSend();
  });
});
