cd escrow-contract


solana config set --url http://127.0.0.1:8899
output=$(spl-token create-token --output json)
echo $output
address=$(echo $output | jq -r '.commandOutput.address')
signature=$(echo $output | jq -r '.commandOutput.transactionData.signature')

echo "Token mint address: $address"

spl-token create-account $address
spl-token mint $address 1000
spl-token balance $address

echo "Enter the wallet address to transfer token to: "
read wallet
spl-token transfer $address 100 $wallet --allow-unfunded-recipient --fund-recipient

echo "===================== OUTPUT ====================="
echo "Token mint: $address"
