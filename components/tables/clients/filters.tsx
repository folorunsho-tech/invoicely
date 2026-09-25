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
import { states as cStates } from "@/lib/country_state";

export const states = cStates.map((state) => ({
	value: state.name,
	label: state.name,
}));
