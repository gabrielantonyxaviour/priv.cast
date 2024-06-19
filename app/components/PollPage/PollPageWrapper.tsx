"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

import React, { useEffect, useState } from "react";

import { baseSepolia } from "viem/chains";
import { WagmiProvider, createConfig, http } from "wagmi";

import PollPageComponent from "./PollPageComponent";
import { AirstackProvider } from "@airstack/airstack-react";

const projectId = process.env["NEXT_PUBLIC_PROJECT_ID"] ?? "";
const airstackApiKey = process.env["NEXT_PUBLIC_AIRSTACK_API_KEY"] ?? "";
const sepoliaRpcUrl = process.env["NEXT_PUBLIC_SEPOLIA_RPC_URL"] ?? "";
const config = createConfig(
  getDefaultConfig({
    appName: "Priv Cast",
    walletConnectProjectId: projectId,
    chains: [baseSepolia],
    ssr: true,
    transports: {
      [baseSepolia.id]: http(sepoliaRpcUrl),
    },
    appDescription:
      "PRIVACY PRESERVED, SYBIL RESISTANT POLLS NOW IN FARCASTER.",
    appUrl: "https://priv-cast.vercel.app", // your app's url
    appIcon: "https://family.co/logo.png",
  })
);
const queryClient = new QueryClient();

export default function PollPageWrapper({
  id,
  result,
}: {
  id: string;
  result: boolean;
}) {
  const [ready, setReady] = useState<boolean>(false);
  const [useTestAadhaar, setUseTestAadhaar] = useState<boolean>(false);

  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <>
      {ready ? (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider>
              <AirstackProvider apiKey={airstackApiKey}>
                <PollPageComponent
                  id={id}
                  result={result}
                  setUseTestAadhaar={setUseTestAadhaar}
                  useTestAadhaar={useTestAadhaar}
                />
              </AirstackProvider>
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      ) : null}
    </>
  );
}
