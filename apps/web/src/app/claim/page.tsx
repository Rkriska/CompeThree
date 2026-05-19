'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { codeArenaRewardsV2Config } from '@/lib/contracts';
import { ConnectButton } from '@/components/connect-button'; 
import { Trophy, CheckCircle2, AlertCircle, Terminal, ShieldCheck, ExternalLink, Loader2, Coins } from 'lucide-react';

export default function ClaimPage() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error: writeError, isPending: isTxPending } = useWriteContract();
  
  const [loadingSign, setLoadingSign] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Data simulasi tantangan (Nanti bisa diubah menjadi dinamis)
  const challenge = {
    problemId: 'soal-easy-01',
    title: 'Reverse Linked List IV',
    difficulty: 'Easy',
    amount: '1000000', // 1 USDC (6 desimal)
    displayAmount: '1.00'
  };

  // 1. Cek on-chain apakah user sudah pernah mengklaim soal ini sebelumnya
  const { data: isAlreadyClaimed, refetch: checkClaimStatus } = useReadContract({
    ...codeArenaRewardsV2Config,
    functionName: 'claimed',
    args: address && challenge.problemId ? [address, challenge.problemId] : undefined,
    query: { enabled: !!address }
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Picu pengecekan ulang status klaim jika transaksi blockchain sukses
  useEffect(() => {
    if (isSuccess) {
      checkClaimStatus();
    }
  }, [isSuccess, checkClaimStatus]);

  const handleClaim = async () => {
    if (!address) return;
    
    try {
      setLoadingSign(true);
      setStatusMessage('Meminta tanda tangan digital dari Juri...');

      const response = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solverAddress: address,
          problemId: challenge.problemId,
          amount: challenge.amount,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal mendapatkan verifikasi juri.');
      }

      setStatusMessage('Tanda tangan sah! Sila setujui transaksi di dompet Anda...');

      writeContract({
        ...codeArenaRewardsV2Config,
        functionName: 'claimReward',
        args: [challenge.problemId, BigInt(challenge.amount), data.signature],
      });

    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Error: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setLoadingSign(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0f111a] to-[#07080d] text-gray-100 p-4 md:p-6 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Background Neon Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#131722]/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-gray-800/80 relative overflow-hidden group">
        
        {/* Top Decorative Cyber Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-purple-500" />

        {/* Header UI */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1.5 rounded-full border border-gray-800 text-xs text-gray-400">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono tracking-wider">CODEARENA ENGINE v2.0</span>
          </div>
          <ConnectButton />
        </div>

        {/* Trophy / Status Icon Section */}
        <div className="flex flex-col items-center my-6">
          <div className={`p-4 rounded-2xl border mb-4 transition-all duration-300 ${
            isAlreadyClaimed 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
          }`}>
            {isAlreadyClaimed ? <CheckCircle2 className="w-10 h-10" /> : <Trophy className="w-10 h-10" />}
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent tracking-tight">
            {isAlreadyClaimed ? 'Reward Selesai Diklaim' : 'Klaim Hadiah Kamu'}
          </h1>
        </div>

        {/* Card Info */}
        <div className="bg-[#181e2e]/60 border border-gray-800 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-800/60">
            <span className="text-gray-400 text-sm">Nama Tantangan</span>
            <span className="font-semibold text-white text-sm">{challenge.title}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-800/60">
            <span className="text-gray-400 text-sm">ID Soal</span>
            <span className="font-mono text-xs text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50">
              {challenge.problemId}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Jumlah Reward</span>
            <div className="flex items-center space-x-1.5 text-yellow-400 font-bold">
              <Coins className="w-4 h-4" />
              <span>{challenge.displayAmount} USDC</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isAlreadyClaimed ? (
          <div className="w-full bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 rounded-xl py-3.5 px-4 text-center text-sm font-semibold flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Kamu sudah mengambil reward untuk soal ini</span>
          </div>
        ) : (
          <button
            onClick={handleClaim}
            disabled={!isConnected || loadingSign || isTxPending || isConfirming}
            className="w-full relative group/btn overflow-hidden disabled:opacity-40 disabled:pointer-events-none bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-[0_4px_20px_rgba(6,182,212,0.25)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-2 text-sm"
          >
            {(loadingSign || isTxPending || isConfirming) ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>
                  {loadingSign && 'Meminta Tanda Tangan...'}
                  {isTxPending && 'Menunggu Konfirmasi Dompet...'}
                  {isConfirming && 'Mengonfirmasi Blokir...'}
                </span>
              </>
            ) : (
              <span>{isConnected ? 'Klaim USDC Sekarang' : 'Sambungkan Dompet Terlebih Dahulu'}</span>
            )}
          </button>
        )}

        {/* Status Messages */}
        {statusMessage && !isSuccess && !writeError && (
          <div className="mt-4 flex items-center space-x-2 text-xs text-cyan-400 justify-center bg-cyan-950/20 py-2 px-3 rounded-lg border border-cyan-900/30">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="animate-pulse">{statusMessage}</span>
          </div>
        )}

        {/* Error Notification */}
        {writeError && (
          <div className="mt-4 flex items-start space-x-2 bg-red-950/40 border border-red-900/50 p-3 rounded-xl text-xs text-red-400">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Gagal Eksekusi</p>
              <p className="opacity-80 mt-0.5">{writeError.shortMessage || writeError.message}</p>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {isSuccess && (
          <div className="mt-4 bg-emerald-950/40 border border-emerald-900/50 p-4 rounded-xl text-xs text-emerald-400 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Transaksi Sukses Telak!</span>
            </div>
            <p className="opacity-80">Selamat, dana USDC sudah meluncur langsung masuk ke dompet kamu.</p>
            <a
              href={`https://celoscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors"
            >
              <span>Periksa di Celoscan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

      </div>
    </div>
  );
}