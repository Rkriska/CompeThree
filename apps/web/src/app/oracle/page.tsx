"use client";

import { useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTRACTS } from "@/lib/contracts";
import { PriceFeedAbi } from "@/lib/abis/PriceFeedAbi";

const priceFeedConfig = {
  address: CONTRACTS.PRICE_FEED,
  abi: PriceFeedAbi,
} as const;

export default function OraclePage() {
  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        ...priceFeedConfig,
        functionName: "getChainlinkDataFeedLatestAnswer",
        args: [CONTRACTS.MOCK_USDC],
      },
      {
        ...priceFeedConfig,
        functionName: "getChainlinkDataFeedLatestAnswer",
        args: [CONTRACTS.MOCK_USDT],
      },
    ],
  });

  const usdcResult = data?.[0]?.result as [bigint, bigint] | undefined;
  const usdtResult = data?.[1]?.result as [bigint, bigint] | undefined;

  const usdcPrice = usdcResult
    ? Number(formatUnits(usdcResult[0], Number(usdcResult[1])))
    : null;
  const usdtPrice = usdtResult
    ? Number(formatUnits(usdtResult[0], Number(usdtResult[1])))
    : null;

  return (
    <main className="container max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Oracle Prices</h1>
      <p className="text-muted-foreground mb-8">
        Harga real-time dari Chainlink via PriceFeed contract
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              MockUSDC / USD
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold">
                ${usdcPrice?.toFixed(6) ?? "—"}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              MockUSDT / USD
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold">
                ${usdtPrice?.toFixed(6) ?? "—"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Source: PriceFeed contract{" "}
        <a
          href={`https://celoscan.io/address/${CONTRACTS.PRICE_FEED}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {CONTRACTS.PRICE_FEED.slice(0, 10)}...
        </a>
      </p>
    </main>
  );
}
