import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    // Validates token by seeing if user exists through Canvas API
    const canvasResponse = await fetch(
      "https://canvas.asu.edu/api/v1/users/self",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!canvasResponse.ok) {
      if (canvasResponse.status === 401) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "Failed to validate token" },
        { status: canvasResponse.status }
      );
    }

    const userData = await canvasResponse.json();

    return NextResponse.json({
      userData: { name: userData.name, userId: userData.id },
    });
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
