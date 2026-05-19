'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@/components/connect-button'; 
import { Terminal, Code2, Trophy, ArrowRight, Shield, Layers, Cpu, Zap } from 'lucide-react';

export default function HomePage() {
  const { isConnected, address } = useAccount();

  // Data simulasi statistik platform
  const stats = [
    { label: 'Total Tantangan', value: '42+', icon: Code2, color: 'text-cyan-400' },
    { label: 'Total Hadiah Didistribusikan', value: '15,400 USDC', icon: Trophy, color: 'text-yellow-400' },
    { label: 'Jaringan Aktif', value: 'Celo Mainnet', icon: Cpu, color: 'text-emerald-400' },
  ];

  // Data simulasi daftar tantangan yang tersedia
  const featuredChallenges = [
    {
      id: 'soal-easy-01',
      title: 'Reverse Linked List IV',
      difficulty: 'Easy',
      reward: '1.00 USDC',
      tags: ['Linked List', 'Algorithms'],
      status: 'Tersedia'
    },
    {
      id: 'soal-medium-02',
      title: 'Optimize Gas on Array Loops',
      difficulty: 'Medium',
      reward: '5.00 USDC',
      tags: ['Solidity', 'Optimization'],
      status: 'Segera Hadir'
    },
    {
      id: 'soal-hard-03',
      title: 'EIP-712 Signature Validator',
      difficulty: 'Hard',
      reward: '15.00 USDC',
      tags: ['Cryptography', 'Next.js'],
      status: 'Segera Hadir'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f111a] to-[#07080d] text-gray-100 font-sans selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      
      {/* Background Neon Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="border-b border-gray-800/80 bg-[#0f111a]/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-cyan-500 to-purple-500 p-2 rounded-lg text-black font-black">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              CODE<span className="text-cyan-400">ARENA</span> <span className="text-xs font-mono px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded ml-1 border border-gray-700">V2</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/claim" className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors">
              Hub Juri & Klaim
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-gray-900/80 px-3 py-1.5 rounded-full border border-gray-800 text-xs text-cyan-400 mb-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-mono tracking-wider">COMPETE · CODE · EARN USDC ON CELO</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Asah Skill Coding Kamu,<br />
          Dapatkan <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">Hadiah Crypto Asli</span>
        </h1>
        
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Platform arena kompetisi algoritma dan Web3 security pertama dengan sistem penilaian juri otomatis berbasis tanda tangan kriptografi <span className="text-gray-200 font-mono">EIP-712</span> aman.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/claim" 
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(6,182,212,0.2)] transition-all duration-200 flex items-center justify-center space-x-2 text-sm group"
          >
            <span>Mulai Masuk Arena</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#challenges" 
            className="w-full sm:w-auto bg-gray-900/60 hover:bg-gray-800/80 text-gray-300 font-medium px-8 py-3.5 rounded-xl border border-gray-800 transition-all text-sm block"
          >
            Lihat Daftar Soal
          </a>
        </div>
      </header>

      {/* STATS SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-[#131722]/40 backdrop-blur-sm border border-gray-800/60 rounded-xl p-5 flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-gray-900 border border-gray-800 ${stat.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium tracking-wide uppercase">{stat.label}</p>
                <p className="text-xl font-bold text-white mt-0.5">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* CHALLENGES LIST SECTION */}
      <main id="challenges" className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" /> Arena Tantangan Aktif
            </h2>
            <p className="text-gray-500 text-xs mt-1">Selesaikan kode di bawah untuk memicu pencairan smart contract</p>
          </div>
          <span className="text-xs bg-gray-900 text-gray-400 px-3 py-1 rounded-full border border-gray-800 font-mono">
            FILTER: ALL
          </span>
        </div>

        <div className="space-y-4">
          {featuredChallenges.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#131722]/60 hover:bg-[#161b29]/80 border border-gray-800/60 hover:border-gray-700/60 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 group"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    item.difficulty === 'Easy' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' :
                    item.difficulty === 'Medium' ? 'bg-amber-950/50 text-amber-400 border border-amber-900/40' :
                    'bg-red-950/50 text-red-400 border border-red-900/40'
                  }`}>
                    {item.difficulty}
                  </span>
                  <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors text-base">
                    {item.title}
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[11px] font-mono bg-gray-900 text-gray-400 px-2 py-0.5 rounded border border-gray-800/60">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-800/40">
                <div className="text-left sm:text-right">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">Hadiah</p>
                  <p className="text-yellow-400 font-black text-sm">{item.reward}</p>
                </div>

                {item.status === 'Tersedia' ? (
                  <Link 
                    href="/claim" 
                    className="bg-gray-900 hover:bg-cyan-500 hover:text-black border border-gray-800 hover:border-cyan-400 text-gray-300 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1"
                  >
                    <span>Buka Soal</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <button 
                    disabled 
                    className="bg-gray-900/30 border border-gray-800/30 text-gray-600 px-4 py-2 rounded-lg text-xs font-semibold cursor-not-allowed"
                  >
                    Lock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto px-4 py-12 border-t border-gray-900 text-center text-xs text-gray-600 space-y-2 relative z-10">
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Shield className="w-3.5 h-3.5 text-cyan-500/60" />
          <span>Secured with EIP-712 Signatures & OpenZeppelin Safeguards</span>
        </div>
        <p>© 2026 CodeArena V2 Monorepo. Built on Celo Blockchain.</p>
      </footer>
    </div>
  );
}