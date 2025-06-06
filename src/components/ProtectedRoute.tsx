
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"admin" | "artist" | "customer">;
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuthStore();
  const location = useLocation();

  // If still loading authentication state, show a spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#19747E]"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    toast({
      title: "Authentication Required",
      description: "Please log in to access this page",
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If roles are specified and user's role is not included, redirect to unauthorized
  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    toast({
      title: "Access Denied",
      description: `You need ${allowedRoles.join(" or ")} privileges to access this page`,
      variant: "destructive"
    });
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
