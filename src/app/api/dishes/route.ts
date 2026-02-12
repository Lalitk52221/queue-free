
import { connectToDatabase } from "@/app/lib/mongodb";
import Dish from "@/models/Dish";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isSpecial = searchParams.get("isSpecial");

    // Let mongoose infer type (cleanest solution)
    const query: {
      isAvailable: boolean;
      category?: string;
      isTodaysSpecial?: boolean;
    } = {
      isAvailable: true,
    };

    if (category && category !== "all") {
      query.category = category;
    }

    if (isSpecial === "true") {
      query.isTodaysSpecial = true;
    }

    const dishes = await Dish.find(query).sort({
      category: 1,
      name: 1,
    });

    return NextResponse.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return NextResponse.json(
      { error: "Failed to fetch dishes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const dish = await Dish.create(body);

    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error("Error creating dish:", error);
    return NextResponse.json(
      { error: "Failed to create dish" },
      { status: 500 }
    );
  }
}
