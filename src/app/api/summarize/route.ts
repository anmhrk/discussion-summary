import { NextResponse } from "next/server";
import { discussionSchema } from "@/lib/schema";
import { ZodError } from "zod";
import OpenAI from "openai";

type Post = {
  user_id: number;
  message: string;
};

type Participant = {
  id: number;
  display_name: string;
};

function formatDiscussionData(posts: any): string {
  const participantMap = new Map(
    posts.participants.map((participant: Participant) => [
      participant.id,
      participant.display_name,
    ])
  );

  const formattedPosts = posts.view.map((post: Post) => ({
    name: participantMap.get(post.user_id) || "Unknown User",
    message: post.message.replace(/<[^>]*>/g, "").trim(),
  }));

  let output = "";

  formattedPosts.forEach((post: any) => {
    output += `name: ${post.name}\n`;
    output += `message: ${post.message}\n\n`;
  });

  return output.trim();
}

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

async function summarize(discussionContent: string, customPrompt?: string) {
  const defaultSystemPrompt = `You are a helpful AI assistant that specializes in summarizing educational discussions. 
Please analyze the following discussion and provide:
1. A concise summary of the main topics and key points discussed
2. Notable insights or questions raised
3. The overall tone and level of engagement in the discussion

Format your response in a clear, structured manner.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        {
          role: "system",
          content: customPrompt || defaultSystemPrompt,
        },
        {
          role: "user",
          content: discussionContent,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Grok API:", error);
    throw new Error("Failed to generate summary");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, link, customPrompt } = discussionSchema.parse(body);

    const urlPattern =
      /https?:\/\/([^\/]+)\/courses\/(\d+)\/discussion_topics\/(\d+)/;
    const match = link.match(urlPattern);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid discussion link format" },
        { status: 400 }
      );
    }
    const [, domain, courseId, discussionId] = match;

    const canvasResponse = await fetch(
      `https://${domain}/api/v1/courses/${courseId}/discussion_topics/${discussionId}/view`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!canvasResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch discussion posts" },
        { status: canvasResponse.status }
      );
    }

    const posts = await canvasResponse.json();
    const formattedData = formatDiscussionData(posts);

    const summary = await summarize(formattedData, customPrompt);

    return NextResponse.json({ summary });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
