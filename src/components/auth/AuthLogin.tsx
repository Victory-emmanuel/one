
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const AuthLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      toast({
        title: "Login failed",
        description: err.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}

      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-marketing-blue"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-marketing-blue"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <div className="text-right">
          <a href="#" className="text-sm text-marketing-blue hover:underline">
            Forgot password?
          </a>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-marketing-blue hover:bg-blue-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center text-sm text-gray-500">
        Don't have an account? <Link to="/auth?tab=register" className="text-marketing-blue hover:underline">Sign up</Link>
      </div>

      {/* Admin access link - only visible to specific admin */}
      {email === 'marketinglot.blog@gmail.com' && (
        <div className="mt-4 text-center text-xs">
          <Link to="/admin-login" className="text-gray-400 hover:text-marketing-blue hover:underline flex items-center justify-center">
            <span className="inline-block w-1 h-1 rounded-full bg-gray-400 mr-1"></span>
            Admin Access
          </Link>
        </div>
      )}
    </form>
  );
};

export default AuthLogin;
