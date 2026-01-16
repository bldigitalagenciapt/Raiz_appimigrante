export interface VisaType {
  id: string;
  name: string;
  shortDescription: string;
  forWho: string;
  duration: string;
  requiredDocuments: string[];
  observations: string[];
}

export const visaTypes: VisaType[] = [
  {
    id: 'study',
    name: 'Visto de Estudo',
    shortDescription: 'Para quem deseja estudar em Portugal por mais de 3 meses.',
    forWho: 'Estudantes aceitos em instituições de ensino portuguesas, incluindo cursos técnicos, graduação, mestrado e doutorado.',
    duration: 'Validade de 4 meses (renovável por Autorização de Residência)',
    requiredDocuments: [
      'Passaporte válido (mínimo 6 meses)',
      'Carta de aceitação da instituição de ensino',
      'Comprovativo de meios de subsistência',
      'Seguro de saúde válido em Portugal',
      'Comprovativo de alojamento',
      'Atestado de antecedentes criminais',
      'Formulário de pedido de visto preenchido',
      'Fotografias tipo passe'
    ],
    observations: [
      'Permite trabalho em tempo parcial (até 20h/semana)',
      'Pode ser convertido em autorização de residência após chegada',
      'Requer renovação anual durante os estudos'
    ]
  },
  {
    id: 'work',
    name: 'Visto de Trabalho',
    shortDescription: 'Para quem tem uma oferta de emprego em Portugal.',
    forWho: 'Trabalhadores com contrato ou promessa de contrato de trabalho com empresa portuguesa.',
    duration: 'Validade de 4 meses (renovável por Autorização de Residência)',
    requiredDocuments: [
      'Passaporte válido (mínimo 6 meses)',
      'Contrato de trabalho ou promessa de contrato',
      'Declaração do empregador',
      'Comprovativo de qualificações profissionais',
      'Seguro de saúde válido',
      'Atestado de antecedentes criminais',
      'Comprovativo de alojamento (se disponível)',
      'Formulário de pedido de visto preenchido'
    ],
    observations: [
      'Empregador pode precisar obter parecer do IEFP',
      'Após entrada, deve solicitar autorização de residência',
      'Válido apenas para o empregador indicado no visto'
    ]
  },
  {
    id: 'job-seeking',
    name: 'Visto de Procura de Trabalho',
    shortDescription: 'Para quem deseja procurar emprego em Portugal.',
    forWho: 'Pessoas que desejam entrar em Portugal para procurar trabalho, sem ainda ter uma oferta.',
    duration: 'Validade de 120 dias (pode ser prorrogado por mais 60 dias)',
    requiredDocuments: [
      'Passaporte válido (mínimo 6 meses)',
      'Comprovativo de meios de subsistência',
      'Seguro de saúde válido',
      'Atestado de antecedentes criminais',
      'Comprovativo de alojamento',
      'Carta de motivação explicando o objetivo',
      'Currículo atualizado',
      'Formulário de pedido de visto preenchido'
    ],
    observations: [
      'Não permite trabalhar durante a procura',
      'Se encontrar emprego, deve solicitar autorização de residência',
      'Deve comprovar meios para se manter durante a estadia'
    ]
  },
  {
    id: 'residence',
    name: 'Visto de Residência',
    shortDescription: 'Para quem deseja residir em Portugal por diversos motivos.',
    forWho: 'Aposentados, pessoas com rendimentos próprios, investidores, empreendedores e reagrupamento familiar.',
    duration: 'Validade de 4 meses (renovável por Autorização de Residência)',
    requiredDocuments: [
      'Passaporte válido (mínimo 6 meses)',
      'Comprovativo de rendimentos regulares ou meios de subsistência',
      'Seguro de saúde válido',
      'Atestado de antecedentes criminais',
      'Comprovativo de alojamento em Portugal',
      'Documentação específica conforme categoria (aposentadoria, empresa, etc.)',
      'Formulário de pedido de visto preenchido'
    ],
    observations: [
      'Requisitos variam conforme subcategoria',
      'Permite viver e trabalhar em Portugal',
      'Pode levar ao acesso à cidadania portuguesa'
    ]
  },
  {
    id: 'schengen',
    name: 'Visto Schengen (Curta Duração)',
    shortDescription: 'Para visitas de curta duração a Portugal e outros países do Espaço Schengen.',
    forWho: 'Turistas, visitantes de negócios e pessoas que necessitam de visita de curta duração.',
    duration: 'Máximo de 90 dias num período de 180 dias',
    requiredDocuments: [
      'Passaporte válido (mínimo 3 meses após saída)',
      'Formulário de pedido de visto preenchido',
      'Fotografias tipo passe recentes',
      'Seguro de viagem (cobertura mínima €30.000)',
      'Comprovativo de alojamento',
      'Passagem de ida e volta',
      'Comprovativo de meios financeiros',
      'Atestado de antecedentes criminais (alguns casos)'
    ],
    observations: [
      'Não permite trabalhar em Portugal',
      'Válido para todo o Espaço Schengen',
      'Pode ser de entrada única ou múltipla',
      'Não pode ser convertido em visto de residência'
    ]
  }
];

export const visaFaqQuestions = visaTypes.map(visa => ({
  question: `O que é o ${visa.name}?`,
  answer: `**${visa.name}**

${visa.shortDescription}

**Para quem é indicado:**
${visa.forWho}

**Duração:**
${visa.duration}

**Documentos normalmente solicitados:**
${visa.requiredDocuments.map(doc => `• ${doc}`).join('\n')}

**Observações importantes:**
${visa.observations.map(obs => `• ${obs}`).join('\n')}

⚠️ **Aviso:** Esta informação é orientativa. As regras podem mudar. Consulte sempre o site oficial do consulado ou da VFS Global.`
}));
