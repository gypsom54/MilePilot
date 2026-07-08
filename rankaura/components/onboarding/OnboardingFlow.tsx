"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import {
  OnboardingInput,
  OnboardingPrimaryButton,
  OnboardingTextarea,
} from "@/components/onboarding/OnboardingFields";
import { OnboardingAnalysis } from "@/components/onboarding/OnboardingAnalysis";
import {
  markOnboardingComplete,
  saveOnboardingData,
  simulateAnalysis,
} from "@/services/onboarding/onboardingService";
import type { OnboardingData, OnboardingStep } from "@/types/onboarding";

const INITIAL_DATA: OnboardingData = {
  website: "",
  businessName: "",
  businessDescription: "",
};

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);

  const update = (partial: Partial<OnboardingData>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      saveOnboardingData(next);
      return next;
    });
  };

  const goToDashboard = () => {
    markOnboardingComplete(data);
    router.push("/");
    router.refresh();
  };

  if (step === "welcome") {
    return (
      <OnboardingShell stepIndex={0} showProgress={false}>
        <p className="text-sm font-medium tracking-wide text-[#8b95a5]">Welcome to Aura</p>
        <h1 className="mt-8 text-4xl font-semibold leading-[1.15] tracking-tight text-[#080f1a] sm:text-5xl sm:leading-[1.1]">
          I&apos;ll grow your business while you focus on running it.
        </h1>
        <OnboardingPrimaryButton onClick={() => setStep("website")}>
          Get Started
        </OnboardingPrimaryButton>
      </OnboardingShell>
    );
  }

  if (step === "website") {
    return (
      <OnboardingShell stepIndex={0}>
        <h1 className="text-4xl font-semibold tracking-tight text-[#080f1a] sm:text-5xl">
          What&apos;s your website?
        </h1>
        <OnboardingInput
          id="website"
          label="Website URL"
          value={data.website}
          onChange={(website) => update({ website })}
          placeholder="www.portsmouthhypnotherapy.co.uk"
          type="url"
        />
        <OnboardingPrimaryButton
          onClick={() => setStep("business-name")}
          disabled={!data.website.trim()}
        >
          Continue
        </OnboardingPrimaryButton>
      </OnboardingShell>
    );
  }

  if (step === "business-name") {
    return (
      <OnboardingShell stepIndex={1}>
        <h1 className="text-4xl font-semibold tracking-tight text-[#080f1a] sm:text-5xl">
          Business name
        </h1>
        <OnboardingInput
          id="business-name"
          label="Business name"
          value={data.businessName}
          onChange={(businessName) => update({ businessName })}
          placeholder="Portsmouth Hypnotherapy"
        />
        <OnboardingPrimaryButton
          onClick={() => setStep("business-description")}
          disabled={!data.businessName.trim()}
        >
          Continue
        </OnboardingPrimaryButton>
      </OnboardingShell>
    );
  }

  if (step === "business-description") {
    return (
      <OnboardingShell stepIndex={2}>
        <h1 className="text-4xl font-semibold tracking-tight text-[#080f1a] sm:text-5xl">
          Tell Aura about your business
        </h1>
        <OnboardingTextarea
          id="business-description"
          label="Business description"
          value={data.businessDescription}
          onChange={(businessDescription) => update({ businessDescription })}
          placeholder="We help people overcome anxiety, confidence and smoking through professional hypnotherapy."
        />
        <OnboardingPrimaryButton
          onClick={() => setStep("analysis")}
          disabled={!data.businessDescription.trim()}
        >
          Continue
        </OnboardingPrimaryButton>
      </OnboardingShell>
    );
  }

  return (
    <AnalysisStep data={data} onComplete={goToDashboard} />
  );
}

function AnalysisStep({
  data,
  onComplete,
}: {
  data: OnboardingData;
  onComplete: () => void;
}) {
  const [completedSteps, setCompletedSteps] = useState<number>(-1);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    saveOnboardingData(data);

    simulateAnalysis((index) => {
      setCompletedSteps(index);
    }).then(onComplete);
  }, [data, onComplete]);

  return (
    <OnboardingShell stepIndex={3} showProgress={false}>
      <OnboardingAnalysis completedSteps={completedSteps} businessName={data.businessName} />
    </OnboardingShell>
  );
}
