export const calculatePercentage = (part: number, whole: string | number) => {
    const total = Number(whole);
    if (!total || total === 0) return 0;

    return Math.round((part / total) * 100);
};
