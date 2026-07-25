import { groq } from '@ai-sdk/groq';
import { streamText, type ModelMessage } from 'ai';
import { conversationRepository } from '@/server/repositories/conversation.repository';
import { messageRepository } from '@/server/repositories/message.repository';

const MODEL = groq('llama-3.3-70b-versatile');

const BASE_SYSTEM_PROMPT = `You are AlphaResearch, an AI financial research assistant. You help investors, analysts, and students research companies, analyze financial data, and understand market concepts.

Guidelines:
- Be precise with numbers and cite specific data points when available
- Distinguish between facts, analysis, and opinion
- Flag when information might be outdated
- Use financial terminology but explain jargon when first introduced
- Never provide personalized investment advice or make buy/sell recommendations
- When you don't know something, say so clearly`;

function buildSystemPrompt(
  company?: {
    name: string;
    ticker: string;
    sector: string | null;
    industry: string | null;
  } | null
): string {
  if (!company) return BASE_SYSTEM_PROMPT;

  const details = [
    `Sector: ${company.sector ?? 'Unknown'}`,
    `Industry: ${company.industry ?? 'Unknown'}`,
  ].join(', ');

  return `${BASE_SYSTEM_PROMPT}

You are currently helping the user research ${company.name} (${company.ticker}).
${details}.
Focus your responses on this company when relevant, but answer general financial questions too.`;
}

export const chatService = {
  async getConversations(userId: string) {
    return conversationRepository.findByUserId(userId);
  },

  async getConversation(id: string, userId: string) {
    return conversationRepository.findById(id, userId);
  },

  async createConversation(userId: string, title: string, companyId?: string) {
    return conversationRepository.create({ userId, title, companyId });
  },

  async deleteConversation(id: string, userId: string) {
    return conversationRepository.softDelete(id, userId);
  },

  async sendMessage(
    conversationId: string,
    userId: string,
    userContent: string
  ) {
    const conversation = await conversationRepository.findById(
      conversationId,
      userId
    );
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    await messageRepository.create({
      conversationId,
      role: 'USER',
      content: userContent,
    });

    const history: ModelMessage[] = conversation.messages.map((m) => ({
      role: m.role === 'USER' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    }));
    history.push({ role: 'user', content: userContent });

    const systemPrompt = buildSystemPrompt(conversation.company);

    const result = streamText({
      model: MODEL,
      system: systemPrompt,
      messages: history,
      onFinish: async ({ text, usage }) => {
        await messageRepository.createWithTokens({
          conversationId,
          role: 'ASSISTANT',
          content: text,
          inputTokens: usage.inputTokens ?? 0,
          outputTokens: usage.outputTokens ?? 0,
        });
      },
    });

    return result;
  },
};
