"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  Lock,
  Loader2,
  MessageCircle,
  RotateCcw,
  Share2,
} from "lucide-react";
import { questions, blocks, profiles, bottlenecks, resultFocus, contextQuestions, intro, type BlockId } from "../data";
import { buildReport, type Answers } from "@/lib/scoring";
import { summarizeContext, type ContextAnswers, type ContextSummary } from "@/lib/context";

type Step = "intro" | "context" | "quiz" | "capture" | "result";

interface FormState {
  name: string;
  email: string;
  role: string;
  company: string;
}

interface SubmitResult {
  id: string | null;
  total: number;
  scores: Record<BlockId, number>;
  percentages: Record<BlockId, number>;
  profileId: string;
  bottleneckKey: BlockId;
  context?: ContextSummary;
}

const BLOCK_NAMES: Record<BlockId, string> = {
  strategy: "Estratégia",
  value: "Valor para o negócio",
  influence: "Influência",
  organization: "Organização",
  future: "Futuro & IA",
};

const BLOCK_DESCRIPTIONS: Record<BlockId, string> = {
  strategy: "O RH entende para onde o negócio está indo?",
  value: "O RH consegue demonstrar como suas decisões impactam o negócio?",
  influence: "O RH influencia decisões ou apenas executa decisões tomadas por outros?",
  organization: "O RH consegue transformar estratégia em capacidade organizacional?",
  future: "O RH está preparando o trabalho para IA, novas skills e mudanças estruturais?",
};

const CONTEXT_LABELS: Record<string, string> = {
  role: "Papel",
  stage: "Momento da empresa",
  size: "Tamanho da empresa",
  relationship: "RH x liderança",
  challenge: "Principal desafio",
};

const emptyForm: FormState = { name: "", email: "", role: "", company: "" };

