import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { useUpdateProfile, useUpdatePassword } from "@/lib/queries";
import { Loader2, User, Lock, AlertCircle, EyeOff, Eye } from "lucide-react";

export default function Profile() {
  const { user, setUser } = useAuth();

  // General info form state
  const [generalForm, setGeneralForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    username: user?.username || "",
    email: user?.email || "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  // Error states
  const [generalErrors, setGeneralErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Use centralized query hooks with error handling
  const generalMutation = useUpdateProfile({
    onSuccess: (response) => {
      setGeneralErrors({});
      if (response.data.user) {
        setUser(response.data.user);
      }
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setGeneralErrors(error.response.data.errors);
      } else {
        setGeneralErrors({
          general: error.response?.data?.message || "Failed to update profile",
        });
      }
    },
  });

  const passwordMutation = useUpdatePassword({
    onSuccess: () => {
      setPasswordErrors({});
      setPasswordForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setPasswordErrors(error.response.data.errors);
      } else {
        setPasswordErrors({
          general: error.response?.data?.message || "Failed to update password",
        });
      }
    },
  });

  // Handle general form change
  const handleGeneralChange = (e) => {
    const { name } = e.target;
    setGeneralForm((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
    // Clear error for this field
    if (generalErrors[name]) {
      setGeneralErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
    // Clear error for this field
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Submit general form
  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    setGeneralErrors({});
    generalMutation.mutate(generalForm);
  };

  // Submit password form
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordErrors({});
    passwordMutation.mutate(passwordForm);
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <Tabs defaultValue="general" className="w-full">
          <CardHeader className="pb-3">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="general" className="gap-2">
                <User className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="password" className="gap-2">
                <Lock className="h-4 w-4" />
                Password
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="general" className="space-y-4 mt-0">
              <div>
                <CardTitle className="text-lg">General Information</CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </div>

              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                {generalErrors.general && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    <span>{generalErrors.general}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="block mb-2">
                      First Name{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={generalForm.first_name}
                      onChange={handleGeneralChange}
                      placeholder="Enter your first name"
                      minLength={4}
                      maxLength={100}
                      disabled={generalMutation.isPending}
                      className={
                        generalErrors.first_name ? "border-destructive" : ""
                      }
                    />
                    {generalErrors.first_name && (
                      <p className="text-sm text-destructive">
                        {generalErrors.first_name[0]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="block mb-2">
                      Last Name{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={generalForm.last_name}
                      onChange={handleGeneralChange}
                      placeholder="Enter your last name"
                      minLength={4}
                      maxLength={100}
                      disabled={generalMutation.isPending}
                      className={
                        generalErrors.last_name ? "border-destructive" : ""
                      }
                    />
                    {generalErrors.last_name && (
                      <p className="text-sm text-destructive">
                        {generalErrors.last_name[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="block mb-2">
                    Username <sup className="text-destructive">*</sup>
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={generalForm.username}
                    onChange={handleGeneralChange}
                    placeholder="Enter your username"
                    required
                    minLength={4}
                    maxLength={50}
                    disabled={generalMutation.isPending}
                    className={
                      generalErrors.username ? "border-destructive" : ""
                    }
                  />
                  {generalErrors.username && (
                    <p className="text-sm text-destructive">
                      {generalErrors.username[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="block mb-2">
                    Email <sup className="text-destructive">*</sup>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={generalForm.email}
                    onChange={handleGeneralChange}
                    placeholder="Enter your email"
                    required
                    maxLength={100}
                    disabled={generalMutation.isPending}
                    className={generalErrors.email ? "border-destructive" : ""}
                  />
                  {generalErrors.email && (
                    <p className="text-sm text-destructive">
                      {generalErrors.email[0]}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={generalMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {generalMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="password" className="space-y-4 mt-0">
              <div>
                <CardTitle className="text-lg">Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {passwordErrors.general && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    <span>{passwordErrors.general}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="current_password" className="block mb-2">
                    Current Password <sup className="text-destructive">*</sup>
                  </Label>
                  <div className="relative">
                    <Input
                      id="current_password"
                      name="current_password"
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.current_password}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                      minLength={8}
                      maxLength={100}
                      disabled={passwordMutation.isPending}
                      className={
                        passwordErrors.current_password
                          ? "border-destructive"
                          : ""
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={passwordMutation.isPending}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.current_password && (
                    <p className="text-sm text-destructive">
                      {passwordErrors.current_password[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password" className="block mb-2">
                    New Password <sup className="text-destructive">*</sup>
                  </Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                    maxLength={100}
                    disabled={passwordMutation.isPending}
                    className={
                      passwordErrors.new_password ? "border-destructive" : ""
                    }
                  />
                  {passwordErrors.new_password ? (
                    <p className="text-sm text-destructive">
                      {passwordErrors.new_password[0]}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="new_password_confirmation"
                    className="block mb-2"
                  >
                    Confirm New Password{" "}
                    <sup className="text-destructive">*</sup>
                  </Label>
                  <Input
                    id="new_password_confirmation"
                    name="new_password_confirmation"
                    type="password"
                    value={passwordForm.new_password_confirmation}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                    maxLength={100}
                    disabled={passwordMutation.isPending}
                    className={
                      passwordErrors.new_password_confirmation
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {passwordErrors.new_password_confirmation && (
                    <p className="text-sm text-destructive">
                      {passwordErrors.new_password_confirmation[0]}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={passwordMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {passwordMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Password
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
