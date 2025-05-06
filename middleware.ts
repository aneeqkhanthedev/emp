import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for sign-in page to avoid redirect loop
    if (pathname === '/signin') {
        return NextResponse.next();
    }

    // Check if user is authenticated
    const user = await new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
            resolve(user);
        });
    });

    if (!user) {
        // Redirect to sign-in page if not authenticated
        const url = request.nextUrl.clone();
        url.pathname = '/signin';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};