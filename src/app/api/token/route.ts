import { NextResponse } from "next/server";
import { tokenSchema } from "@/lib/schema";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = tokenSchema.parse(body);

    // Validates token by seeing if user exists through Canvas API
    const canvasResponse = await fetch(
      "https://canvas.instructure.com/api/v1/users/self",
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
      message: "Token validated successfully",
    });
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
