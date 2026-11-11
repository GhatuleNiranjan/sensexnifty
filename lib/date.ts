export function formatNewsDate(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();

    const isToday =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();

    const timeString = d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
    });

    if (isToday) {
        return `TODAY · ${timeString} IST`;
    }

    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).toUpperCase();
}

export function formatFullArticleDate(date: Date | string): string {
    const d = new Date(date);
    return (
        d.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).toUpperCase() +
        ` · ${d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Kolkata",
        })} IST`
    );
}