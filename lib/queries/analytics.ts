const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const url = `analytics`;

export const getDashboardData = async () => {
	const response = await fetch(apiUrl + `${url}/dashboard`, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return {
		clients: data?.clients || 0,
		invoices: data?.invoices || 0,
		revenue: data?.revenue || 0,
	};
};
