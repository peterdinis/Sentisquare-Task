"use client";

import { FC, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type QueryProviderProps = {
  /** React children elements to be wrapped by the QueryClientProvider */
  children?: ReactNode;
};

/**
 * QueryProvider component wraps the application with **React Query's QueryClientProvider**.
 *
 * This allows all child components to use **React Query hooks** for data fetching, caching, and state management.
 * Includes **React Query Devtools** for debugging queries.
 *
 * @component
 * @param {QueryProviderProps} props - Props containing optional children
 * @returns {JSX.Element} The provider wrapping its children
 *
 * @example
 * <QueryProvider>
 *   <App />
 * </QueryProvider>
 */
const QueryProvider: FC<QueryProviderProps> = ({
  children,
}: QueryProviderProps) => {
  // Initialize a new QueryClient instance
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryProvider;
