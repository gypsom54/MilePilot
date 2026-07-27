import type {
  AskRankAuraAnswer,
  AskRankAuraData,
  AskRankAuraDataProvider,
} from "@/types/askRankAura";
import {
  mockAskRankAuraProvider,
  resolveAskRankAuraQuestion,
} from "@/services/askRankAura/mockAskRankAura";

let activeProvider: AskRankAuraDataProvider = mockAskRankAuraProvider;

export function setAskRankAuraDataProvider(
  provider: AskRankAuraDataProvider,
): void {
  activeProvider = provider;
}

export async function getAskRankAuraData(): Promise<AskRankAuraData> {
  return activeProvider.getAskRankAuraData();
}

export function resolveAskQuestion(text: string): AskRankAuraAnswer {
  return activeProvider.resolveQuestion(text);
}

export {
  mockAskRankAuraData,
  mockAskRankAuraProvider,
  resolveAskRankAuraQuestion,
} from "@/services/askRankAura/mockAskRankAura";
