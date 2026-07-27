const apiUrl = process.env.API_URL || "http://localhost:3000/api/";
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
