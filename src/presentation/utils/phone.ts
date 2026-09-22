const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 11;

function extractPhoneDigits(value: string) {
	return value.replace(/\D/g, "").slice(0, MAX_PHONE_DIGITS);
}

function hasValidPhoneLength(value: string) {
	const digits = extractPhoneDigits(value);

	return digits.length >= MIN_PHONE_DIGITS;
}

/**
 * Formata enquanto a pessoa digita: (11) 98765-4321.
 *
 * Roda no `onChange` do campo — o padrão do projeto proíbe `useEffect` para
 * reagir a evento do usuário.
 */
function formatPhone(value: string) {
	const digits = extractPhoneDigits(value);

	if (digits.length === 0) {
		return "";
	}

	const areaCode = digits.slice(0, 2);

	if (digits.length <= 2) {
		return `(${areaCode}`;
	}

	const hasNinthDigit = digits.length > MIN_PHONE_DIGITS;
	const prefixLength = hasNinthDigit ? 5 : 4;
	const prefix = digits.slice(2, 2 + prefixLength);
	const suffix = digits.slice(2 + prefixLength);

	if (suffix.length === 0) {
		return `(${areaCode}) ${prefix}`;
	}

	return `(${areaCode}) ${prefix}-${suffix}`;
}

export {
	extractPhoneDigits,
	formatPhone,
	hasValidPhoneLength,
	MIN_PHONE_DIGITS,
};
