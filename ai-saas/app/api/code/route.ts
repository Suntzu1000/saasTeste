import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {  checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage: OpenAI.Chat.ChatCompletionMessage = {
  role: 'system',
  content: 'Você é um gerador de código. Você deve responder apenas em trechos de código de redução. Use comentários de código para explicações. Responda em Português, Brasil'
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Não autorizado!", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("API DA OPENAI NÃO CONFIGURADA CORRETAMENTE", {
        status: 500,
      });
    }

    if (!messages) {
        return new NextResponse("Mensagens são obrigatórias", { status: 400 });
      }

      const freeTrial = await checkApiLimit();
      const isPro = await checkSubscription();
  
      if (!freeTrial && !isPro) {
        return new NextResponse(
          "A avaliação gratuita expirou. Atualize para pro...",
          { status: 403 }
        );
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [instructionMessage, ...messages]
      })

      if (!isPro) {
        await incrementApiLimit();
      }

      return NextResponse.json(response.choices[0].message)
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