export default function Diagnostico() {
  const [step, setStep] = useState<Step>("intro");
  const [ctxIndex, setCtxIndex] = useState(0);
  const [ctxAnswers, setCtxAnswers] = useState<ContextAnswers>({});
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const current = questions[index];
  const currentCtx = contextQuestions[ctxIndex];
  const progress = step === "quiz" ? ((index + 1) / questions.length) * 100 : 0;

  // Local, client-side calculation — used as a fallback if the API call
  // fails, so the person always sees a result even if the network or
  // Supabase hiccups.
  const localReport = useMemo(() => buildReport(answers), [answers]);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetAll() {
    setStep("intro");
    setCtxIndex(0);
    setCtxAnswers({});
    setIndex(0);
    setAnswers({});
    setForm(emptyForm);
    setSubmitError(null);
    setResult(null);
    setPdfError(null);
    scrollTop();
  }

  function chooseContext(value: number) {
    setCtxAnswers((a) => ({ ...a, [ctxIndex]: value }));
  }

  function nextContext() {
    if (ctxAnswers[ctxIndex] === undefined) return;
    if (ctxIndex < contextQuestions.length - 1) setCtxIndex(ctxIndex + 1);
    else setStep("quiz");
    scrollTop();
  }

  function prevContext() {
    if (ctxIndex > 0) setCtxIndex(ctxIndex - 1);
    else setStep("intro");
    scrollTop();
  }

  function choose(value: number) {
    setAnswers((a) => ({ ...a, [index]: value }));
  }

  function next() {
    if (answers[index] === undefined) return;
    if (index < questions.length - 1) setIndex(index + 1);
    else setStep("capture");
    scrollTop();
  }

  function prev() {
    if (index > 0) setIndex(index - 1);
    else {
      setStep("context");
      setCtxIndex(contextQuestions.length - 1);
    }
    scrollTop();
  }

  async function submitDiagnostic() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, answers, context: ctxAnswers }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Não foi possível calcular seu resultado.");
      setResult(data as SubmitResult);
      setStep("result");
      scrollTop();
    } catch {
      // Graceful fallback: keep the experience working even if the API
      // route or Supabase is unreachable, using the locally computed score.
      setResult({
        id: null,
        total: localReport.total,
        scores: localReport.scores,
        percentages: localReport.percentages,
        profileId: localReport.profile.id,
        bottleneckKey: localReport.bottleneckKey,
        context: summarizeContext(ctxAnswers),
      });
      setSubmitError(
        "Não conseguimos salvar seus dados agora, mas seu resultado abaixo foi calculado normalmente."
      );
      setStep("result");
      scrollTop();
    } finally {
      setSubmitting(false);
    }
  }

  async function downloadPdf() {
    if (!result) return;
    setDownloadingPdf(true);
    setPdfError(null);
    try {
      const response = await fetch("/api/leads/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: result.id,
          name: form.name,
          company: form.company,
          role: form.role,
          total: result.total,
          scores: result.scores,
          bottleneckKey: result.bottleneckKey,
          context: result.context,
        }),
      });
      if (!response.ok) throw new Error("Falha ao gerar o PDF.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagnostico-rh-na-mesa-do-ceo.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setPdfError("Não foi possível gerar o PDF agora. Tente novamente em instantes.");
    } finally {
      setDownloadingPdf(false);
    }
  }

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareMessage =
    "Acabei de fazer o diagnóstico gratuito \"RH na Mesa do CEO\" da DevelopYourself e descobri o estágio de maturidade estratégica do meu RH. Vale a pena fazer também:";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setPdfError(null);
    }
  }

  if (step === "intro")
    return (
      <main className="quiz">
        <div className="quizMain">
          <div className="brand" style={{ color: "#79531d" }}>DevelopYourself</div>
          <div className="question" style={{ marginTop: 60 }}>
            <div className="questionLabel">{intro.eyebrow}</div>
            <h1>{intro.title}</h1>
            <p className="sectionLead">{intro.description}</p>
            <div className="quote">{intro.quote}</div>
            <button className="cta" onClick={() => setStep("context")}>
              Começar <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </button>
            <p className="small" style={{ marginTop: 18 }}>5 perguntas de contexto + 20 perguntas do diagnóstico · ~7 minutos</p>
          </div>
        </div>
      </main>
    );

  if (step === "context")
    return (
      <main className="quiz">
        <div className="quizTop">
          <div className="quizTopInner">
            <span style={{ fontWeight: 800, fontSize: 13 }}>CONTEXTO · {ctxIndex + 1} DE {contextQuestions.length}</span>
            <div className="progress"><span style={{ width: `${((ctxIndex + 1) / contextQuestions.length) * 100}%` }} /></div>
            <span style={{ fontSize: 13, color: "#66717d" }}>Antes das perguntas da jornada</span>
          </div>
        </div>
        <div className="quizMain">
          <div className="question">
            <h1>{currentCtx.text}</h1>
            <div className="options">
              {currentCtx.options.map((option, i) => (
                <button
                  key={option}
                  className={`option ${ctxAnswers[ctxIndex] === i ? "selected" : ""}`}
                  onClick={() => chooseContext(i)}
                >
                  <span className="optionText">{option}</span>
                  {ctxAnswers[ctxIndex] === i && <Check size={19} color="#ff2eb8" style={{ marginLeft: "auto", flex: "none" }} />}
                </button>
              ))}
            </div>
            <div className="quizNav">
              <button className="navBtn" onClick={prevContext}>
                <ArrowLeft size={16} style={{ verticalAlign: "middle", marginRight: 6 }} /> Voltar
              </button>
              <button className="navBtn primary" disabled={ctxAnswers[ctxIndex] === undefined} onClick={nextContext}>
                Continuar <ArrowRight size={16} style={{ verticalAlign: "middle", marginLeft: 6 }} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );

  if (step === "quiz") {
    const block = blocks[current.block as BlockId];
    const blockStart = index === 0 || questions[index - 1].block !== current.block;

    return (
      <main className="quiz">
        <div className="quizTop">
          <div className="quizTopInner">
            <span style={{ fontWeight: 800, fontSize: 13 }}>RH NA MESA DO CEO</span>
            <div className="progress"><span style={{ width: `${progress}%` }} /></div>
            <span style={{ fontSize: 13, color: "#66717d" }}>{index + 1}/{questions.length}</span>
          </div>
        </div>
        <div className="quizMain">
          {blockStart && (
            <div className="blockHero" style={{ backgroundImage: `url(${block.image})` }}>
              <div className="blockHeroContent">
                <div className="eyebrow" style={{ color: "#d8b66f" }}>
                  Bloco {Object.keys(blocks).indexOf(current.block) + 1} de 5
                </div>
                <h2>{block.label}</h2>
                <p>{BLOCK_DESCRIPTIONS[current.block as BlockId]}</p>
              </div>
            </div>
          )}
          <div className="question">
            <div className="questionLabel">Pergunta {index + 1} · {current.title}</div>
            <h1>{current.text}</h1>
            <div className="options">
              {current.options.map((option, i) => (
                <button
                  key={option}
                  className={`option ${answers[index] === i ? "selected" : ""}`}
                  onClick={() => choose(i)}
                >
                  <span className="optionLetter">{String.fromCharCode(65 + i)}</span>
                  <span className="optionText">{option}</span>
                  {answers[index] === i && <Check size={19} color="#ff2eb8" style={{ marginLeft: "auto", flex: "none" }} />}
                </button>
              ))}
            </div>
            <div className="quizNav">
              <button className="navBtn" onClick={prev}>
                <ArrowLeft size={16} style={{ verticalAlign: "middle", marginRight: 6 }} /> Voltar
              </button>
              <button className="navBtn primary" disabled={answers[index] === undefined} onClick={next}>
                {index === questions.length - 1 ? "Ver meu resultado" : "Próxima"}{" "}
                <ArrowRight size={16} style={{ verticalAlign: "middle", marginLeft: 6 }} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === "capture")
    return (
      <main className="quiz">
        <div className="quizMain">
          <div className="capture">
            <div className="captureCard">
              <Lock size={22} color="#a8792d" />
              <div className="questionLabel" style={{ marginTop: 16 }}>Seu diagnóstico está pronto</div>
              <h1 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: 42, lineHeight: 1.1 }}>
                Agora vamos transformar suas respostas em um retrato.
              </h1>
              <p className="sectionLead">Preencha seus dados para visualizar o resultado completo.</p>
              <div className="field">
                <label>Nome</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Seu nome" />
              </div>
              <div className="field">
                <label>E-mail profissional</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@empresa.com" />
              </div>
              <div className="field">
                <label>Cargo</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Ex.: Head de RH" />
              </div>
              <div className="field">
                <label>Empresa</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Nome da empresa" />
              </div>
              {submitError && <p className="small" style={{ color: "#b3492f", marginTop: 8 }}>{submitError}</p>}
              <button
                className="cta"
                style={{ width: "100%", marginTop: 12 }}
                disabled={!form.name || !form.email || !form.role || !form.company || submitting}
                onClick={submitDiagnostic}
              >
                {submitting ? (
                  <>Calculando... <Loader2 size={18} style={{ marginLeft: 8 }} className="spin" /></>
                ) : (
                  <>Ver meu diagnóstico <ArrowRight size={18} style={{ marginLeft: 8 }} /></>
                )}
              </button>
              <p className="small" style={{ marginTop: 16 }}>
                Seus dados são usados apenas para gerar seu diagnóstico e, se você aceitar receber conteúdos, para contato da DevelopYourself.
              </p>
            </div>
          </div>
        </div>
      </main>
    );

  // step === "result"
  if (!result) return null;

  const focus = resultFocus[result.bottleneckKey];
  const bottleneckInfo = bottlenecks[result.bottleneckKey];
  const profile = profiles.find((p) => p.id === result.profileId) ?? profiles[0];
  const contextEntries = result.context
    ? (Object.keys(CONTEXT_LABELS) as (keyof ContextSummary)[])
        .map((key) => [CONTEXT_LABELS[key], result.context?.[key]] as const)
        .filter(([, value]) => Boolean(value))
    : [];

  return (
    <main className="quiz">
      <section className="resultHero">
        <div className="container resultInner">
          <div>
            <div className="brand">DevelopYourself · RH na Mesa do CEO</div>
            <div className="eyebrow" style={{ color: "#d8b66f", marginTop: 24 }}>Seu resultado</div>
            <div className="resultProfile">{profile.name}</div>
            <p style={{ fontSize: 22, lineHeight: 1.45, maxWidth: 650 }}>{profile.tagline}</p>
          </div>
          <div className="scoreRing"><div><strong>{result.total}</strong><span>de 80 pontos</span></div></div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <div className="eyebrow">Seu retrato</div>
            <h2>{profile.tagline}</h2>
            <p className="sectionLead">{profile.body1}</p>
            <p className="sectionLead">{profile.body2}</p>
          </div>

          {contextEntries.length > 0 && (
            <div className="contextCard">
              <div className="questionLabel">Com base no que você compartilhou</div>
              <div className="contextGrid">
                {contextEntries.map(([label, value]) => (
                  <div key={label} className="contextItem">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bars">
            {(Object.keys(result.percentages) as BlockId[]).map((key) => (
              <div className="barRow" key={key}>
                <div className="barLabel"><span>{BLOCK_NAMES[key]}</span><strong>{result.percentages[key]}%</strong></div>
                <div className="bar"><span style={{ width: result.percentages[key] + "%" }} /></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            {pdfError && <p className="small" style={{ color: "#b3492f", marginBottom: 10 }}>{pdfError}</p>}
            <button className="navBtn primary" onClick={downloadPdf} disabled={downloadingPdf}>
              {downloadingPdf ? (
                <>Gerando PDF... <Loader2 size={16} style={{ verticalAlign: "middle", marginLeft: 6 }} className="spin" /></>
              ) : (
                <>Baixar relatório em PDF <Download size={16} style={{ verticalAlign: "middle", marginLeft: 6 }} /></>
              )}
            </button>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <div className="focusCard">
            <div className="eyebrow">Seu principal ponto de atenção</div>
            <h3>{bottleneckInfo.title}</h3>
            <p className="sectionLead">{bottleneckInfo.text}</p>
            {result.context?.challenge && (
              <p className="sectionLead">
                Isso ajuda a explicar por que, numa empresa cujo maior desafio hoje é{" "}
                <strong>&ldquo;{result.context.challenge.toLowerCase()}&rdquo;</strong>, o eixo de{" "}
                <strong>{bottleneckInfo.title.toLowerCase()}</strong> apareceu como seu principal ponto de atenção.
              </p>
            )}
            <h3 style={{ marginTop: 32 }}>Comece por aqui</h3>
            <ul className="focusList">{focus.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <div className="eyebrow">Continue por aqui</div>
            <h2>Convide alguém para fazer o diagnóstico também.</h2>
          </div>
          <div className="resultActions">
            <button className="navBtn" onClick={resetAll}>
              <RotateCcw size={16} style={{ verticalAlign: "middle", marginRight: 6 }} /> Fazer novo diagnóstico
            </button>
            <a
              className="navBtn"
              style={{ background: "#1f9d55", color: "#fff", borderColor: "#1f9d55" }}
              href={`https://wa.me/?text=${encodeURIComponent(shareMessage + " " + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} style={{ verticalAlign: "middle", marginRight: 6 }} /> Compartilhar no WhatsApp
            </a>
            <button className="navBtn" onClick={copyLink}>
              <Copy size={16} style={{ verticalAlign: "middle", marginRight: 6 }} /> {copied ? "Link copiado!" : "Copiar link"}
            </button>
            <a
              className="navBtn"
              style={{ background: "#0a66c2", color: "#fff", borderColor: "#0a66c2" }}
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Share2 size={16} style={{ verticalAlign: "middle", marginRight: 6 }} /> Compartilhar no LinkedIn
            </a>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container about">
          <div className="aboutImage" style={{ backgroundImage: 'url("/images/gabi/gabi-result.jpg")' }} />
          <div className="aboutCopy">
            <div className="eyebrow">Próximo passo</div>
            <h2>Leve uma pergunta melhor para a próxima reunião.</h2>
            <p>Seu resultado não é uma nota sobre a qualidade do seu RH. É um ponto de partida para uma conversa mais concreta sobre onde a função pode ampliar seu impacto.</p>
            <div className="quote">“Qual problema de negócio estamos tentando resolver — e como vamos saber se realmente resolvemos?”</div>
            <Link className="cta" href="/">Conhecer a DevelopYourself <ArrowRight size={18} style={{ marginLeft: 8 }} /></Link>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">Diagnóstico de autoavaliação. Não é um teste psicométrico nem um benchmark científico. Resultados são indicativos e destinados à reflexão e ação.</div>
      </footer>
    </main>
  );
}
