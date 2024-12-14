import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { link } = await request.json();
    const urlPattern =
      /https?:\/\/([^\/]+)\/courses\/(\d+)\/discussion_topics\/(\d+)/;
    const match = link.match(urlPattern);
    const [, domain, courseId, discussionId] = match;

    const canvasResponse = await fetch(
      `https://${domain}/api/v1/courses/${courseId}/discussion_topics/${discussionId}/view`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CANVAS_ACCESS_TOKEN}`,
        },
      }
    );

    if (!canvasResponse.ok) {
      return NextResponse.json(
        { message: "Link regex is valid, but failed to fetch student list" },
        { status: canvasResponse.status }
      );
    }

    const participants = await canvasResponse.json();

    return NextResponse.json({
      participants: participants.participants.map(
        (participant: any) => participant.display_name
      ),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
