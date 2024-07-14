cd escrow-contract


solana config set --url http://127.0.0.1:8899


echo "Enter the wallet address to transfer token to: "
read wallet

solana airdrop 10 $wallet

output=$(spl-token create-token --output json)
echo $output
address=$(echo $output | jq -r '.commandOutput.address')
signature=$(echo $output | jq -r '.commandOutput.transactionData.signature')

echo "Token mint address: $address"
spl-token create-account $address
spl-token mint $address 1000
spl-token balance $address

spl-token transfer $address 1000 $wallet --allow-unfunded-recipient --fund-recipient

echo "===================== OUTPUT ====================="
echo "Token mint 1: $address"
