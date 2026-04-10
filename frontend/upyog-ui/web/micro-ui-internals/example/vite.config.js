// vite.config.js for micro-ui-internals/example
// Used after "yarn build" has already built all workspace packages into dist/
// Run via: yarn start (which does run-s build start:dev)
// Never run yarn start:dev directly — dist/ must exist first

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const proxyTarget = env.REACT_APP_PROXY_API || "https://niuatt.niua.in";
  const assetsTarget = env.REACT_APP_PROXY_ASSETS || proxyTarget;

  const apiPaths = [
    "/access/v1/actions/mdms", "/egov-mdms-service", "/egov-location",
    "/mdms-v2", "/localization", "/egov-workflow-v2", "/pgr-services",
    "/filestore", "/egov-hrms", "/user-otp", "/user", "/fsm",
    "/billing-service", "/collection-services", "/pdf-service", "/pg-service",
    "/vehicle", "/vendor", "/property-services", "/fsm-calculator",
    "/pt-calculator-v2", "/dashboard-analytics", "/echallan-services",
    "/egov-searcher", "/egov-pdf", "/egov-survey-services", "/egov-user-event",
    "/egov-document-uploader", "/egov-url-shortening", "/inbox", "/tl-services",
    "/tl-calculator", "/edcr", "/bpa-services", "/noc-services", "/ws-services",
    "/sw-services", "/ws-calculator", "/sw-calculator", "/report",
    "/service-request", "/pet-services", "/sv-services", "/ewaste-services",
    "/chb-services", "/adv-services", "/employee-dashboard",
    "/verification-service", "/asset-services", "/vendor-management",
    "/tp-services", "/pgr-ai-services", "/gis-dx-service", "/individual",
    "/bpa-calculator", "/request-service",
  ];

  const proxy = {};
  apiPaths.forEach((path) => {
    proxy[path] = { target: proxyTarget, changeOrigin: true };
  });
  proxy["/pb-egov-assets"] = { target: assetsTarget, changeOrigin: true };

  return {
    plugins: [
      react(),
      // Handles CJS dist files built by microbundle-crl
      commonjs({transformMixedEsModules: true}),
    ],

    base: "/upyog-ui/",

    define: {
      // Keeps all process.env.REACT_APP_* working without source changes
      "process.env": JSON.stringify(env),
    },

    // No mainFields override — use Node standard resolution
    // dist/ exists because yarn build ran before this
    resolve: {
      mainFields: ["main", "module"],
      dedupe: ["react", "react-dom"],
      preserveSymlinks: true

    },

    esbuild: {
      // All .js files treated as JSX — covers both src/ and workspace packages
      loader: "jsx",
      include: /.*\.js$/,
      exclude: /node_modules/,
    },

    server: {
      port: 3000,
      proxy,
    },

    build: {
      outDir: "build",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
          },
        },
      },
    },

    optimizeDeps: {
      include: [
    "react",
    "react-dom",
    "react-router-dom"
  ],
      esbuildOptions: {
        loader: { ".js": "jsx" },
      },
    },
  };
});
