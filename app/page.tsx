import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, TrendingUp, MessageCircle, Network, Sparkles } from "lucide-react";
import { blocks } from "./data";

const icons = { Compass, TrendingUp, MessageCircle, Network, Sparkles };

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div className="container heroInner">
          <div>
            <div className="brand">DevelopYourself</div>
            <div className="kicker">Diagnóstico de maturidade estratégica do RH</div>
            <h1>Seu RH está participando das decisões — ou apenas <span>respondendo</span> a elas?</h1>
            <p className="heroLead">
              Em cerca de 7 minutos, avalie como seu RH atua em estratégia, valor,
              influência, organização e futuro do trabalho.
            </p>
            <div style={{marginTop: 30}}>
              <Link className="cta" href="/diagnostico">Fazer o diagnóstico gratuito <ArrowRight size={18} style={{marginLeft:8}} /></Link>
            </div>
            <div className="heroMeta">
              <span>20 perguntas</span><span>·</span><span>~7 minutos</span><span>·</span><span>resultado imediato</span>
            </div>
          </div>
          <div className="heroPortrait">
            <Image src="/images/gabi/gabi-hero.jpg" alt="Gabrielle Botelho" width={420} height={420} priority />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="sectionHeader">
            <div className="eyebrow">A nova conversa sobre RH</div>
            <h2>O mundo do trabalho mudou.</h2>
            <p className="sectionLead">
              IA está redesenhando tarefas. Novas competências estão surgindo.
              Organizações estão repensando estruturas. E o papel do RH também está mudando.
            </p>
            <div className="quote">“Como construímos a capacidade humana e organizacional necessária para o negócio avançar?”</div>
          </div>
          <div className="dimensions">
            {Object.entries(blocks).map(([key, block]) => {
              const Icon = icons[block.icon as keyof typeof icons];
              return <div className="dimension" key={key}>
                <Icon size={25} color="#a8792d" />
                <h3>{block.label}</h3>
                <p>{key === "strategy" ? "Entender e influenciar as prioridades do negócio." :
                    key === "value" ? "Demonstrar impacto além dos indicadores tradicionais de pessoas." :
                    key === "influence" ? "Participar de decisões e conseguir desafiar a liderança." :
                    key === "organization" ? "Transformar estratégia em capacidades, liderança e desenho do trabalho." :
                    "Preparar o RH para IA, novas skills e transformação do trabalho."}</p>
              </div>;
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <div className="eyebrow">Como funciona</div>
            <h2>Uma conversa de 7 minutos.</h2>
          </div>
          <div className="steps">
            <div className="step"><div className="stepNum">01</div><h3>Responda</h3><p>20 perguntas sobre a realidade do seu RH hoje. Não o RH que você gostaria de ter.</p></div>
            <div className="step"><div className="stepNum">02</div><h3>Descubra</h3><p>Veja seu estágio de atuação e como suas capacidades se distribuem pelos cinco eixos.</p></div>
            <div className="step"><div className="stepNum">03</div><h3>Aja</h3><p>Identifique seu principal espaço de evolução e leve perguntas práticas para sua próxima conversa de liderança.</p></div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container about">
          <div className="aboutImage" aria-label="Espaço para foto da Gabrielle Botelho" />
          <div className="aboutCopy">
            <div className="eyebrow">DevelopYourself</div>
            <h2>Uma ferramenta para provocar uma conversa que importa.</h2>
            <p>
              O diagnóstico parte de uma ideia simples: o impacto estratégico do RH não
              está apenas no que a função entrega, mas na sua capacidade de conectar pessoas,
              trabalho, organização e negócio.
            </p>
            <p>
              A experiência foi criada para gerar reflexão prática — não para classificar
              empresas, avaliar profissionais ou substituir uma análise organizacional mais profunda.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="startCard">
            <div className="eyebrow" style={{color:"#d8b66f"}}>Pronto?</div>
            <h2>Não pense no RH que você gostaria de ter. Pense no RH que existe hoje.</h2>
            <p>Não existem respostas certas ou erradas. Quanto mais honesta for sua resposta, mais útil será a conversa que o diagnóstico pode provocar.</p>
            <Link className="cta" href="/diagnostico">Começar agora <ArrowRight size={18} style={{marginLeft:8}} /></Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">© {new Date().getFullYear()} DevelopYourself · RH na Mesa do CEO</div>
      </footer>
    </main>
  );
}
