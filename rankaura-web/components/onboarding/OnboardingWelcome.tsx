"use client";

interface OnboardingWelcomeProps {
  onGetStarted: () => void;
}

export function OnboardingWelcome({ onGetStarted }: OnboardingWelcomeProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#080f1a]">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pb-10 pt-10 sm:px-8 sm:pt-14">
        <p className="text-sm font-medium text-[#080f1a]">
          RankAura{" "}
          <span className="font-normal text-[#8b95a5]">
            — We Help Grow Businesses.
          </span>
        </p>
        <div className="mt-auto flex flex-col pb-6 sm:pb-10">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            We Help Grow Businesses.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#8b95a5] sm:text-lg">
            RankAura quietly improves your online presence while you focus on
            running your business.
          </p>
          <button
            type="button"
            onClick={onGetStarted}
            className="mt-12 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#080f1a] px-6 text-sm font-semibold text-white sm:w-auto"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
