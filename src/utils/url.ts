const BASE = import.meta.env.BASE_URL;

export const getRoomIdFromPath = (): string | null => {
    const pathname = window.location.pathname;
    const relative = pathname.startsWith(BASE)
        ? pathname.slice(BASE.length)
        : pathname.replace(/^\/+/, '');
    const match = relative.match(/^room\/([A-Za-z0-9]+)$/);
    return match ? match[1].toUpperCase() : null;
};

export const roomUrl = (sessionId: string): string =>
    `${window.location.origin}${BASE}room/${sessionId}`;

export const homeUrl = (): string =>
    `${window.location.origin}${BASE}`;
