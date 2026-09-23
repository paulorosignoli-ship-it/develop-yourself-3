import "server-only";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { BlockId } from "@/app/data";
import type { DiagnosticReport } from "@/lib/scoring";

const COLORS = {
  navy: "#162332",
  gold: "#d8b66f",
  accent: "#a8792d",
  ink: "#17202a",
  muted: "#66717d",
  line: "#e4e0d7",
};

const BLOCK_NAMES: Record<BlockId, string> = {
  strategy: "Estratégia",
  value: "Valor para o negócio",
  influence: "Influência",
  organization: "Organização",
  future: "Futuro & IA",
};

const BLOCK_ORDER: BlockId[] = ["strategy", "value", "influence", "organization", "future"];

const styles = StyleSheet.create({
  page: { padding: 42, fontSize: 11, color: COLORS.ink, fontFamily: "Helvetica" },
  brand: { fontSize: 10, letterSpacing: 2, color: COLORS.muted, textTransform: "uppercase" },
  title: { fontSize: 22, marginTop: 6, color: COLORS.navy, fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 12, color: COLORS.accent, marginTop: 6 },
  scoreBox: { marginTop: 20, padding: 18, backgroundColor: COLORS.navy, borderRadius: 8 },
  scoreLabel: { color: "#fff", fontSize: 10, opacity: 0.8 },
  scoreProfile: { color: "#fff", fontSize: 17, fontFamily: "Helvetica-Bold", marginTop: 3 },
  scoreNumber: { color: COLORS.gold, fontSize: 30, fontFamily: "Helvetica-Bold", marginTop: 6 },
  scoreTagline: { color: "#fff", fontSize: 10, opacity: 0.85, marginTop: 6, lineHeight: 1.4 },
  section: { marginTop: 22 },
  sectionTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: COLORS.navy, marginBottom: 8 },
  paragraph: { lineHeight: 1.5, marginBottom: 6 },
  barRow: { marginBottom: 10 },
  barLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  barTrack: { height: 6, backgroundColor: "#e7e2d9", borderRadius: 3 },
  barFill: { height: 6, backgroundColor: COLORS.accent, borderRadius: 3 },
  focusItem: { flexDirection: "row", marginBottom: 6 },
  focusBullet: { width: 14, color: COLORS.accent, fontFamily: "Helvetica-Bold" },
  focusText: { flex: 1, lineHeight: 1.4 },
  footer: {
    marginTop: 28,
    fontSize: 8.5,
    color: COLORS.muted,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    paddingTop: 10,
    lineHeight: 1.4,
  },
});

export interface ReportPdfInput {
  name?: string;
  company?: string;
  role?: string;
  report: DiagnosticReport;
}

function ReportDocument({ name, company, role, report }: ReportPdfInput) {
  const identity = [name, role, company].filter(Boolean).join(" · ");

  return (
    <Document title="Diagnóstico RH na Mesa do CEO">
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>DevelopYourself · RH na Mesa do CEO</Text>
        <Text style={styles.title}>Diagnóstico de Maturidade Estratégica do RH</Text>
        {identity ? <Text style={styles.subtitle}>{identity}</Text> : null}

        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Seu estágio</Text>
          <Text style={styles.scoreProfile}>{report.profile.name}</Text>
          <Text style={styles.scoreNumber}>{report.total} / 80</Text>
          <Text style={styles.scoreTagline}>{report.profile.tagline}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seu retrato</Text>
          <Text style={styles.paragraph}>{report.profile.body1}</Text>
          <Text style={styles.paragraph}>{report.profile.body2}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sua capacidade por eixo</Text>
          {BLOCK_ORDER.map((key) => (
            <View style={styles.barRow} key={key}>
              <View style={styles.barLabelRow}>
                <Text>{BLOCK_NAMES[key]}</Text>
                <Text>{report.percentages[key]}%</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${report.percentages[key]}%` }]} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Seu principal ponto de atenção: {report.bottleneck.title}
          </Text>
          <Text style={styles.paragraph}>{report.bottleneck.text}</Text>
          {report.focus.map((item) => (
            <View style={styles.focusItem} key={item}>
              <Text style={styles.focusBullet}>{"\u2192"}</Text>
              <Text style={styles.focusText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Este é um diagnóstico de autoavaliação, não um teste psicométrico validado nem um
          benchmark científico. Os resultados são indicativos e destinados a provocar reflexão e
          ação — não a classificar empresas ou avaliar profissionais individualmente. Gerado em{" "}
          {new Date().toLocaleDateString("pt-BR")} por developyourself.com.
        </Text>
      </Page>
    </Document>
  );
}

export async function renderReportPdf(input: ReportPdfInput): Promise<Buffer> {
  return renderToBuffer(<ReportDocument {...input} />);
}
