export type BlockId = "strategy" | "value" | "influence" | "organization" | "future";

export const blocks = {
  "strategy": {
    "label": "Estratégia",
    "short": "Estratégia",
    "icon": "Compass",
    "image": "/images/blocks/block-01-strategy.jpg"
  },
  "value": {
    "label": "Valor para o negócio",
    "short": "Valor",
    "icon": "TrendingUp",
    "image": "/images/blocks/block-02-value.jpg"
  },
  "influence": {
    "label": "Influência",
    "short": "Influência",
    "icon": "MessageCircle",
    "image": "/images/blocks/block-03-influence.jpg"
  },
  "organization": {
    "label": "Organização e capacidade humana",
    "short": "Organização",
    "icon": "Network",
    "image": "/images/blocks/block-04-organization.jpg"
  },
  "future": {
    "label": "Futuro, IA e transformação",
    "short": "Futuro",
    "icon": "Sparkles",
    "image": "/images/blocks/block-05-future.jpg"
  }
} as const;

export const questions = [
  {
    "id": 1,
    "block": "strategy",
    "title": "A estratégia do negócio",
    "text": "Quando a empresa define suas principais prioridades para os próximos 12–24 meses, o RH:",
    "options": [
      "Recebe as decisões e trabalha nas consequências para as pessoas.",
      "É consultado sobre as necessidades de pessoas depois que as prioridades começam a ser definidas.",
      "Participa da discussão estratégica e traduz prioridades em necessidades de talento, liderança e organização.",
      "Ajuda a construir a própria estratégia, antecipando quais capacidades organizacionais serão necessárias para executá-la."
    ]
  },
  {
    "id": 2,
    "block": "strategy",
    "title": "Conhecimento do negócio",
    "text": "Se o CEO perguntasse hoje quais fatores mais impactam o resultado da empresa, quanto o RH conseguiria responder com segurança?",
    "options": [
      "Principalmente indicadores de pessoas.",
      "Conhecemos alguns indicadores do negócio, mas nem sempre conseguimos conectá-los à agenda de pessoas.",
      "Conseguimos conectar os principais desafios do negócio às prioridades de RH.",
      "O time de RH acompanha indicadores do negócio e usa esse conhecimento para orientar decisões antes que os problemas apareçam."
    ]
  },
  {
    "id": 3,
    "block": "strategy",
    "title": "Prioridades",
    "text": "Quando surgem dez demandas diferentes para RH ao mesmo tempo, como vocês decidem onde colocar energia?",
    "options": [
      "Priorizamos conforme urgência e solicitação das lideranças.",
      "Consideramos urgência, impacto nas pessoas e recursos disponíveis.",
      "Priorizamos de acordo com as prioridades estratégicas do negócio.",
      "Além disso, avaliamos quais iniciativas aumentam ou reduzem a capacidade da organização de executar sua estratégia."
    ]
  },
  {
    "id": 4,
    "block": "strategy",
    "title": "Cultura e estratégia",
    "text": "Quando existe uma diferença entre a cultura atual e o comportamento necessário para executar a estratégia:",
    "options": [
      "Trabalhamos principalmente comunicação, treinamento ou campanhas.",
      "Identificamos alguns comportamentos que precisam mudar.",
      "A liderança e o RH trabalham juntos para mudar comportamentos, sistemas e incentivos.",
      "Cultura é tratada como uma variável estratégica da execução — e decisões de liderança, estrutura, reconhecimento e talento são ajustadas de acordo."
    ]
  },
  {
    "id": 5,
    "block": "value",
    "title": "Indicadores",
    "text": "Quais indicadores aparecem com mais frequência nas conversas do RH com a liderança executiva?",
    "options": [
      "Headcount, turnover, absenteísmo, vagas, treinamentos e outros indicadores operacionais.",
      "Indicadores de pessoas + alguns indicadores do negócio.",
      "Indicadores de pessoas são apresentados junto aos indicadores de negócio que eles influenciam.",
      "O RH usa indicadores para explicar causas, antecipar riscos e apoiar decisões de negócio."
    ]
  },
  {
    "id": 6,
    "block": "value",
    "title": "ROI",
    "text": "Imagine que o CFO pergunte: “Quanto esse programa de RH vai gerar ou proteger para a empresa?” O que acontece?",
    "options": [
      "É difícil responder.",
      "Conseguimos apresentar custos, adesão e alguns indicadores de resultado.",
      "Conseguimos construir uma relação entre investimento, comportamento e resultado esperado.",
      "O business case faz parte da própria concepção do programa e seus resultados são acompanhados depois da implementação."
    ]
  },
  {
    "id": 7,
    "block": "value",
    "title": "Business case",
    "text": "Antes de lançar uma iniciativa importante de RH, vocês conseguem responder claramente: “Qual problema de negócio estamos tentando resolver?”",
    "options": [
      "Nem sempre.",
      "Normalmente conseguimos identificar um problema de pessoas.",
      "Identificamos o problema de pessoas e sua relação com o negócio.",
      "Definimos hipótese, impacto esperado, indicadores e critérios para saber se a iniciativa funcionou."
    ]
  },
  {
    "id": 8,
    "block": "value",
    "title": "Evidências",
    "text": "Quando uma iniciativa de RH apresenta bons resultados, como isso é demonstrado para a liderança?",
    "options": [
      "Por participação, satisfação ou percepção dos colaboradores.",
      "Por indicadores de RH antes e depois.",
      "Por indicadores de RH relacionados a resultados do negócio.",
      "Por evidências que permitem comparar alternativas, calcular impacto e decidir se devemos continuar, mudar ou interromper a iniciativa."
    ]
  },
  {
    "id": 9,
    "block": "influence",
    "title": "Acesso à decisão",
    "text": "Em decisões relevantes para o futuro da organização, o RH normalmente entra:",
    "options": [
      "Quando a decisão já foi tomada e precisamos implementá-la.",
      "Quando a decisão começa a gerar impactos sobre pessoas.",
      "Durante a construção da decisão.",
      "Antes da decisão, ajudando a identificar riscos, capacidades necessárias e consequências organizacionais."
    ]
  },
  {
    "id": 10,
    "block": "influence",
    "title": "Discordar do CEO",
    "text": "Quando o RH acredita que uma decisão da liderança pode comprometer a organização no médio ou longo prazo:",
    "options": [
      "Normalmente procuramos apoiar a decisão e reduzir seus efeitos negativos.",
      "Levamos nossas preocupações ao líder responsável.",
      "Apresentamos dados, riscos e alternativas.",
      "O RH é reconhecido como um parceiro capaz de desafiar decisões, inclusive quando isso é desconfortável."
    ]
  },
  {
    "id": 11,
    "block": "influence",
    "title": "Linguagem",
    "text": "Em uma reunião com CEO, CFO e COO, o RH consegue apresentar um problema de pessoas usando a linguagem que esses executivos usam para tomar decisões?",
    "options": [
      "Principalmente falamos em indicadores e conceitos de RH.",
      "Fazemos algumas conexões com custos, produtividade ou risco.",
      "Adaptamos a conversa aos objetivos e indicadores do negócio.",
      "O problema de pessoas é apresentado como uma questão de negócio, com alternativas, trade-offs e consequências."
    ]
  },
  {
    "id": 12,
    "block": "influence",
    "title": "Confiança",
    "text": "Quando uma decisão estratégica envolve pessoas, qual destas situações mais se aproxima da relação entre RH e liderança?",
    "options": [
      "O RH é acionado principalmente para executar.",
      "O RH é um consultor importante para temas de pessoas.",
      "O RH é um parceiro na tomada de decisões.",
      "A liderança procura o RH antes de decisões críticas porque confia na sua capacidade de enxergar o sistema organizacional como um todo."
    ]
  },
  {
    "id": 13,
    "block": "organization",
    "title": "Capacidades futuras",
    "text": "Quando a estratégia muda, como vocês identificam quais capacidades a organização precisará desenvolver?",
    "options": [
      "Reagimos quando surgem novas demandas.",
      "Fazemos levantamentos de competências e necessidades de treinamento.",
      "Conectamos competências e talentos às prioridades estratégicas.",
      "Antecipamos capacidades futuras e decidimos estrategicamente o que desenvolver, contratar, terceirizar, automatizar ou redesenhar."
    ]
  },
  {
    "id": 14,
    "block": "organization",
    "title": "Design do trabalho",
    "text": "Quando uma tecnologia nova muda a maneira como uma atividade é realizada, o RH:",
    "options": [
      "Atua principalmente na comunicação e treinamento.",
      "Avalia impactos nas funções e competências.",
      "Trabalha com as áreas para redesenhar funções e responsabilidades.",
      "Participa desde o início do redesenho do trabalho, considerando tecnologia, pessoas, processos, skills e estrutura."
    ]
  },
  {
    "id": 15,
    "block": "organization",
    "title": "Liderança",
    "text": "Quando a organização precisa executar uma transformação importante, o RH normalmente:",
    "options": [
      "Organiza treinamentos e comunicação.",
      "Desenvolve os líderes envolvidos.",
      "Trabalha com a liderança para mudar comportamentos e práticas.",
      "Trata liderança como uma capacidade crítica da transformação e acompanha se os comportamentos necessários realmente estão acontecendo."
    ]
  },
  {
    "id": 16,
    "block": "organization",
    "title": "Cultura na prática",
    "text": "Como vocês sabem que a cultura desejada realmente existe?",
    "options": [
      "Pesquisas de clima e percepção.",
      "Pesquisas + alguns indicadores de comportamento.",
      "Observamos comportamentos, decisões e indicadores relacionados à cultura.",
      "Conseguimos identificar quais comportamentos estão acelerando ou bloqueando a estratégia e usamos essa informação para intervir."
    ]
  },
  {
    "id": 17,
    "block": "future",
    "title": "IA no RH",
    "text": "Como a IA está sendo usada atualmente pelo RH?",
    "options": [
      "Ainda estamos explorando possibilidades.",
      "Algumas pessoas usam ferramentas de IA individualmente.",
      "Temos casos de uso definidos em processos específicos.",
      "A IA faz parte de uma estratégia de transformação do trabalho, com objetivos, governança, métricas e definição clara do que deve continuar sendo humano."
    ]
  },
  {
    "id": 18,
    "block": "future",
    "title": "Impacto da IA",
    "text": "Quando vocês implementam uma solução de IA em RH, como avaliam se ela realmente funcionou?",
    "options": [
      "Principalmente pela adoção e economia de tempo.",
      "Pela eficiência do processo.",
      "Pela eficiência + qualidade da experiência.",
      "Pela combinação de eficiência, qualidade, risco, experiência e impacto nos resultados do negócio."
    ]
  },
  {
    "id": 19,
    "block": "future",
    "title": "Governança",
    "text": "Quando colaboradores usam IA para trabalhar, qual é a situação mais próxima da sua organização?",
    "options": [
      "Cada área ou pessoa decide como utilizar.",
      "Existem algumas orientações, mas ainda há muitas zonas cinzentas.",
      "Existem políticas, orientações e treinamentos.",
      "Existe governança clara sobre uso, dados, riscos, responsabilidades, capacitação e decisões que não devem ser automatizadas."
    ]
  },
  {
    "id": 20,
    "block": "future",
    "title": "O futuro do RH",
    "text": "Se você tivesse que redesenhar o RH para os próximos cinco anos, qual afirmação mais se aproxima da realidade atual?",
    "options": [
      "Precisamos principalmente digitalizar e tornar os processos mais eficientes.",
      "Precisamos desenvolver novas competências e melhorar nossa capacidade de atender o negócio.",
      "Precisamos mudar o modelo de atuação para sermos mais estratégicos e orientados por dados.",
      "Precisamos repensar o próprio papel do RH: trabalho, skills, tecnologia, liderança, cultura e organização precisam ser tratados como um sistema."
    ]
  }
] as const;

