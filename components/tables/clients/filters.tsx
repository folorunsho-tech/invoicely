// import {
// 	ArrowDown,
// 	ArrowRight,
// 	ArrowUp,
// 	CheckCircle,
// 	Circle,
// 	CircleOff,
// 	HelpCircle,
// 	Icon,
// 	Timer,
// } from "lucide-react";
import countrystate from "@/lib/country_state";

export const countries = countrystate.map((country) => ({
	value: country.name,
	label: country.name,
}));
