import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/dashboard");
      }

      if (event === "USER_UPDATED") {
        toast({
          title: "Email verified",
          description: "You can now sign in with your account.",
        });
      }

      // Handle specific error cases
      if (event === "SIGNED_OUT") {
        setError(null);
      }

      // Handle auth errors
      if (event === "USER_DELETED" || event === "SIGNED_OUT") {
        setError(null);
      }
    });

    // Check URL parameters for error messages
    const params = new URLSearchParams(window.location.search);
    const errorDescription = params.get("error_description");
    if (errorDescription) {
      setError(errorDescription);
      if (errorDescription.includes("Email not confirmed")) {
        setError("Please check your email and click the verification link before signing in.");
      }
    }

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to FreelanceHub</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in or create a new account</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default SignIn;