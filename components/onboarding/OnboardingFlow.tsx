"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingWelcome } from "@/components/onboarding/OnboardingWelcome";
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

/**
 * Legacy MilePilot overlay copy of RankAura onboarding.
 * Canonical implementation lives in rankaura-web/.
 * Kept in sync for import-path compatibility.
 */
const INITIAL_DATA: OnboardingData = {
  customerFirstName: "",
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

  const goToGrowthPlan = () => {
    markOnboardingComplete(data);
    router.push("/growth-plan?site=existing");
    router.refresh();
  };

  if (step === "welcome") {
    return <OnboardingWelcome onGetStarted={() => setStep("name")} />;
  }

  if (step === "name") {
    return (
      <OnboardingShell stepIndex={0}>
        <p className="text-sm font-medium text-[#8b95a5]">Welcome to RankAura</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#080f1a] sm:text-5xl">
          What should we call you?
        </h1>
        <OnboardingInput
          id="customer-name"
          label="Your first name"
          value={data.customerFirstName}
          onChange={(customerFirstName) => update({ customerFirstName })}
          placeholder="Enter your first name"
        />
        <OnboardingPrimaryButton
          onClick={() => setStep("nice-to-meet-you")}
          disabled={!data.customerFirstName.trim()}
        >
          Continue
        </OnboardingPrimaryButton>
      </OnboardingShell>
    );
  }

  if (step === "nice-to-meet-you") {
    const firstName = data.customerFirstName.trim();
    return (
      <OnboardingShell showProgress={false} stepIndex={0}>
        <h1 className="text-4xl font-semibold tracking-tight text-[#080f1a] sm:text-5xl">
          Nice to meet you{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-[#8b95a5] sm:text-lg">
          We&apos;re going to build a personalised growth strategy for your business.
        </p>
        <OnboardingPrimaryButton onClick={() => setStep("website")}>
          Continue
        </OnboardingPrimaryButton>
      </OnboardingShell>
    );
  }

  if (step === "website") {
    return (
      <OnboardingShell stepIndex={1}>
        <h1 className="text-4xl font-semibold tracking-tight text-[#080f1a] sm:text-5xl">
          What&apos;s your website?
        </h1>
        <OnboardingInput
          id="website"
          label="Website URL"
          value={data.website}
          onChange={(website) => update({ website })}
          placeholder="https://yourwebsite.co.uk"
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
      <OnboardingShell stepIndex={2}>
        <h1 className="text-4xl font-semibold tracking-tight text-[#080f1a] sm:text-5xl">
          Business name
        </h1>
        <OnboardingInput
          id="business-name"
          label="Business name"
          value={data.businessName}
          onChange={(businessName) => update({ businessName })}
          placeholder="Enter your business name"
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
      <OnboardingShell stepIndex={3}>
        <h1 className="text-4xl font-semibold tracking-tight text-[#080f1a] sm:text-5xl">
          Tell Aura about your business
        </h1>
        <OnboardingTextarea
          id="business-description"
          label="Business description"
          value={data.businessDescription}
          onChange={(businessDescription) => update({ businessDescription })}
          placeholder="Tell us about your business..."
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

  return <AnalysisStep data={data} onComplete={goToGrowthPlan} />;
}

function AnalysisStep({
  data,
  onComplete,
}: {
  data: OnboardingData;
  onComplete: () => void;
}) {
  const [completedSteps, setCompletedSteps] = useState(-1);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    saveOnboardingData(data);
    simulateAnalysis((index) => setCompletedSteps(index)).then(() => {
      window.setTimeout(onComplete, 700);
    });
  }, [data, onComplete]);

  return (
    <OnboardingShell stepIndex={3} showProgress={false}>
      <OnboardingAnalysis completedSteps={completedSteps} businessName={data.businessName} />
    </OnboardingShell>
  );
}
