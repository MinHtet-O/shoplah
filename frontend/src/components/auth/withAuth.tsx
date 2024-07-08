// File: components/withAuth.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { initializeAuth } from "@/store/authSlice";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const WithAuthComponent = (props: any) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, initializing } = useSelector(
      (state: RootState) => state.auth
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      dispatch(initializeAuth());
    }, [dispatch]);

    useEffect(() => {
      if (!initializing) {
        setIsLoading(false);
        if (!isAuthenticated) {
          router.push("/"); // Redirect to landing page if not authenticated
        }
      }
    }, [initializing, isAuthenticated, router]);

    if (isLoading || initializing) {
      return <div></div>; // Show a loading message while initializing
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
