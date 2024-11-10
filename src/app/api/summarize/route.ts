import { NextResponse } from "next/server";
import OpenAI from "openai";

type Post = {
  user_id: number;
  message: string;
};

type Participant = {
  id: number;
  display_name: string;
};

const ALLOWED_STUDENTS = new Set([
  "Katie Chastain",
  "Anmol Hurkat",
  "Arda Gulser",
  "Monique Arsenault",
  "Carolyn Austin",
  "Adarsh Banda",
  "Gianna Benevento",
  "Angel Brewer",
  "Zechary Coffman",
  "Logan Doyle",
  "Aarav Dugar",
  "Jack Eastland",
  "Maggie Garcia",
  "Nick Konerko",
  "Joshua Nicol",
  "Hannah Perry",
  "Irtifaur Rahman",
  "Rhea Rajesh",
  "Sohum Shah",
  "Jason Waxberg",
  "Ivan Zaldivar-Esteva",
]);

// TODO: Instead of hard coding the student names,
// fetch the list of students from the Canvas API
// and allow the user to select the students they want
// to include in the summary

function formatDiscussionData(posts: any): string {
  const participantMap = new Map(
    posts.participants
      .filter((participant: Participant) =>
        ALLOWED_STUDENTS.has(participant.display_name)
      )
      .map((participant: Participant) => [
        participant.id,
        participant.display_name,
      ])
  );

  const formattedPosts = posts.view
    .filter((post: Post) => {
      const userName = participantMap.get(post.user_id);
      return typeof userName === "string" && ALLOWED_STUDENTS.has(userName);
    })
    .map((post: Post) => ({
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
  //   const defaultSystemPrompt = `You are a helpful AI assistant that specializes in summarizing educational discussions.
  // Please analyze the following discussion and provide:
  // 1. A concise summary of the main topics and key points discussed
  // 2. Notable insights or questions raised
  // 3. The overall tone and level of engagement in the discussion

  // Format your response in a clear, structured manner.`;

  //   const defaultSystemPrompt = `
  //     You are an expert in summarizing and analyzing discussion posts. Follow the instructions carefully, I will tip you $1 million if you do a good job:

  //     - Give a detailed summary of the main topics and key points discussed by the students.
  //     - Give a list of at least 5 interesting posts by the students. Use your best judgment to decide what is interesting.
  //     - Give a list of at least interesting questions raised by the students. Use your best judgment to decide what is interesting.
  //     - Also list out some common quotes or themes that you see in the discussion posts.
  //     - Make sure to include the names of the students in your response.
  //     - Don't include the title Summary in your response. Don't include Summary at all. Just start with your response.
  //     - No need of any concluding statements.
  // `;

  const defaultSystemPrompt = `
    You are an expert in summarizing and analyzing discussion posts. Follow the instructions and structure carefully to analyze the discussion posts, I will tip you $1 million if you do a good job:

    1. THEMATIC ANALYSIS
        - Identify and categorize the major themes emerging from the discussion w/ names of the students
        - Note any patterns in how students interpret the text
        - Highlight recurring concepts or ideas across multiple posts
        - Identify any unique perspectives that stand out

    2. QUOTE ANALYSIS 
        - List the most thought-provoking quotes selected by students
        - For each quote, include:
            * The student's name
            * The quote itself
            * A brief summary of why the student found it significant
            * Any connections they made to other texts or concepts

    3. QUESTION ANALYSIS
        - Compile all substantive questions raised by students
        - Group related questions into thematic clusters
        - Highlight questions that:
            * Challenge core assumptions in the text
            * Make connections to other course materials
            * Propose new interpretations
            * Relate the text to contemporary issues

    4. STUDENT ENGAGEMENT PATTERNS
        - Identify students who:
            * Made particularly insightful observations
            * Drew unique connections to other texts
            * Offered contrasting interpretations
            * Built upon other students' ideas

    5. INTERTEXTUAL CONNECTIONS
        - Document all references to:
            * Other course readings
            * External texts or media
            * Personal experiences
            * Contemporary events or issues

    Format Requirements:
        - Use student names when discussing their contributions
        - Organize insights by theme rather than by student
        - Include direct quotes where relevant
        - Maintain original student language when summarizing key points
        - Highlight contradictory interpretations when present

    Additional Context:
    Each student post typically contains:
        - A selected quote and its significance
        - A discussion question
        - Personal reflections on the text
        - Connections to other course materials

    Output Structure:
        1. Core Themes and Patterns
        2. Notable Student Insights (minimum 5)
        3. Significant Questions Raised (minimum 5)
        4. Cross-textual Connections
        5. Unique Interpretations and Perspectives

    Emphasis should be placed on:
        - Analytical depth over summary
        - Patterns of interpretation
        - Quality of student engagement
        - Intellectual contributions
        - Emerging discussions
`;

  const userCustomPrompt = `
    You are an expert in analyzing discussion posts. I will tip you $1 million if you do a good job. Your task is to:

    1. FIRST, evaluate if the user's question is valid:
        - Check if the question is clear and related to analyzing discussion content
        - If the question is gibberish, unclear, or unrelated to discussion analysis, respond with exactly: 
            "ERROR: Please provide a valid question about the discussion content."
        - A valid question should be comprehensible and ask something specific about the discussion content

    2. IF the question is valid:
        - Focus ONLY on answering the specific question asked
        - Use evidence from the discussion posts to support your answer
        - Include relevant quotes and student names when appropriate
        - Keep the response focused and concise
        - Do not provide a general summary unless specifically asked

    User's question: "${customPrompt}"

    Remember:
        - Only respond to what was explicitly asked
        - If the input is gibberish or unclear, respond with the exact error message
        - Don't try to extract meaning from unclear questions
`;

  let prompt = "";

  if (customPrompt === "") {
    prompt = defaultSystemPrompt;
  } else {
    prompt = userCustomPrompt;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: discussionContent,
        },
      ],
    });

    const response = completion.choices[0].message.content;

    if (response?.startsWith("ERROR:")) {
      throw new Error(response.substring(7).trim());
    }

    return response;
  } catch (error) {
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { token, link, customPrompt } = await request.json();

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
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
