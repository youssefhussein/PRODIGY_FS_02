import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { ThemeProvider } from "~/app/theme-provider";

export const metadata: Metadata = {
	title: "Employee management system",
	description: "CRUD operations on your employees",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

const themeScript = `
(function() {
  var t = localStorage.getItem("theme");
  if (t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches))
    document.documentElement.classList.add("dark");
  else
    document.documentElement.classList.remove("dark");
})()
`;

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={`${geist.variable}`} lang="en" suppressHydrationWarning>
			<body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
