
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const AuthRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please check your email for verification.",
      });

      // In a real app, you might want to redirect to a confirmation page
      // instead of immediately logging in
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      toast({
        title: "Registration failed",
        description: err.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}

      <div className="space-y-2">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-marketing-blue"
          />
        </div>
      </div>

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
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-marketing-blue"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" required className="rounded border-gray-300 text-marketing-blue focus:ring-marketing-blue" />
          <span>I agree to the <Link to="/terms" className="text-marketing-blue hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-marketing-blue hover:underline">Privacy Policy</Link></span>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-marketing-blue hover:bg-blue-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      <div className="text-center text-sm text-gray-500">
        Already have an account? <Link to="/auth" className="text-marketing-blue hover:underline">Sign in</Link>
      </div>
    </form>
  );
};

export default AuthRegister;
