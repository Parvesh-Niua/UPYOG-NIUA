// vite.config.js for web
// Used after "yarn build" has already built all workspace packages into dist/
// Run via: yarn start (which does run-s build start:dev)
// Never run yarn start:dev directly — dist/ must exist first

// Import Vite's defineConfig for type-safe configuration & loadEnv to read environment variables
import { defineConfig, loadEnv } from "vite";
// Import Vite's official React plugin to enable JSX transforms and Fast Refresh
import react from "@vitejs/plugin-react";
// Import Node's path module to handle filesystem paths cross-platform
import path from "path";
// Import Node's fs module to check if files/directories exist on disk
import fs from "fs";
// Import fileURLToPath to convert import.meta.url (URL format) to __filename (string path)
import { fileURLToPath } from "url";

// Convert ES module URL to regular file path string (/path/to/vite.config.js)
const __filename = fileURLToPath(import.meta.url);
// Get directory name from file path (/path/to/)
const __dirname = path.dirname(__filename);

// Wrap config in defineConfig function that accepts a mode parameter (dev/prod/custom)
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files into env object (REACT_APP_* prefixed vars)
  const env = loadEnv(mode, process.cwd(), "");
  // Determine if current build is production mode (used for conditionals throughout config)
  const isProd = mode === "production";

  // Get API proxy target from env var or fallback to default NIUA development server
  const proxyTarget = env.REACT_APP_PROXY_API || "https://niuatt.niua.in";
  // Get assets proxy target from env var or fallback to same proxyTarget for consistency
  const assetsTarget = env.REACT_APP_PROXY_ASSETS || proxyTarget;

  // Define all backend API endpoints that should be proxied to proxyTarget in dev mode
  const apiPaths = [
    // Access control & configuration endpoints
    "/access/v1/actions/mdms", "/egov-mdms-service", "/egov-location",
    // Localization, workflow & basic services
    "/mdms-v2", "/localization", "/egov-workflow-v2", "/pgr-services",
    // File & user management
    "/filestore", "/egov-hrms", "/user-otp", "/user", "/fsm",
    // Billing & collections
    "/billing-service", "/collection-services", "/pdf-service", "/pg-service",
    // Core domain services - vehicle, property, vendor
    "/vehicle", "/vendor", "/property-services", "/fsm-calculator",
    // Calculators & analytics
    "/pt-calculator-v2", "/dashboard-analytics", "/echallan-services",
    // Document, search & survey services
    "/egov-searcher", "/egov-pdf", "/egov-survey-services", "/egov-user-event",
    // Document management & utilities
    "/egov-document-uploader", "/egov-url-shortening", "/inbox", "/tl-services",
    // Trade license, building plan approval & NOC
    "/tl-calculator", "/edcr", "/bpa-services", "/noc-services", "/ws-services",
    // Water supply, sewerage, report generation
    "/sw-services", "/ws-calculator", "/sw-calculator", "/report",
    // Service requests & specialized services
    "/service-request", "/pet-services", "/ewaste-services",
    // Miscellaneous services
    "/chb-services", "/adv-services", "/employee-dashboard",
    // Verification, asset, vendor & transport
    "/verification-service", "/asset-services", "/vendor-management",
    // Transfer permission & AI services
    "/tp-services", "/pgr-ai-services", "/gis-dx-service", "/individual",
    // Calculators & request services
    "/bpa-calculator", "/request-service",
  ];

  // Resolve path to packages root directory (../packages from vite.config.js)
  const packagesRoot = path.resolve(__dirname, "../packages");

  // Function to dynamically generate aliases for all workspace packages for module resolution
  function getAliases() {
    // Initialize empty aliases object to store package name -> entry point mappings
    const aliases = {};

    // Helper function to register a single package alias if it has a valid package.json
    function register(pkgDir) {
      // Construct path to package.json file
      const pkgJsonPath = path.join(pkgDir, "package.json");
      // Exit early if package.json doesn't exist (invalid package)
      if (!fs.existsSync(pkgJsonPath)) return;
      // Parse package.json to extract package name and main entry point
      const { name, main } = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
      // Skip if no package name defined
      if (!name) return;
      // Determine entry point: use "main" field if defined, otherwise default to src/index.js
      const entry = main
        ? path.join(pkgDir, main)
        : path.join(pkgDir, "src", "index.js");
      // Only create alias if entry point exists on disk
      if (fs.existsSync(entry)) aliases[name] = entry;
    }

    // Scan modules/ directory - each subdirectory is a separate workspace package
    const modulesDir = path.join(packagesRoot, "modules");
    // Only process if modules directory exists
    if (fs.existsSync(modulesDir)) {
      // Read all entries in modules directory
      fs.readdirSync(modulesDir).forEach((pkg) => {
        // Get full path to this package
        const pkgDir = path.join(modulesDir, pkg);
        // Only process directories (skip files)
        if (fs.statSync(pkgDir).isDirectory()) register(pkgDir);
      });
    }

    // Register libraries package - single package, not a directory of packages
    register(path.join(packagesRoot, "libraries"));
    // Register react-components package - single package, not a directory of packages
    register(path.join(packagesRoot, "react-components"));

    // Return complete mapping of package names to their entry points
    return aliases;
  }

  // Generate module aliases object by scanning all packages in workspace
  const moduleAliases = getAliases();

  // Initialize proxy configuration object for dev server
  const proxy = {};
  // Loop through each API path and create a proxy rule
  apiPaths.forEach((path) => {
    // Configure each path to proxy to proxyTarget and preserve origin headers
    proxy[path] = { target: proxyTarget, changeOrigin: true };
  });
  // Add special proxy rule for static assets served by backend
  proxy["/pb-egov-assets"] = { target: assetsTarget, changeOrigin: true };

  // Return main Vite configuration object
  return {
    // Plugins array - load React plugin for JSX & Fast Refresh support
    plugins: [
      // Enable JSX transformation and Hot Module Replacement for React files
      react(),
    ],

    // Set project root to current directory (where vite.config.js resides)
    root: __dirname,

    // Set Vite cache directory to node_modules/.vite to avoid conflicts
    cacheDir: path.resolve(__dirname, "../node_modules/.vite"),

    // Set base URL path - production uses /upyog-ui/ subpath, dev uses root
    base: isProd ? "/upyog-ui/" : "/",

    // Define globally available constants - replace process.env with actual values
    define: {
      // Keeps all process.env.REACT_APP_* working without source changes
      // Stringifies env object so React code can access process.env.REACT_APP_* values
      "process.env": JSON.stringify(env),
    },

    // Module resolution configuration
    resolve: {
      // Use pre-computed package aliases to resolve workspace package imports
      alias: moduleAliases,
      // Ensure single instance of React & React-DOM to avoid hooks errors
      // Only one copy of React exists in node_modules despite multiple imports
      dedupe: ["react", "react-dom"],
    },

    // ESBuild configuration for JavaScript transpilation
    esbuild: {
      // Treat all .js files as JSX to enable JSX syntax without .jsx extension
      // This covers both src/ directory and all workspace packages in dist/
      loader: "jsx",
      // Apply JSX loader to all .js files matching this pattern
      include: /.*\.js$/,
      // Never apply JSX loader to node_modules dependencies
      exclude: /node_modules/,
    },

    // Development server configuration
    server: {
      // Run dev server on port 3000
      port: 3000,
      // Use pre-configured proxy rules for API requests
      proxy,
      // File serving permissions for dev server
      fs: {
        // Allow serving files from parent directories (packages, node_modules)
        allow: [".."],
      },
      // File watch configuration for automatic reload
      watch: {
        // Use polling instead of native filesystem events (more reliable in containers/VMs)
        usePolling: true,
        // Check for file changes every 300ms
        interval: 300,
        // Watch workspace packages and local src directory for changes
        include: [
          // Watch all packages in ../packages for live reload
          path.resolve(__dirname, "../packages/**"),
          // Watch application source code for live reload
          path.resolve(__dirname, "src/**"),
        ],
        // Debounce settings to wait for file write to complete before reloading
        awaitWriteFinish: {
          // Wait 100ms after file stops changing before reloading
          stabilityThreshold: 100,
          // Check every 100ms if file is still changing
          pollInterval: 100,
        },
      },
      // Enable Hot Module Replacement for instant updates without full reload
      hmr: true,
    },

    // Production build configuration
    build: {
      // Output directory for built files
      outDir: "build",
      // Disable source maps in production for smaller bundle size
      sourcemap: false,
      // Rollup-specific build options
      rollupOptions: {
        // Output configuration for code splitting
        output: {
          // Manually split vendor libraries into separate chunk for caching
          manualChunks: {
            // Create vendor.js chunk containing core React libraries
            vendor: ["react", "react-dom", "react-router-dom"],
          },
        },
      },
    },

    // Optimization configuration for pre-bundling dependencies
    optimizeDeps: {
      // Pre-bundle these packages for faster initial load
      include: ["react", "react-dom", "react-router-dom", "leaflet-draw"],
      // Exclude workspace packages from pre-bundling (they come from dist/ after yarn build)
      // This prevents Vite from unnecessarily processing our own packages
      exclude: Object.keys(moduleAliases), // 👈 IMPORTANT: prevents double-bundling
      // ESBuild options for pre-bundling dependencies
      esbuildOptions: {
        // Treat .js files as JSX during pre-bundling of node_modules dependencies
        loader: { ".js": "jsx" },
      },
    },
  };
});
