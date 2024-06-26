// "use client";
// import circuit from "@/utils/privCastCircuit.json";
// import React, { useEffect, useState } from "react";
// import FarcasterButton from "../FarcasterButton";
// import { Data, QueryResponse } from "@/utils/airstackInterface";
// import SelectableButton from "@/components/SelectableButton";
// import { useAccount } from "wagmi";
// import { useQuery } from "@airstack/airstack-react";
// import { ConnectKitButton } from "connectkit";

// import {
//   BarretenbergBackend,
//   CompiledCircuit,
// } from "@noir-lang/backend_barretenberg";
// import {
//   ForeignCallHandler,
//   ForeignCallInput,
//   ForeignCallOutput,
//   Noir,
// } from "@noir-lang/noir_js";
// import {
//   bytesToHex,
//   createWalletClient,
//   custom,
//   encodePacked,
//   hashMessage,
//   hexToBigInt,
//   keccak256,
//   recoverPublicKey,
//   toBytes,
// } from "viem";
// import { baseSepolia } from "viem/chains";

// import vote from "@/utils/supabase/vote";
// import getVoted from "@/utils/supabase/getVoted";

// type HomeProps = {
//   poll: any;
// };
// export default function VoteComponent({ poll }: HomeProps) {
//   const [selectedOption, setSelectedOption] = useState(4);
//   const { address } = useAccount();
//   const [hasProfile, setHasProfile] = useState(false);
//   const [logs, setLogs] = useState<string[]>([]);
//   const [walletClient, setWalletClient] = useState<any>();
//   const [proof, setProof] = useState("");
//   const [ready, setReady] = useState(false);
//   const {
//     data,
//     loading,
//     error: queryError,
//   }: QueryResponse = useQuery<Data>(
//     `  query MyQuery {
//           Socials(
//             input: {blockchain: ethereum, filter: {dappName: {_eq: farcaster}, identity: {_eq: "${address}"}}}
//           ) {
//             Social {
//               userId
//             }
//           }
//         }`,
//     {},
//     { cache: true }
//   );
//   useEffect(() => {
//     if (poll != null) setReady(true);
//   }, [poll]);
//   useEffect(() => {
//     if ((window as any).ethereum != undefined) {
//       setWalletClient(
//         createWalletClient({
//           chain: baseSepolia,
//           transport: custom((window as any).ethereum),
//         })
//       );
//     }
//   }, []);

//   useEffect(() => {
//     if (
//       data != null &&
//       (data as any).Socials != null &&
//       (data as any).Socials.Social != null &&
//       (data as any).Socials.Social.length > 0
//     ) {
//       setHasProfile(true);
//     } else {
//       setHasProfile(false);
//     }
//   }, [data, loading, queryError]);

//   const foreignCallHandler: ForeignCallHandler = async (
//     name: string,
//     inputs: ForeignCallInput[]
//   ): Promise<ForeignCallOutput[]> => {
//     if (data != null) {
//       const fid = (data as any).Socials.Social[0].userId;
//       console.log(parseInt(fid));
//       console.log(parseInt(fid).toString(16));
//       console.log(["0x" + parseInt(fid).toString(16).padStart(64, "0")]);
//       return ["0x" + parseInt(fid).toString(16).padStart(64, "0")];
//     } else {
//       return [
//         "0x000000000000000000000000000000000000000000000000000000000003cee9",
//       ];
//     }
//   };
//   async function generateProof() {
//     try {
//       const pollId = poll.id;
//       const fid = (data as any).Socials.Social[0].userId;

//       const pollIdArray = new Uint8Array(32);
//       let pollIdTemp = pollId;
//       for (let i = 31; i >= 0; i--) {
//         pollIdArray[i] = pollIdTemp & 0xff; // Extract the least significant byte
//         pollIdTemp = pollIdTemp >> 8; // Shift the number to the right by 8 bits
//       }
//       const backend = new BarretenbergBackend(circuit as CompiledCircuit);
//       const noir = new Noir(circuit as CompiledCircuit, backend);
//       const hashData = toBytes(
//         keccak256(
//           encodePacked(
//             ["uint256", "uint256"],
//             [
//               BigInt(pollId != undefined ? pollId : 0),
//               BigInt(fid != undefined ? fid : 0),
//             ]
//           )
//         )
//       );

