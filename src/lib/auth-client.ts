"use client"
import { createAuthClient } from "better-auth/react"
import { useEffect, useState, useCallback } from "react"

export const authClient = createAuthClient({
   baseURL: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL,
  fetchOptions: {
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : ""}`,
      },
      onSuccess: (ctx) => {
          const authToken = ctx.response.headers.get("set-auth-token")
          // Store the token securely (e.g., in localStorage)
          if(authToken){
            // Split token at "." and take only the first part
            const tokenPart = authToken.includes('.') ? authToken.split('.')[0] : authToken;
            localStorage.setItem("bearer_token", tokenPart);
          }
      }
  }
});

type SessionData = ReturnType<typeof authClient.useSession>

export function useSession(): SessionData {
   const [session, setSession] = useState<any>(null);
   const [isPending, setIsPending] = useState(true);
   const [isRefetching, setIsRefetching] = useState(false);
   const [error, setError] = useState<any>(null);

   const fetchSession = useCallback(async () => {
      setIsPending(true);
      setError(null);
      try {
         const res = await authClient.getSession({
            fetchOptions: {
               auth: {
                  type: "Bearer",
                  token: typeof window !== 'undefined' ? localStorage.getItem("bearer_token") || "" : "",
               },
            },
         });
         setSession(res.data);
         setError(null);
      } catch (err) {
         setSession(null);
         setError(err);
      } finally {
         setIsPending(false);
      }
   }, []);
   
    useEffect(() => {
    fetchSession()
  }, [fetchSession])

   const refetch = useCallback(async (queryParams?: { query?: unknown }) : Promise<void> => {
      setIsRefetching(true);
      try {
         await fetchSession();
      } finally {
         setIsRefetching(false);
      }
   }, [fetchSession]);
   return { data: session, isPending, isRefetching, error, refetch };

}