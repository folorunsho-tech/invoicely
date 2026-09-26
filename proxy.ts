import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	// THIS IS NOT SECURE!
	// This is the recommended approach to optimistically redirect users
	// We recommend handling auth checks in each page/route
	if (!session) {
		return NextResponse.redirect(new URL("/auth/signin", request.url));
	}
	if (request.nextUrl.pathname == "/" && session) {
		return NextResponse.redirect(new URL("/app", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/app/:path", "/"], // Specify the routes the middleware applies to
};
