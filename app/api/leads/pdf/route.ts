import { NextResponse } from "next/server";
import { renderReportPdf } from "@/lib/pdf";
import { determineProfile, percentages as calcPercentages } from "@/lib/scoring";
import { bottlenecks, resultFocus, blocks, type BlockId } from "@/app/data";
import { getSupabaseClient } from "@/lib/supabase";
import type { DiagnosticReport } from "@/lib/scoring";
import type { ContextSummary } from "@/lib/context";

export const runtime = "nodejs";

const BLOCK_KEYS = Object.keys(blocks) as BlockId[];

interface PdfPayload {
  id?: string;
  name?: string;
  company?: string;
  role?: string;
  total?: number;
  scores?: Record<BlockId, number>;
  bottleneckKey?: BlockId;
  context?: ContextSummary;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "empresa";
}

function isValidScores(scores: unknown): scores is Record<BlockId, number> {
  if (!scores || typeof scores !== "object") return false;
  return BLOCK_KEYS.every((key) => typeof (scores as Record<string, unknown>)[key] === "number");
}

export async function POST(request: Request) {
  let body: PdfPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  let { name, company, role, total, scores, bottleneckKey, context } = body;

  // If an id is provided (the lead was persisted to Supabase), prefer the
  // stored, canonical values over anything the client sends.
  if (body.id) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("diagnostic_results")
        .select(
          "name, company, role, total, scores, bottleneck, context_role, context_stage, company_size, context_relationship, context_challenge"
        )
        .eq("id", body.id)
        .single();

      if (!error && data) {
        name = data.name;
        company = data.company;
        role = data.role;
        total = data.total;
        scores = data.scores;
        bottleneckKey = data.bottleneck;
        context = {
          role: data.context_role ?? undefined,
          stage: data.context_stage ?? undefined,
          size: data.company_size ?? undefined,
          relationship: data.context_relationship ?? undefined,
          challenge: data.context_challenge ?? undefined,
        };
      }
    }
  }

  if (typeof total !== "number" || !isValidScores(scores) || !bottleneckKey) {
    return NextResponse.json(
      { error: "Dados insuficientes para gerar o PDF." },
      { status: 400 }
    );
  }

  const report: DiagnosticReport = {
    scores,
    percentages: calcPercentages(scores),
    total,
    answeredCount: 20,
    profile: determineProfile(total),
    bottleneckKey,
    bottleneck: bottlenecks[bottleneckKey],
    focus: resultFocus[bottleneckKey],
  };

  const pdfBuffer = await renderReportPdf({ name, company, role, report, context });

  // Node's Buffer type (generic over ArrayBufferLike in recent @types/node)
  // doesn't structurally satisfy the DOM BodyInit type that NextResponse
  // expects, even though a Buffer is a valid body at runtime. Cast through
  // unknown rather than fighting the generics — this is a type-level-only
  // mismatch, not a real runtime issue.
  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="diagnostico-rh-${slugify(company || "empresa")}.pdf"`,
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