//       const sig = Buffer.from(
//         (
//           await walletClient.signMessage({
//             account: address,
//             message: {
//               raw: hashData,
//             },
//           })
//         ).slice(2),
//         "hex"
//       );

//       const publicKey = await recoverPublicKey({
//         hash: Buffer.from(hashMessage({ raw: hashData }).slice(2), "hex"),
//         signature: sig,
//       });
//       const publicKeyBuffer = Buffer.from(publicKey.slice(2), "hex");

//       const trimmedSig = new Uint8Array(sig.subarray(0, sig.length - 1));

//       // Extract x and y coordinates
//       const xCoordHex = Array.from(publicKeyBuffer.subarray(1, 33)).map(
//         (byte) => `${byte}`
//       );
//       const yCoordHex = Array.from(publicKeyBuffer.subarray(33)).map(
//         (byte) => `${byte}`
//       );
//       setLogs((prev) => [
//         ...prev,
//         "[" + Number(prev.length + 1) + "] " + "Fetching State... 👀",
//       ]);

//       const { response } = await getVoted({
//         pollId: pollId,
//         nullifier: hexToBigInt(keccak256(trimmedSig)).toString(),
//       });

//       if (response) {
//         setLogs((prev) => [
//           ...prev,
//           "[" + Number(prev.length + 1) + "] " + "Already voted... 👎",
//         ]);
//       } else {
//         setLogs((prev) => [
//           ...prev,
//           "[" + Number(prev.length + 1) + "] " + "Not voted... 👍",
//         ]);

//         setLogs((prev) => [
//           ...prev,
//           "[" + Number(prev.length + 1) + "] " + "Generating proof... ⏳",
//         ]);
//         console.log({
//           signer_pub_x_key: Array.from(xCoordHex).map((byte) => `${byte}`),
//           signer_pub_y_key: Array.from(yCoordHex).map((byte) => `${byte}`),
//           signature: Array.from(trimmedSig).map((byte) => `${byte}`),
//           hashed_message: Array.from(
//             Buffer.from(hashMessage({ raw: hashData }).slice(2), "hex")
//           ).map((byte) => `${byte}`),
//           farcaster_id: parseInt(fid),
//           vote_priv: selectedOption,
//           poll_id: Array.from(pollIdArray).map((byte) => `${byte}`),
//           vote: selectedOption,
//           nullifier: Array.from(
//             Buffer.from(keccak256(trimmedSig).slice(2), "hex")
//           ).map((byte) => `${byte}`),
//         });
//         const proof = await noir.generateFinalProof(
//           {
//             signer_pub_x_key: Array.from(xCoordHex).map((byte) => `${byte}`),
//             signer_pub_y_key: Array.from(yCoordHex).map((byte) => `${byte}`),
//             signature: Array.from(trimmedSig).map((byte) => `${byte}`),
//             hashed_message: Array.from(
//               Buffer.from(hashMessage({ raw: hashData }).slice(2), "hex")
//             ).map((byte) => `${byte}`),
//             farcaster_id: parseInt(fid),
//             vote_priv: 1,
//             poll_id: Array.from(pollIdArray).map((byte) => `${byte}`),
//             vote: 1,
//             nullifier: Array.from(
//               Buffer.from(keccak256(trimmedSig).slice(2), "hex")
//             ).map((byte) => `${byte}`),
//           },
//           foreignCallHandler
//         );
//         setProof(bytesToHex(proof.proof));
//         setLogs((prev) => [
//           ...prev,
//           "[" + Number(prev.length + 1) + "] " + "Proof: " + proof.proof,
//         ]);
//         setLogs((prev) => [
//           ...prev,
//           "[" + Number(prev.length + 1) + "] " + "Proof Generation Success 😏",
//         ]);
//         setLogs((prev) => [
//           ...prev,
//           "[" + Number(prev.length + 1) + "] " + "Verifying proof... ⏳",
//         ]);
//         const isValid = await noir.verifyFinalProof(proof);

