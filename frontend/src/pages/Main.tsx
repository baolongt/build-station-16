import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
type MainPageProps = {
  title?: string;
  children?: React.ReactNode;
};

const MainPage: React.FC<MainPageProps> = ({ title, children }) => {
  return (
    <div className=" min-h-screen bg-white ">
      <header className="p-4 border-b-4 border-indigo-500 w-full h-20 flex flex-row-reverse">
        <WalletMultiButton />
      </header>
      <div className="flex flex-col justify-start mt-5 mx-36">{children}</div>
    </div>
  );
};

export default MainPage;
