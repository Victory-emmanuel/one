
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import AuthLogin from "@/components/auth/AuthLogin";
import AuthRegister from "@/components/auth/AuthRegister";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const location = useLocation();

  useEffect(() => {
    // Check if there's a tab parameter in the URL
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");

    if (tabParam === "register") {
      setActiveTab("register");
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-marketing-white via-marketing-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold dark:text-white">Welcome to Marketing Lot</CardTitle>
            <CardDescription className="dark:text-gray-300">Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <AuthLogin />
              </TabsContent>
              <TabsContent value="register">
                <AuthRegister />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link to="/" className="text-marketing-blue hover:underline">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
