"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("ikodio_email");
    if (email) {
      const userData = {
        id: "local-user",
        name: email.split("@")[0],
        email: email,
      };
      setUser(userData);
      setName(userData.name);
    }
  }, []);

  const handleSave = () => {
    // In a real app, you would save to a backend
    if (user) {
      setUser({ ...user, name });
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("dashboard.backToDashboard")}
        </Button>

        {/* Profile Card */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6">
            {t("header.profile")}
          </h1>

          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8">
            <Avatar className="h-24 w-24 border-4 border-purple-500/50">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                {user.name[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Display Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={!isEditing}
                className="bg-[#0A0A0A] border-white/10 text-white disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-[#0A0A0A] border-white/10 text-white opacity-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user.name);
                    }}
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Account Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Account ID</span>
              <span className="text-white font-mono">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">KYC Status</span>
              <span className="text-green-400">Verified </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Account Type</span>
              <span className="text-white">Individual</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
