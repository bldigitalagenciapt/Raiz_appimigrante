import { useState, useRef, useEffect } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Bot, AlertCircle, Sparkles, ChevronRight, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import { visaFaqQuestions } from '@/data/visaTypes';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const generalFaqQuestions = [
  {
    question: 'O que é a AIMA?',
    answer: `A AIMA (Agência para a Integração, Migrações e Asilo) é o órgão responsável pelos processos de imigração em Portugal.

**O que faz:**
• Autorização de residência
• Renovação de documentos
• Manifestação de interesse
• Reagrupamento familiar

**Dica importante:**
Os processos podem demorar. Guarde sempre seus protocolos!`,
  },
  {
    question: 'Como tirar o NIF?',
    answer: `O NIF (Número de Identificação Fiscal) é essencial para qualquer atividade fiscal em Portugal.

**Como obter:**
1. Vá a um balcão das Finanças
2. Leve seu passaporte e comprovativo de morada
3. Pode ser feito presencialmente ou online (com representante fiscal)

**Documentos necessários:**
• Passaporte válido
• Comprovativo de morada (contrato de arrendamento, carta de familiar, etc.)`,
  },
  {
    question: 'Como tirar o NISS?',
    answer: `O NISS (Número de Identificação da Segurança Social) é necessário para trabalhar legalmente.

**Como obter:**
1. Vá a um balcão da Segurança Social
2. Ou peça ao seu empregador para solicitar

**Documentos necessários:**
• Passaporte
• NIF
• Contrato de trabalho (se tiver)

**Prazo:** Geralmente sai no mesmo dia!`,
  },
  {
    question: 'Como funciona o SNS?',
    answer: `O SNS (Serviço Nacional de Saúde) é o sistema público de saúde em Portugal.

**Como ter acesso:**
1. Obter o número de utente no Centro de Saúde
2. Levar passaporte, NIF e comprovativo de morada

**Serviços disponíveis:**
• Consultas de medicina geral
• Urgências hospitalares
• Especialidades (com encaminhamento)
• Vacinação

**Custo:** Taxas moderadoras baixas ou gratuito para alguns grupos.`,
  },
  {
    question: 'Preciso de morada para tirar o NIF?',
    answer: `Depende da sua situação:

**Com morada em Portugal:**
• Vá às Finanças com comprovativo de morada
• Contrato de arrendamento ou declaração de alojamento

**Sem morada em Portugal:**
• Precisa de um representante fiscal
• Pode ser um cidadão português ou empresa
• O NIF ficará vinculado à morada do representante

**Dica:** Algumas lojas de serviços oferecem representação fiscal por um valor mensal.`,
  },
  {
    question: 'O que é a Manifestação de Interesse?',
    answer: `A Manifestação de Interesse é um processo para regularização de imigrantes que já estão em Portugal.

**Para quem é:**
• Pessoas que entraram legalmente em Portugal
• Que já têm contrato de trabalho
• Com contribuições para a Segurança Social

**Como fazer:**
1. Acessar o portal da AIMA
2. Preencher o formulário online
3. Aguardar convocação

**Importante:** Este processo pode demorar meses. Guarde o número de protocolo!`,
  },
  {
    question: 'O que é o CPLP?',
    answer: `CPLP significa Comunidade dos Países de Língua Portuguesa.

**Países membros:**
• Brasil, Portugal, Angola, Moçambique
• Cabo Verde, Guiné-Bissau, São Tomé e Príncipe
• Timor-Leste, Guiné Equatorial

**Vantagens para brasileiros:**
• Processo de visto simplificado
• Acordo de mobilidade (em implementação)
• Facilidades para obter residência

**Documentos geralmente necessários:**
• Passaporte válido
• Certidão de nascimento
• Antecedentes criminais`,
  },
  {
    question: 'Quais documentos devo guardar?',
    answer: `Documentos essenciais para guardar em Portugal:

**Identificação:**
• Passaporte (original e cópias)
• Título de residência
• NIF e NISS

**Trabalho:**
• Contrato de trabalho
• Recibos de vencimento
• Declaração de IRS

**Saúde:**
• Número de utente SNS
• Cartão Europeu (se aplicável)

**Moradia:**
• Contrato de arrendamento
• Comprovativos de morada

**Dica:** Use o app VOY para guardar tudo digitalmente!`,
  },
  {
    question: 'Como me organizar para não perder prazos?',
    answer: `Dicas para não perder prazos importantes:

**Use o app VOY:**
• Adicione datas importantes na seção Imigração
• Crie notas com lembretes
• Configure alertas

**Prazos comuns:**
• Renovação de título: iniciar 30 dias antes do vencimento
• Manifestação de interesse: acompanhar status regularmente
• IRS: entregar entre abril e junho

**Dica importante:**
Guarde todos os protocolos e comprovantes. Tire foto e salve no app!`,
  },
  {
    question: 'Onde acompanho meu processo?',
    answer: `Para acompanhar seu processo de imigração:

**Portal AIMA:**
• Acesse: aima.gov.pt
• Use seu número de processo/protocolo
• Verifique o status regularmente

**Outras formas:**
• Linha telefónica da AIMA
• Email (pode demorar para responder)
• Balcão presencial (com agendamento)

**Dica:** 
Anote o número do protocolo no app VOY na seção Imigração!

**Importante:** 
Os processos podem demorar. Paciência é fundamental.`,
  },
];

// Combine general FAQ with visa FAQ
const faqQuestions = [...generalFaqQuestions, ...visaFaqQuestions];

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectQuestion = (question: string) => {
    const faq = faqQuestions.find(q => q.question === question);
    if (!faq) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: faq.answer,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setSelectedQuestion(question);
  };

  const handleReset = () => {
    setMessages([]);
    setSelectedQuestion(null);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-card/80 backdrop-blur-xl safe-area-top">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-foreground">Preciso de Ajuda</h1>
              <p className="text-xs text-muted-foreground">Perguntas frequentes</p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={handleReset}
                className="text-sm text-primary font-medium"
              >
                Voltar
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {messages.length === 0 ? (
            <div className="space-y-6">
              {/* Welcome */}
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-lg font-semibold mb-2">Olá! Como posso ajudar?</h2>
                <p className="text-sm text-muted-foreground">
                  Escolha uma pergunta abaixo
                </p>
              </div>

              {/* FAQ Questions */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Perguntas frequentes
                </p>
                {faqQuestions.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectQuestion(faq.question)}
                    className="w-full flex items-center justify-between p-4 text-left bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <span className="font-medium text-foreground">{faq.question}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3 animate-fade-in',
                    message.role === 'user' && 'flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      message.role === 'user'
                        ? 'bg-primary/15'
                        : 'bg-success/15'
                    )}
                  >
                    {message.role === 'user' ? (
                      <span className="text-xs font-bold text-primary">EU</span>
                    ) : (
                      <Bot className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[85%] p-4 rounded-2xl',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-card border border-border rounded-bl-md'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {/* More Questions */}
              {messages.length > 0 && (
                <div className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-3">
                    Outras perguntas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {faqQuestions
                      .filter(q => q.question !== selectedQuestion)
                      .slice(0, 4)
                      .map((faq, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectQuestion(faq.question)}
                          className="px-3 py-2 text-sm bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                        >
                          {faq.question}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="px-5 py-3 border-t border-border bg-card/80">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>Estas informações são orientativas. Confirme sempre nos canais oficiais.</span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
