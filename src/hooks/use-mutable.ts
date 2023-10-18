import { useState } from "react";

const useMutable = <T>(variable: T): T => {
  // "Lazy" initialization to avoid unnecessary function calls
  // Reference: https://legacy.reactjs.org/docs/hooks-reference.html#lazy-initialization
  // Reference: https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
  return useState(() => variable)[0];
};

export default useMutable;
