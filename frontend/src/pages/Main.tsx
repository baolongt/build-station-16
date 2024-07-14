import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
type MainPageProps = {
  title?: string;
  children?: React.ReactNode;
};

const MainPage: React.FC<MainPageProps> = ({ title, children }) => {
  return (
    <div className=" min-h-screen bg-gray-600">
      <header className="p-4 bg-gray-800 text-white w-full h-20 flex flex-row-reverse">
        <WalletMultiButton />
      </header>
      <div className="flex flex-col items-center justify-center mt-5">
        {children}
      </div>
    </div>
  );
};

export default MainPage;
