import connectMongo from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectMongo();
    // جلب آخر 10 سجلات مرتبة من الأحدث للأقدم
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(10);
    
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}