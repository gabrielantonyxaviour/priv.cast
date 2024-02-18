"use client";

import React, { useEffect } from "react";
import FarcasterButton from "../FarcasterButton";
import { ConnectKitButton } from "connectkit";
import getVotes from "@/utils/supabase/getVotes";
export default function ResultComponent({ poll }: { poll: any }) {
  const [votes, setVotes] = React.useState<any[]>([]);

  useEffect(() => {
    (async function () {
      const votes = await getVotes({ pollId: poll.id });

      console.log(votes);
    })();
  }, []);
  return (
    <div className="max-w-[1200px] mx-auto h-screen py-8">
      <div className="flex justify-between pb-12 ">
        <p className="text-3xl font-bold ">PRIV.CAST</p>
        <div className="flex space-x-4 ">
          <FarcasterButton isInverted={true} />
          <ConnectKitButton theme="retro" />
        </div>
      </div>
      <div className="flex justify-between h-full">
        <div className="w-[60%] h-full bg-[#FBF6FF]">
          <div className="flex flex-col h-full p-12">
            <p className="text-[#450C63] font-bold text-5xl">{poll.question}</p>
            {/* <div className="flex justify-between space-x-8 pt-12">
              <div className="flex-1">
                <SelectableButton
                  isSelected={selectedOption === 1}
                  disabled={false}
                  text={poll.option_a}
                  click={() => {
                    if (selectedOption !== 1) setSelectedOption(1);
                    else setSelectedOption(0);
                  }}
                />
              </div>

              <div className="flex-1">
                <SelectableButton
                  isSelected={selectedOption === 2}
                  disabled={false}
                  text={poll.option_b}
                  click={() => {
                    if (selectedOption !== 2) setSelectedOption(2);
                    else setSelectedOption(0);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between space-x-8 mt-4">
              <div className="flex-1">
                <SelectableButton
                  isSelected={selectedOption === 3}
                  disabled={false}
                  text={poll.option_c}
                  click={() => {
                    if (selectedOption !== 3) setSelectedOption(3);
                    else setSelectedOption(0);
                  }}
                />
              </div>

              <div className="flex-1">
                <SelectableButton
                  isSelected={selectedOption === 4}
                  disabled={false}
                  text={poll.option_d}
                  click={() => {
                    if (selectedOption !== 4) setSelectedOption(4);
                    else setSelectedOption(0);
                  }}
                />
              </div>
            </div>
            {hasProfile ? (
              <div className="flex-1 h-full flex flex-col space-y-4 justify-center items-center">
                <p className="text-xl font-semibold text-[#450C63] pt-12">
                  AADHAR VERIFICATION
                </p>
                <div className="pb-12">
                  <LogInWithAnonAadhaar />
                </div>
                <SelectableButton
                  text="🗳️ Cast Vote"
                  isSelected={false}
                  disabled={false}
                  click={() => {}}
                />
              </div>
            ) : (
              <div className="flex-1 h-full flex flex-col space-y-4 justify-center items-center">
                <p className="text-lg font-semibold text-[#450C63] pt-12">
                  Connected Wallet does not have a Farcaster Account
                </p>
              </div>
            )} */}
          </div>
        </div>
        {/* <div className="h-[80%] text-[#450C63] bg-[#FBF6FF] w-[35%] my-auto p-12">
          <p className="text-[#450C63] font-bold text-3xl text-center">LOGS</p>
          <p className="text-sm pt-4 pb-2">
            [1] Anon Aadhar logged-in. Proof verified ✅
          </p>
          {anonAadhaar.status === "logged-in" && (
            <div className="flex justify-center">
              <div className="whitespace-normal overflow-y-auto h-[100px] mx-auto ">
                <AnonAadhaarProof
                  code={JSON.stringify(
                    (anonAadhaar as any).anonAadhaarProof,
                    null,
                    2
                  )}
                />
              </div>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}