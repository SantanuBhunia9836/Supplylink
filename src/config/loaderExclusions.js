// Paths where the global route transition loader should NOT be shown.
//
// How to use:
// - Add a string to exclude an exact path: "/login"
// - Add a string that ends with "/" to exclude that prefix: "/product/" excludes all product detail pages
// - Add a RegExp for advanced patterns: new RegExp('^/seller/.+/edit$')

export const loaderExclusions = [
  // Examples:
  "/product/", // exclude all product detail pages
  "/dashboard/Dashboard",
];

export function shouldExcludePath(pathname) {
  if (!pathname) return false;
  for (const rule of loaderExclusions) {
    if (typeof rule === 'string') {
      // If the rule ends with '/', treat it as a prefix match
      if (rule.endsWith('/')) {
        if (pathname.startsWith(rule)) return true;
      } else {
        if (pathname === rule) return true;
      }
    } else if (rule instanceof RegExp) {
      if (rule.test(pathname)) return true;
    }
  }
  return false;
}


