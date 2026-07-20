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
// export const priorities = [
//   {
//     label: "Low",
//     value: "low",
//     icon: ArrowDown,
//   },
//   {
//     label: "Medium",
//     value: "medium",
//     icon: ArrowRight,
//   },
//   {
//     label: "High",
//     value: "high",
//     icon: ArrowUp,
//   },
// ]
