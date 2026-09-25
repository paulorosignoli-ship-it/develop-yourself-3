import { NextResponse } from "next/server";
import { buildReport, isComplete, type Answers } from "@/lib/scoring";
import { isContextComplete, summarizeContext, type ContextAnswers } from "@/lib/context";
import { getSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

interface LeadPayload {
  name?: string;
  email?: string;
  role?: string;
  company?: string;
  answers?: Answers;
  context?: ContextAnswers;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { name, email, role, company, answers, context } = body;

  if (!name?.trim() || !email?.trim() || !role?.trim() || !company?.trim()) {
    return NextResponse.json(
      { error: "Nome, e-mail, cargo e empresa são obrigatórios." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email.trim())) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Respostas ausentes." }, { status: 400 });
  }

  if (!isComplete(answers)) {
    return NextResponse.json(
      { error: "O diagnóstico precisa das 20 perguntas respondidas." },
      { status: 400 }
    );
  }

  if (!context || !isContextComplete(context)) {
    return NextResponse.json(
      { error: "As 5 perguntas de contexto precisam estar respondidas." },
      { status: 400 }
    );
  }

  const report = buildReport(answers);
  const contextSummary = summarizeContext(context);

  let id: string | null = null;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("diagnostic_results")
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: role.trim(),
          company: company.trim(),
          company_size: contextSummary.size ?? null,
          context_role: contextSummary.role ?? null,
          context_stage: contextSummary.stage ?? null,
          context_relationship: contextSummary.relationship ?? null,
          context_challenge: contextSummary.challenge ?? null,
          context_answers: context,
          answers,
          scores: report.scores,
          total: report.total,
          profile_id: report.profile.id,
          bottleneck: report.bottleneckKey,
        })
        .select("id")
        .single();

      if (error) throw error;
      id = (data?.id as string) ?? null;
    } catch (err) {
      // Persistence is a nice-to-have for this MVP, not a blocker: log and
      // keep serving the computed result so the user experience never
      // depends on Supabase being configured correctly.
      console.error("[api/leads] Supabase insert failed:", err);
    }
  }

  return NextResponse.json({
    id,
    total: report.total,
    scores: report.scores,
    percentages: report.percentages,
    profileId: report.profile.id,
    bottleneckKey: report.bottleneckKey,
    context: contextSummary,
  });
}

