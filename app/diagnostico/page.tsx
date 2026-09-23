"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Download, Lock, Loader2 } from "lucide-react";
import { questions, blocks, profiles, bottlenecks, resultFocus, type BlockId } from "../data";
import { buildReport, type Answers } from "@/lib/scoring";

type Step = "intro" | "quiz" | "capture" | "result";

interface FormState {
  name: string;
  email: string;
  role: string;
  company: string;
  size: string;
}

interface SubmitResult {
  id: string | null;
  total: number;
  scores: Record<BlockId, number>;
  percentages: Record<BlockId, number>;
  profileId: string;
  bottleneckKey: BlockId;
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

export default function Diagnostico() {
  const [step, setStep] = useState<Step>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [form, setForm] = useState<FormState>({ name: "", email: "", role: "", company: "", size: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const current = questions[index];
  const progress = step === "quiz" ? ((index + 1) / questions.length) * 100 : 0;

  // Local, client-side calculation — used as a fallback if the API call
  // fails, so the person always sees a result even if the network or
  // Supabase hiccups.
  const localReport = useMemo(() => buildReport(answers), [answers]);

  function choose(value: number) {
    setAnswers((a) => ({ ...a, [index]: value }));
  }

  function next() {
    if (answers[index] === undefined) return;
    if (index < questions.length - 1) setIndex(index + 1);
    else setStep("capture");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prev() {
    if (index > 0) setIndex(index - 1);
    else setStep("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitDiagnostic() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, answers }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Não foi possível calcular seu resultado.");
      setResult(data as SubmitResult);
      setStep("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      });
      setSubmitError(
        "Não conseguimos salvar seus dados agora, mas seu resultado abaixo foi calculado normalmente."
      );
      setStep("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  if (step === "intro")
    return (
      <main className="quiz">
        <div className="quizMain">
          <div className="brand" style={{ color: "#79531d" }}>DevelopYourself</div>
          <div className="question" style={{ marginTop: 60 }}>
            <div className="questionLabel">RH NA MESA DO CEO</div>
            <h1>Antes de começar</h1>
            <p className="sectionLead">Não pense no RH que você gostaria de ter. Pense no RH que existe hoje.</p>
            <div className="quote">Não existem respostas certas ou erradas. O valor do diagnóstico está na honestidade da resposta.</div>
            <button className="cta" onClick={() => setStep("quiz")}>
              Começar diagnóstico <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </button>
            <p className="small" style={{ marginTop: 18 }}>20 perguntas · aproximadamente 7 minutos · resultado imediato</p>
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
                  {answers[index] === i && <Check size={19} color="#a8792d" style={{ marginLeft: "auto", flex: "none" }} />}
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
              <div className="field">
                <label>Tamanho aproximado da empresa</label>
                <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
                  <option value="">Selecione</option>
                  <option>Até 49</option>
                  <option>50–249</option>
                  <option>250–999</option>
                  <option>1.000–4.999</option>
                  <option>5.000+</option>
                </select>
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
            <h3 style={{ marginTop: 32 }}>Comece por aqui</h3>
            <ul className="focusList">{focus.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="section">
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
