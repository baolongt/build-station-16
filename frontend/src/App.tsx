import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "./App.css";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import MainPage from "./pages/Main";
import { OpenMakeEscrowButton } from "./components/dialog/MakeEscrow";
import { EscrowList } from "./components/escrow-list/EscrowList";

function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const wallets = useMemo(
    () => [
      // if desired, manually define specific/custom wallets here (normally not required)
      // otherwise, the wallet-adapter will auto detect the wallets a user's browser has available
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={"http://127.0.0.1:8899"}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="w-screen">
            <MainPage>
              <div className="w-1/12 min-h-24 mb-3 bg-white">
                <OpenMakeEscrowButton />
              </div>
              <EscrowList />
            </MainPage>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
