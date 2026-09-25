import { contextQuestions, type ContextQuestionKey } from "@/app/data";

export type ContextAnswers = Record<number, number>;

export type ContextSummary = Partial<Record<ContextQuestionKey, string>>;

export function isContextComplete(answers: ContextAnswers): boolean {
  return Object.keys(answers).length === contextQuestions.length;
}

/** Turns { 0: 2, 1: 0, ... } into { role: "...", stage: "...", ... } */
export function summarizeContext(answers: ContextAnswers): ContextSummary {
  const summary: ContextSummary = {};
  contextQuestions.forEach((q, i) => {
    const optionIndex = answers[i];
    const option = q.options[optionIndex as number];
    if (typeof option === "string") {
      summary[q.key] = option;
    }
  });
  return summary;
}
