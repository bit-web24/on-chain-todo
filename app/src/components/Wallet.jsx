import React from 'react';

const Wallet = (props) => {
    let isWalletConnected = props.isConnected;

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
            <h1 className="text-white text-5xl font-bold absolute top-20">
                <span style={{ fontFamily: "OldEnglishFive" }}>On Chain Todo</span>
            </h1>
            <div className="flex flex-col items-center mt-8">
                <div className="mb-4">
                    <button className="p-0">
                        <img src="/ethr.svg" alt="Wallet" className="w-32 h-32" />
                    </button>
                </div>
                <div className="bg-white text-black text-sm rounded-md border border-gray-300 px-2 py-1 flex justify-end mb-4">
                    {isWalletConnected ? "Connected" : "Not Connected"}
                </div>
                <button className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isWalletConnected}>
                    Initialize
                </button>
            </div>
        </div>
    );
};

export default Wallet;
