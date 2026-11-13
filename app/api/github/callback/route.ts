import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getServerSession } from "@/features/auth/actions";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { saveInstallation } from "@/features/github/server/installation";

function buildSignInCallbackUrl(installationId?: string | null): string {
    if (installationId) {
        return `/api/github/callback?installation_id=${encodeURIComponent(installationId)}`;
    }
    return "/api/github/callback";
}

function parseInstallationId(raw: string | null): number | null {
    if (!raw) {
        return null;
    }
    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}

function getRequestOrigin(request: Request): string {
    const forwardedHost = request.headers
        .get("x-forwarded-host")
        ?.split(",")[0]
        ?.trim();
    const forwardedProto = request.headers
        .get("x-forwarded-proto")
        ?.split(",")[0]
        ?.trim();

    if (forwardedHost) {
        const proto = forwardedProto ?? "https";
        return `${proto}://${forwardedHost}`;
    }

    const host = request.headers.get("host");
    if (host) {
        const isLocalhost =
            host.startsWith("localhost") ||
            host.startsWith("127.0.0.1") ||
            host.startsWith("[::1]");
        const proto = isLocalhost ? "http" : (forwardedProto ?? "https");
        return `${proto}://${host}`;
    }

    return new URL(request.url).origin;
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const origin = getRequestOrigin(request);
    const { searchParams } = requestUrl;

    const rawInstallationId = searchParams.get("installation_id");
    const session = await getServerSession();

    if (!session) {
        const callbackUrl = buildSignInCallbackUrl(rawInstallationId);
        const signInUrl = new URL(
            `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`,
            origin
        );
        return NextResponse.redirect(signInUrl);
    }

    const installationId = parseInstallationId(rawInstallationId);

    if (installationId) {
        try {
            await saveInstallation(session.user.id, installationId);
            revalidatePath(DASHBOARD_ROUTES.github);
        } catch (error) {
            console.error("[github/callback] Failed to save installation:", error);
            const errorUrl = new URL(
                `${DASHBOARD_ROUTES.github}?error=installation_failed`,
                origin
            );
            return NextResponse.redirect(errorUrl);
        }
    }

    return NextResponse.redirect(new URL(DASHBOARD_ROUTES.github, origin));
}