export const profiles = [
  {
    "id": "executor",
    "min": 20,
    "max": 35,
    "name": "RH EXECUTOR",
    "tagline": "Você entrega. Agora precisa conectar.",
    "body1": "Seu RH demonstra capacidade de executar processos e responder às necessidades da organização, mas grande parte da atuação ainda acontece depois que as decisões são tomadas.",
    "body2": "O próximo salto não é fazer mais. É começar a conectar o que o RH faz ao que o negócio precisa alcançar.",
    "focus": [
      "Entender melhor a estratégia",
      "Priorizar iniciativas pelo impacto",
      "Traduzir indicadores de pessoas em problemas de negócio"
    ]
  },
  {
    "id": "integrator",
    "min": 36,
    "max": 50,
    "name": "RH INTEGRADOR",
    "tagline": "Você já conecta pessoas e negócio. Falta transformar conexão em influência.",
    "body1": "Seu RH já ultrapassou uma atuação puramente operacional. Existem conexões entre pessoas, liderança e negócio — mas elas ainda podem depender de iniciativas específicas, profissionais-chave ou momentos determinados.",
    "body2": "O próximo passo é transformar essas conexões em uma forma consistente de tomar decisões.",
    "focus": [
      "Business cases",
      "Métricas de impacto",
      "Participação mais cedo nas decisões"
    ]
  },
  {
    "id": "strategic",
    "min": 51,
    "max": 65,
    "name": "RH PARCEIRO ESTRATÉGICO",
    "tagline": "Você já está na conversa. Agora precisa ampliar seu campo de influência.",
    "body1": "Seu RH demonstra uma atuação conectada à estratégia e ao negócio. Indicadores, liderança e prioridades organizacionais já fazem parte da conversa.",
    "body2": "O próximo desafio é antecipar decisões: quais capacidades serão necessárias? Como o trabalho precisa mudar? Onde tecnologia pode ampliar capacidade? Que riscos ainda não estão no radar?",
    "focus": [
      "Antecipação",
      "Redesign do trabalho",
      "Capacidade organizacional"
    ]
  },
  {
    "id": "architect",
    "min": 66,
    "max": 80,
    "name": "RH ARQUITETO DO TRABALHO",
    "tagline": "Você não está apenas gerindo pessoas. Está ajudando a desenhar como o trabalho acontece.",
    "body1": "Seu resultado indica uma atuação que ultrapassa a lógica tradicional da função de RH. Estratégia, pessoas, liderança, tecnologia, cultura e desenho do trabalho aparecem como partes de um mesmo sistema.",
    "body2": "O próximo desafio é usar essa influência para antecipar mudanças e ajudar a organização a construir as capacidades necessárias para o futuro.",
    "focus": [
      "Redesenhar o trabalho",
      "Antecipar capacidades",
      "Integrar humanos + tecnologia"
    ]
  }
] as const;

