// hooks/useNotifications.js
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/lib/queries/notifications";
import { Notification } from "@/generated/prisma/client";
export function useNotifications() {
	const res = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			return await getNotifications();
		},
		refetchInterval: 30000,
	});
	const [notifications, setNotifications] = useState<Notification[]>([]);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setNotifications(res.data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
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
