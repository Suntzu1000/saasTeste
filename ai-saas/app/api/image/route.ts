import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {  checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Não autorizado!", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("API DA OPENAI NÃO CONFIGURADA CORRETAMENTE", {
        status: 500,
      });
    }

    if (!prompt) {
      return new NextResponse("Prompt obrigatório", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Quantidade obrigatório", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolução obrigatório", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "A avaliação gratuita expirou. Atualize para pro...",
        { status: 403 }
      );
    }

    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,

    });

    if (!isPro) {
      await incrementApiLimit();
    }


    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
