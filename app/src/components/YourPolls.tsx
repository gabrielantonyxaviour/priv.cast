"use client";
import { useRouter } from "next/router";
import Button from "./Button";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import { useQuery } from "@airstack/airstack-react";

export default function YourPolls() {
  const polls = [];
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const { address } = useAccount();
  const {
    data,
    loading,
    error: queryError,
  }: QueryResponse = useQuery<Data>(
    `  query MyQuery {
  Socials(
    input: {blockchain: ethereum, filter: {dappName: {_eq: farcaster}, identity: {_eq: "${address}"}}}
  ) {
    Social {
      userId
    }
  }
}`,
    {},
    { cache: false }
  );

  useEffect(() => {
    if (
      data != null &&
      (data as any).Socials != null &&
      (data as any).Socials.Social != null &&
      (data as any).Socials.Social.length > 0
    ) {
      setHasProfile(true);
    } else {
      setHasProfile(false);
    }
  }, [data, loading, queryError]);

  useEffect(() => {
    console.log(address);
  }, []);
  return (
    <div className="w-full rounded-xl bg-[#FBF6FF] text-[#450C63] px-14 h-full pt-10   mt-4 ">
      <div className="flex justify-between">
        <p className="text-3xl font-bold">My Polls</p>
      </div>
      {polls.length === 0 ? (
        <div className="flex flex-col justify-center h-full items-center">
          {address == undefined ? (
            <p className="font-semibold text-lg mb-2">
              Connect wallet to view your polls
            </p>
          ) : !hasProfile ? (
            <>
              <p className="font-semibold text-lg mb-2">
                Connected Wallet does not have a Farcaster Profile 🙁
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-lg mb-2">
                You have no polls yet 😈
              </p>
              <Button
                text="Create a poll"
                click={() => {
                  router.push("/create");
                }}
              ></Button>
            </>
          )}
        </div>
      ) : (
        <div>View Polls</div>
      )}
    </div>
  );
}
