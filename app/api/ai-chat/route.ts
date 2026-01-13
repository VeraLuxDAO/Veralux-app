import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const BASE_SYSTEM_PROMPT = `
You are VeraLux AI, the on-site assistant for https://veralux.xyz.
- Primary knowledge sources: the live site (founder, PM, developer bios, contacts) and the VeraLux whitepaper at https://veralux.gitbook.io/veralux-docs/.
- You can also answer broader questions on Sui and other blockchains, crypto, politics, economics, culture, healthcare, education, and IT.
- Keep answers concise, helpful, and formatted in Markdown with headings, bullet lists, and code blocks when useful.
- For technical questions, give step-by-step guidance and include concrete commands/examples.
- When using information from the site/whitepaper, keep details accurate; if unsure or not covered, say so instead of guessing.
- Be neutral and transparent on sensitive topics; avoid financial/medical/legal advice, and include cautions when relevant.
`

type IncomingMessage = {
  sender: "user" | "ai"
  content: string
}

function mapMessages(messages: IncomingMessage[]) {
  return messages
    .map((message) => ({
      role: message.sender === "ai" ? "assistant" : "user",
      content: message.content?.toString().slice(0, 8000) ?? "",
    }))
    .filter((message) => message.content.trim().length > 0)
}

export async function POST(req: NextRequest) {
  let body: { messages?: IncomingMessage[]; context?: string }

  try {
    body = await req.json()
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload", details: `${error}` },
      { status: 400 },
    )
  }

  const { messages = [], context } = body

  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: "messages must be an array" },
      { status: 400 },
    )
  }

  const chatHistory = mapMessages(messages)
  const systemMessages = [
    { role: "system" as const, content: BASE_SYSTEM_PROMPT.trim() },
    {
      role: "system" as const,
      content:
        context?.slice(0, 12000) ??
        "Use the live site (https://veralux.xyz) and whitepaper (https://veralux.gitbook.io/veralux-docs/) as reference. If a detail is unknown or not present, acknowledge the gap instead of inventing information.",
    },
  ]

  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 },
      )
    }

    const openai = new OpenAI({ apiKey })

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.35,
      stream: true,
      messages: [...systemMessages, ...chatHistory],
    })

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta?.content
            if (delta) {
              controller.enqueue(encoder.encode(delta))
            }
          }
        } catch (error) {
          controller.error(error)
        } finally {
          controller.close()
        }
      },
      cancel() {
        // Abort the upstream request if the client disconnects
        // @ts-expect-error controller is available on the OpenAI stream
        completion.controller?.abort?.()
      },
    })

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[AI_CHAT_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 },
    )
  }
}
