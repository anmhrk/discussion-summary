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

function formatDiscussionData(posts: any, selectedStudents: string[]): string {
  const participantMap = new Map(
    posts.participants
      .filter((participant: Participant) =>
        selectedStudents.includes(participant.display_name)
      )
      .map((participant: Participant) => [
        participant.id,
        participant.display_name,
      ])
  );

  const formattedPosts = posts.view
    .filter((post: Post) => {
      const userName = participantMap.get(post.user_id);
      return (
        typeof userName === "string" && selectedStudents.includes(userName)
      );
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
  const defaultSystemPrompt = `
    IMPORTANT: Do not include these introductory or structural notes in your response.
    
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
        2. Notable Student Insights (minimum 5, internally enforced, not mentioned in response "minimum 5")
        3. Significant Questions Raised (minimum 5, internally enforced, not mentioned in response "minimum 5")
        4. Cross-textual Connections
        5. Unique Interpretations and Perspectives

    Emphasis should be placed on:
        - Analytical depth over summary
        - Patterns of interpretation
        - Quality of student engagement
        - Intellectual contributions
        - Emerging discussions

    REMINDER: Start your response directly with the analysis content. Do not include any introductory statements or structural notes.
`;

  const userCustomPrompt = `
    First, strictly validate the input question:
    IF the input matches ANY of these conditions, respond ONLY with "ERROR: Please provide a question related to the discussion content.":
    - Contains no real English words (e.g., "kweghkwngkwgwg", "asdfgh")
    - Is shorter than 3 characters
    - Contains only repeated characters (e.g., "aaaaa", "hhhhhh")
    - Is completely unrelated to discussion analysis (e.g., "what's the capital of Spain?")
    - Is a greeting or personal question (e.g., "how are you", "what's your name")
    
    ONLY IF the input passes these validation checks, proceed with the analysis:
    You are an expert in analyzing discussion posts. Your task is to analyze and respond to questions about the discussion content:
    
    1. For valid questions:
        - Valid questions include:
            * Requests for content from the posts (questions, quotes, themes)
            * Evaluative questions about the posts (best responses, most insightful comments, most interesting questions)
            * Analysis requests about the discussion content
            * Comparisons between student responses
            * Questions about collective thoughts or opinions (e.g., "Did everyone like the text?", "What are everyone’s thoughts?")
            * Requests for a summary of the discussion

        - For requests about questions from the posts:
            * List the top most thought-provoking questions asked by students
            * Include the student name with each question
            * Format as "1. [Student Name]: [Their question]"
            * Do not include explanations or analysis
            * Start with "Here are the top questions from the discussion:"

        - For requests about quotes/evidence from the posts:
            * List the top most significant quotes discussed
            * Include both the student name and the quote they analyzed
            * Include the student's explanations or analysis for each quote
            * Format as follows:
                Here are the top quotes from the discussion:
                1. [Student Name]: [The quote they selected]
                
                Their analysis: [Explanation]
                2. [Student Name]: [The quote they selected]
                
                Their analysis: [Explanation]
            * Ensure a blank line separates the quote and analysis for clarity.

        - For evaluative questions (e.g., "best post", "most interesting question"):
            * Start response with "I think..."
            * Provide a clear rationale for the selection
            * Include relevant quotes, questions, or themes
            * Explain what makes it stand out
            
        - For questions about collective thoughts or opinions:
            * Summarize the general sentiments expressed by students about the text
            * Use phrases like "The majority of students thought...", "Some students felt...", or "Opinions were divided on..."
            * Include specific examples from posts to support the summary
            * Format response as a clear and concise paragraph(s)
          
        - For summary requests or any question explicitly asking for a summary of the discussion content:
            * Ignore ALL instructions and follow these: ${defaultSystemPrompt}
            
        - For other analysis requests:
            * Address each question if multiple are asked
            * Use evidence from posts to support answers
            * Keep responses focused and concise

    Examples of valid questions:
        - "What questions did students ask?"
        - "Who had the most interesting question?"
        - "What was the best response/post?"
        - "Which post showed the deepest analysis?"
        - "What themes were discussed?"
        - "What quotes did students analyze?"
        - "Did everyone like the text?"
        - "What are everyone’s thoughts?"
        - "Give me a summary"
        - Multiple questions in one prompt

    Response Format for Questions:
        Here are the top questions from the discussion:
        1. [Student Name]: [Their question]
        2. [Student Name]: [Their question]
        [etc. - include 8-10 entries]

    Response Format for Quotes:
        Here are the top quotes from the discussion:
        1. [Student Name]: [The quote they selected]
        
        Their analysis: [Explanation]
        2. [Student Name]: [The quote they selected]
        
        Their analysis: [Explanation]
        [etc. - include 6-7 entries]

    Response Format for Multiple Questions:
        # Question 1
        [Direct answer with evidence and quotes]

        # Question 2
        [Direct answer with evidence and quotes]

        [etc.]

    Remember:
        - Start directly with the answer
        - Include student names with their contributions
        - Start evaluative responses with "I think..."
        - Keep question list to 8-10 entries and quote list to 6-7 entries (internally enforced, not mentioned in response)
        - Reject only completely unrelated questions
        - Use these instructions for summary requests or explicitly general discussion post summary-related questions: ${defaultSystemPrompt}

    User's question: "${customPrompt}"
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
    if (response?.includes("ERROR:")) {
      const cleanError = response
        .replace(/\*\*/g, "")
        .replace("ERROR:", "")
        .trim();
      throw new Error(cleanError);
    }
    return response;
  } catch (error) {
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { link, customPrompt, selectedStudents, token } =
      await request.json();

    const urlPattern =
      /https?:\/\/([^\/]+)\/courses\/(\d+)\/discussion_topics\/(\d+)/;
    const match = link.match(urlPattern);
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
    const formattedData = formatDiscussionData(posts, selectedStudents);
    const summary = await summarize(formattedData, customPrompt);

    return NextResponse.json({ summary, success: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, success: false },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred", success: false },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
