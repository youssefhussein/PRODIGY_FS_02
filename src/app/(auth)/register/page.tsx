"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "~/server/better-auth/client";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		const { error: err } = await authClient.signUp.email({
			name,
			email,
			password,
		});

		if (err) {
			setError(err.message ?? "Something went wrong");
			setLoading(false);
			return;
		}

		router.push("/dashboard");
		router.refresh();
	}

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
			<h1 className="mb-6 font-semibold text-gray-900 text-xl dark:text-gray-100">
				Create account
			</h1>

			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label
						className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
						htmlFor="name"
					>
						Name
					</label>
					<input
						className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
						id="name"
						onChange={(e) => setName(e.target.value)}
						placeholder="John Doe"
						required
						type="text"
						value={name}
					/>
				</div>

				<div>
					<label
						className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
						htmlFor="email"
					>
						Email
					</label>
					<input
						className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
						required
						type="email"
						value={email}
					/>
				</div>

				<div>
					<label
						className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
						htmlFor="password"
					>
						Password
					</label>
					<input
						className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
						placeholder="At least 8 characters"
						required
						type="password"
						value={password}
					/>
				</div>

				{error && <p className="text-red-600 text-sm">{error}</p>}

				<button
					className="w-full rounded-md bg-blue-600 px-3 py-2 font-medium text-sm text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={loading}
					type="submit"
				>
					{loading ? "Creating account..." : "Create account"}
				</button>
			</form>

			<p className="mt-4 text-center text-gray-600 text-sm dark:text-gray-400">
				Already have an account?{" "}
				<Link className="text-blue-600 hover:underline" href="/login">
					Sign in
				</Link>
			</p>
		</div>
	);
}
