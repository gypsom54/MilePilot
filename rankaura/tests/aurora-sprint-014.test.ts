import { runAuroraSprintTests } from "@/tests/aurora-sprint-001.test";

runAuroraSprintTests().then((result) => {
  console.log("Aurora Sprint 014 tests:", result);
  process.exit(result.failed > 0 ? 1 : 0);
});
