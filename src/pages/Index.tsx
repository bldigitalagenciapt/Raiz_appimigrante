import { Navigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

const Index = () => {
  const { hasCompletedOnboarding } = useApp();
  
  return hasCompletedOnboarding 
    ? <Navigate to="/home" replace /> 
    : <Navigate to="/onboarding/welcome" replace />;
};

export default Index;
