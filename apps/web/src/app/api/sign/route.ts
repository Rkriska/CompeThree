import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

export async function POST(request: Request) {
    try {
        const { solverAddress, problemId, amount } = await request.json();

        if (!solverAddress || !problemId || !amount) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        const privateKey = process.env.JUDGE_PRIVATE_KEY;
        if (!privateKey) {
            return NextResponse.json({ error: "Server konfig salah: JUDGE_PRIVATE_KEY belum diisi di .env.local" }, { status: 500 });
        }
        const wallet = new ethers.Wallet(privateKey);

        const domain = {
            name: "CodeArena",
            version: "2",
            chainId: 42220, // Celo Mainnet
            verifyingContract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
        };

        const types = {
            Reward: [
                { name: "solver", type: "address" },
                { name: "problemId", type: "string" },
                { name: "amount", type: "uint256" }
            ]
        };

        const value = {
            solver: solverAddress,
            problemId: problemId,
            amount: BigInt(amount).toString()
        };

        const signature = await wallet.signTypedData(domain, types, value);

        return NextResponse.json({
            success: true,
            signature
        });

    } catch (error: any) {
        console.error("API Sign Error:", error);
        return NextResponse.json({ error: error.message || "Gagal membuat tanda tangan" }, { status: 500 });
    }
}
