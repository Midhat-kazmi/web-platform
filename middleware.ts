import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, verifyMentorToken, verifyAmbassadorToken } from '@/lib/jwt';

const discoveryLinkHeader = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</openapi.json>; rel="service-desc"; type="application/openapi+json"',
  '</api-docs>; rel="service-doc"; type="text/html"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
  '</llms.txt>; rel="alternate"; type="text/plain"',
].join(', ');

function withDiscoveryHeaders(response: NextResponse): NextResponse {
  response.headers.set('Link', discoveryLinkHeader);
  return response;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const acceptHeader = request.headers.get('accept')?.toLowerCase() ?? '';

  const wantsMarkdown = acceptHeader.includes('text/markdown');
  const isStaticFileRequest = /\.[a-z0-9]+$/i.test(path);
  const excludedMarkdownPaths = new Set([
    '/agent-markdown',
    '/robots.txt',
    '/sitemap.xml',
    '/llms.txt',
    '/llms-full.txt',
  ]);
  const isPrivateOrApiPath =
    path.startsWith('/api') ||
    path.startsWith('/admin') ||
    path.startsWith('/mentor') ||
    path.startsWith('/ambassador') ||
    path.startsWith('/.well-known');

  if (
    wantsMarkdown &&
    !isStaticFileRequest &&
    !excludedMarkdownPaths.has(path) &&
    !isPrivateOrApiPath
  ) {
    const markdownUrl = new URL('/agent-markdown', request.url);
    markdownUrl.searchParams.set('source', path);
    return NextResponse.rewrite(markdownUrl);
  }

  // Redirect root to our-story page
  if (path === '/') {
    return withDiscoveryHeaders(
      NextResponse.redirect(new URL('/our-story', request.url)),
    );
  }

  const token = request.cookies.get('admin-token')?.value;
  const adminCodeVerified = request.cookies.get('admin-code-verified')?.value;
  const mentorToken = request.cookies.get('mentor-token')?.value;
  const mentorAccessVerified = request.cookies.get('mentor-access-verified')?.value;
  const ambassadorToken = request.cookies.get('ambassador-token')?.value;
  const ambassadorAccessVerified = request.cookies.get('ambassador-access-verified')?.value;

  // Allow access to admin code verification page
  if (path === '/admin') {
    if (token) {
      const isValid = await verifyToken(token);
      if (isValid) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect login page - only accessible after code verification
  if (path === '/admin/login') {
    if (!adminCodeVerified) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (token) {
      const isValid = await verifyToken(token);
      if (isValid) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect all other admin routes
  if (path.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    const isValid = await verifyToken(token);
    if (!isValid) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Mentor authentication routes
  // Allow access to mentor access code page
  if (path === '/mentor') {
    if (mentorToken) {
      const isValid = await verifyMentorToken(mentorToken);
      if (isValid) {
        return NextResponse.redirect(new URL('/mentor/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Mentor login page - only accessible after access code verification
  if (path === '/mentor/login') {
    if (!mentorAccessVerified) {
      return NextResponse.redirect(new URL('/mentor', request.url));
    }
    if (mentorToken) {
      const isValid = await verifyMentorToken(mentorToken);
      if (isValid) {
        return NextResponse.redirect(new URL('/mentor/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect all other mentor routes
  if (path.startsWith('/mentor/') && path !== '/mentor/login') {
    if (!mentorToken) {
      return NextResponse.redirect(new URL('/mentor', request.url));
    }

    const isValid = await verifyMentorToken(mentorToken);
    if (!isValid) {
      return NextResponse.redirect(new URL('/mentor', request.url));
    }
    return NextResponse.next();
  }

  // Ambassador authentication routes
  // Allow access to ambassador access code page
  if (path === '/ambassador') {
    if (ambassadorToken) {
      const isValid = await verifyAmbassadorToken(ambassadorToken);
      if (isValid) {
        return NextResponse.redirect(new URL('/ambassador/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Ambassador login page - only accessible after access code verification
  if (path === '/ambassador/login') {
    if (!ambassadorAccessVerified) {
      return NextResponse.redirect(new URL('/ambassador', request.url));
    }
    if (ambassadorToken) {
      const isValid = await verifyAmbassadorToken(ambassadorToken);
      if (isValid) {
        return NextResponse.redirect(new URL('/ambassador/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect all other ambassador routes
  if (path.startsWith('/ambassador/') && path !== '/ambassador/login') {
    if (!ambassadorToken) {
      return NextResponse.redirect(new URL('/ambassador', request.url));
    }
    const isValid = await verifyAmbassadorToken(ambassadorToken);
    if (!isValid) {
      return NextResponse.redirect(new URL('/ambassador', request.url));
    }
    return NextResponse.next();
  }

  if (path === '/our-story') {
    return withDiscoveryHeaders(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|favicons|images|.*\\..*).*)',
  ]
}; 