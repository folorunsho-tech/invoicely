// hooks/useNotifications.js
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/lib/queries/notifications";
export function useNotifications() {
	const res = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			return await getNotifications();
		},
	});
	const [notifications, setNotifications] = useState<
		{
			type: string;
			id: string;
			for: string;
			title: string;
			description: string;
			timestamp: string;
			organizationId: string;
			link: string | null;
			status: string;
		}[]
	>([]);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setNotifications(res.data);
	}, [res.isLoading]);
	useEffect(() => {
		const es = new EventSource("/api/notifications/stream");

		es.onmessage = (e) => {
			const notification = JSON.parse(e.data);
			setNotifications((prev) => [notification, ...prev]);
		};

		es.onerror = () => {
			// Browser auto-reconnects on error — no extra logic needed
			console.warn("SSE connection lost, reconnecting...");
		};

		return () => es.close();
	}, []);
	function markOneRead(id: string) {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, status: "read" } : n)),
		);
	}
	function deleteOne(id: string) {
		setNotifications((prev) => prev.filter((not) => not.id !== id));
	}
	function markAllRead() {
		setNotifications([]);
	}
	return { notifications, markAllRead, markOneRead, deleteOne };
}
