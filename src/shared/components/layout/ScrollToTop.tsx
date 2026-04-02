import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Infrastructure component to handle window scrolling on route changes.
 * This is a "boring" standard pattern that abstracts the browser side-effect
 * away from the business components.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
