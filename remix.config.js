/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  future: {
    v2_meta: true,
  },
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
};
