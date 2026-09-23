import { blocks, questions, profiles, bottlenecks, resultFocus, type BlockId } from "@/app/data";

export type Answers = Record<number, number>;
export type Scores = Record<BlockId, number>;

const BLOCK_KEYS = Object.keys(blocks) as BlockId[];
const MAX_PER_BLOCK = 16; // 4 questions per block, 4 points max each

function emptyScores(): Scores {
  return BLOCK_KEYS.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Scores);
}

export function calculateScores(answers: Answers): Scores {
  const scores = emptyScores();
  questions.forEach((q, i) => {
    const answer = answers[i];
    if (typeof answer === "number" && answer >= 0 && answer <= 3) {
      scores[q.block as BlockId] += answer + 1;
    }
  });
  return scores;
}

export function totalScore(scores: Scores): number {
  return BLOCK_KEYS.reduce((sum, key) => sum + scores[key], 0);
}

export function percentages(scores: Scores): Record<BlockId, number> {
  return BLOCK_KEYS.reduce((acc, key) => {
    acc[key] = Math.round((scores[key] / MAX_PER_BLOCK) * 100);
    return acc;
  }, {} as Record<BlockId, number>);
}

export function determineProfile(total: number) {
  return profiles.find((p) => total >= p.min && total <= p.max) ?? profiles[0];
}

/** The weakest of the five axes — the one the person should focus on next. */
export function determineBottleneck(scores: Scores): BlockId {
  const answered = BLOCK_KEYS.filter((key) => scores[key] > 0).sort(
    (a, b) => scores[a] - scores[b]
  );
  return answered[0] ?? "value";
}

export interface DiagnosticReport {
  scores: Scores;
  percentages: Record<BlockId, number>;
  total: number;
  answeredCount: number;
  profile: (typeof profiles)[number];
  bottleneckKey: BlockId;
  bottleneck: (typeof bottlenecks)[BlockId];
  focus: readonly string[];
}

export function buildReport(answers: Answers): DiagnosticReport {
  const scores = calculateScores(answers);
  const total = totalScore(scores);
  const bottleneckKey = determineBottleneck(scores);
  return {
    scores,
    percentages: percentages(scores),
    total,
    answeredCount: Object.keys(answers).length,
    profile: determineProfile(total),
    bottleneckKey,
    bottleneck: bottlenecks[bottleneckKey],
    focus: resultFocus[bottleneckKey],
  };
}

export function isComplete(answers: Answers): boolean {
  return Object.keys(answers).length === questions.length;
}
