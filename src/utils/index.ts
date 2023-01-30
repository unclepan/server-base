export function getID(length: number) {
	return Number(
		Math.random().toString().substring(3, length) + Date.now()
	).toString(36);
}
