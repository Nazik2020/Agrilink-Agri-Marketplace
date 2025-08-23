//import Sidebar from "../MainSidebar/Sidebar"
import WalletOverview from "./WalletOverview";
// import TransactionHistory from "./TransactionHistory"

const WalletPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar /> */}

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-600 mb-2 text-center">
              Seller Wallet
            </h1>
          </div>

          {/* Wallet Overview */}
          <WalletOverview />

          {/* Transaction History */}
          {/* TransactionHistory removed to fix export error */}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