//         if (isValid) {
//           setLogs((prev) => [
//             ...prev,
//             "[" + Number(prev.length + 1) + "] " + "Proof verified ✅",
//           ]);
//           try {
//             await vote({
//               pollId: pollId,
//               vote: selectedOption,
//               nullifier: hexToBigInt(keccak256(trimmedSig)).toString(),
//             });
//           } catch (e) {}
//         } else {
//           setLogs((prev) => [
//             ...prev,
//             "[" +
//               Number(prev.length + 1) +
//               "] " +
//               "Proof verification failed ❌",
//           ]);
//         }
//       }
//     } catch (err) {
//       console.log(err);
//       setLogs((prev) => [
//         ...prev,
//         "[" + Number(prev.length + 1) + "] " + "Wrong inputs 💔",
//       ]);
//     }
//   }

//   return (
//     <div className="max-w-[1200px] mx-auto h-screen py-8">
//       <div className="flex justify-between pb-12 ">
//         <p className="text-3xl font-bold ">PRIV.CAST</p>
//         <div className="flex space-x-4 ">
//           <FarcasterButton isInverted={true} />
//           <ConnectKitButton theme="retro" />
//         </div>
//       </div>
//       <div className="flex justify-between h-full">
//         {ready && (
//           <div className="w-[60%] h-full bg-[#FBF6FF]">
//             <div className="flex flex-col h-full p-12">
//               <p className="text-[#450C63] font-bold text-5xl">
//                 {poll.question}
//               </p>
//               <div className="flex justify-between space-x-8 pt-12">
//                 <div className="flex-1">
//                   <SelectableButton
//                     isSelected={selectedOption === 0}
//                     disabled={false}
//                     text={poll.option_a}
//                     click={() => {
//                       if (selectedOption !== 0) setSelectedOption(0);
//                       else setSelectedOption(4);
//                     }}
//                   />
//                 </div>

//                 <div className="flex-1">
//                   <SelectableButton
//                     isSelected={selectedOption === 1}
//                     disabled={false}
//                     text={poll.option_b}
//                     click={() => {
//                       if (selectedOption !== 1) setSelectedOption(1);
//                       else setSelectedOption(4);
//                     }}
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-between space-x-8 mt-4">
//                 <div className="flex-1">
//                   <SelectableButton
//                     isSelected={selectedOption === 2}
//                     disabled={false}
//                     text={poll.option_c}
//                     click={() => {
//                       if (selectedOption !== 2) setSelectedOption(2);
//                       else setSelectedOption(4);
//                     }}
//                   />
//                 </div>

//                 <div className="flex-1">
//                   <SelectableButton
//                     isSelected={selectedOption === 3}
//                     disabled={false}
//                     text={poll.option_d}
//                     click={() => {
//                       if (selectedOption !== 3) setSelectedOption(3);
//                       else setSelectedOption(4);
//                     }}
//                   />
//                 </div>
//               </div>{" "}
//               {hasProfile ? (
//                 <div className="flex-1 h-full flex flex-col space-y-4 justify-center items-center">
//                   <SelectableButton
//                     text="🗳️ Cast Vote"
//                     isSelected={false}
//                     disabled={selectedOption == 4}
//                     click={async () => {
//                       await generateProof();
//                     }}
//                   />
//                 </div>
//               ) : (
//                 <div className="flex-1 h-full flex flex-col space-y-4 justify-center items-center">
//                   <p className="text-lg font-semibold text-[#450C63] pt-12">
//                     Connected Wallet does not have a Farcaster Account
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//         <div className="h-[80%] text-[#450C63] bg-[#FBF6FF] w-[35%] my-auto p-12">
//           <p className="text-[#450C63] font-bold text-3xl text-center pb-4">
//             LOGS
//           </p>

//           {logs.map((log, index) => (
//             <p
//               key={index}
//               className="text-sm py-1 whitespace-normal text-nowrap overflow-x-auto "
//             >
//               {log}
//             </p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
