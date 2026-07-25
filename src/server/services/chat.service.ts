import { groq } from '@ai-sdk/groq';
import { streamText, generateText, type ModelMessage } from 'ai';
import { conversationRepository } from '@/server/repositories/conversation.repository';
import { messageRepository } from '@/server/repositories/message.repository';

const MODEL = groq('llama-3.3-70b-versatile');
const UNTITLED = 'New conversation';
const MAX_HEURISTIC_LENGTH = 50;

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

function truncateToTitle(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= MAX_HEURISTIC_LENGTH) return cleaned;
  const truncated = cleaned.slice(0, MAX_HEURISTIC_LENGTH);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated) + '…';
}

async function generateTitle(
  conversationId: string,
  userId: string,
  userMessage: string
): Promise<void> {
  try {
    const { text } = await generateText({
      model: MODEL,
      system:
        'Generate a concise title (3-6 words) for a conversation that starts with the following message. Return ONLY the title, no quotes, no punctuation at the end.',
      messages: [{ role: 'user', content: userMessage }],
      maxOutputTokens: 20,
    });
    const title = text.trim().replace(/[."]+$/g, '');
    if (title) {
      await conversationRepository.updateTitle(conversationId, userId, title);
    }
  } catch {
    // LLM title generation failed — heuristic title remains as fallback
  }
}

export const chatService = {
  async getConversations(userId: string) {
    return conversationRepository.findByUserId(userId);
  },

  async getConversation(id: string, userId: string) {
    return conversationRepository.findById(id, userId);
  },

  async createConversation(userId: string, title?: string, companyId?: string) {
    return conversationRepository.create({
      userId,
      title: title || UNTITLED,
      companyId,
    });
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

    const isFirstMessage = conversation.messages.length === 0;

    if (isFirstMessage) {
      await conversationRepository.updateTitle(
        conversationId,
        userId,
        truncateToTitle(userContent)
      );
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

        if (isFirstMessage) {
          generateTitle(conversationId, userId, userContent);
        }
      },
    });

    return result;
  },
};
