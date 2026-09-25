const apiUrl = process.env.API_URL || "http://localhost:3000/api/";
const url = `isAllowed`;

export const signupAllowed = async () => {
	const response = await fetch(apiUrl + `${url}`, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