export const bottlenecks = {
  strategy: {
    title: "ESTRATÉGIA",
    text: "Você entende e executa bem, mas pode participar mais cedo da construção da direção do negócio."
  },
  value: {
    title: "VALOR PARA O NEGÓCIO",
    text: "Você faz muito, mas ainda pode demonstrar melhor o impacto das iniciativas de RH sobre o negócio."
  },
  influence: {
    title: "INFLUÊNCIA",
    text: "Você tem conhecimento, mas pode transformar esse conhecimento em mais influência sobre decisões."
  },
  organization: {
    title: "ORGANIZAÇÃO",
    text: "Você trabalha bem com pessoas, mas pode ampliar a visão para capacidades, estrutura e desenho do trabalho."
  },
  future: {
    title: "FUTURO",
    text: "Você está acompanhando a transformação, mas ainda pode assumir mais protagonismo no redesenho do trabalho."
  }
} as const;

export const resultFocus = {
  strategy: ["Conectar prioridades do negócio às capacidades necessárias", "Participar mais cedo das decisões", "Usar cultura como variável de execução"],
  value: ["Definir o problema de negócio antes da iniciativa", "Criar hipóteses e indicadores de impacto", "Voltar depois para verificar o que realmente mudou"],
  influence: ["Apresentar problemas de pessoas como problemas de negócio", "Levar alternativas e trade-offs para a liderança", "Construir confiança para desafiar decisões"],
  organization: ["Mapear capacidades futuras", "Redesenhar trabalho com tecnologia e pessoas", "Tratar liderança e cultura como capacidades de transformação"],
  future: ["Mapear onde IA aumenta capacidade", "Criar governança clara", "Integrar humanos, tecnologia, skills e desenho do trabalho"]
} as const;
