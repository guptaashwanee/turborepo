import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		react(),
		tailwindcss(),
		mkcert(),
		tsconfigPaths(),
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			"@anscer/ui": resolve(__dirname, "../../packages/ui/src"),
		},
	},
	server: {
		host: true,
	},
});
