export function formatPrice(price: number | string): string {
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    // Check if it's a valid number
    if (isNaN(numPrice) || numPrice <= 0) {
        return 'Free';
    }

    // Remove decimal part if it's .00
    const formattedNumber =
        numPrice % 1 === 0
            ? numPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
              })
            : numPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              });

    return `₱${formattedNumber}`;
}
