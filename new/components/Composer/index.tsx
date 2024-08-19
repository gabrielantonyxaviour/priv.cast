import React, { useState } from "react";

import { useRouter } from "next/navigation";
import TopBar from "./TopBar";

import Steps from "./Steps";
import QuestionPage from "./QuestionPage";
import { Poll } from "@/utils/types";
import ChooseThemePage from "./ChooseThemePage";

export default function ComposerAction() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(false);
  const [poll, setPoll] = useState<Poll>({
    question: "",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    duration: 0,
    theme: 0,
  });

  const [durationInput, setDurationInput] = useState("");
  const router = useRouter();
  return (
    <div className="px-3 h-screen">
      <div className="w-full bg-[#FBF6FF] text-[#450C63] h-full">
        <Steps step={step} />
        <div className="flex flex-col h-full justify-between items-center  pt-6">
          <TopBar />
          {step == 1 ? (
            <QuestionPage
              poll={poll}
              setPoll={setPoll}
              setStep={setStep}
              durationInput={durationInput}
              setDurationInput={setDurationInput}
            />
          ) : (
            <ChooseThemePage poll={poll} />
          )}
        </div>
      </div>
    </div>
  );
}