"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "~/app/theme-provider";
import { authClient } from "~/server/better-auth/client";

export function DashboardHeader() {
	const router = useRouter();
	const { theme, toggleTheme } = useTheme();

	async function handleLogout() {
		await authClient.signOut();
		router.push("/login");
		router.refresh();
	}

	return (
		<header className="border-gray-200 border-b bg-white dark:border-gray-800 dark:bg-gray-900">
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
				<h1 className="font-semibold text-lg">Employee Management</h1>

				<div className="flex items-center gap-3">
					<button
						aria-label="Toggle dark mode"
						className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 text-sm hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
						onClick={toggleTheme}
						type="button"
					>
						{theme === "light" ? "🌙 Dark" : "☀️ Light"}
					</button>

					<button
						className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
						onClick={handleLogout}
						type="button"
					>
						Logout
					</button>
				</div>
			</div>
		</header>
	);
}
