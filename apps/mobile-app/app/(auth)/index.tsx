import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/store/useAuthStore";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, error, user } = useAuthStore();

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await signIn(data.email, data.password);
  };

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error,
      });
    }

    if (user) {
      Toast.show({
        type: "success",
        text1: `Welcome ${user.email}`,
        text2: "Successfully log in!",
      });
      router.replace("/(tabs)");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, user]);

  return (
    <View className="bg-BGlight dark:bg-BGdark flex-1 justify-center items-center px-5">
      <View className="w-full bg-BGlight dark:bg-BGdark rounded-3xl shadow-md max-w-sm">
        {/* Header */}
        <View className="mb-4 grid flex-row text-wrap overflow-hidden gap-2 items-center">
          <Image
            source={require("../../assets/images/icon.png")}
            style={{ width: 60, height: 60 }}
          />

          <View className="text-pretty">
            <Text
              variant="h1"
              className="text-left text-TEXTdark dark:text-TEXTlight"
            >
              S8CVote
            </Text>
            <Text
              variant="p"
              className="text-gray-700 dark:text-gray-300 leading-none"
            >
              Sign in as Admin to start room to room
            </Text>
          </View>
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Label className="mb-1 text-TEXTdark dark:text-TEXTlight">
            Email
          </Label>
          <View className="flex-row items-center border rounded-lg px-3 py-2 border-gray-300 dark:border-neutral-700">
            <Mail size={18} color="#888" />
            {/* ✅ Controlled input for react-hook-form */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  className="flex-1 ml-2 text-TEXTdark dark:text-TEXTlight border-0"
                  placeholder="Email"
                  placeholderTextColor="#888"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
          {errors.email && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <Label className="mb-1 text-TEXTdark dark:text-TEXTlight">
            Password
          </Label>
          <View className="flex-row items-center border rounded-lg px-3 py-2 border-gray-300 dark:border-neutral-700">
            <Lock size={18} color="#888" />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  className="flex-1 ml-2 text-TEXTdark dark:text-TEXTlight border-0"
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="ml-2"
            >
              {showPassword ? (
                <Eye size={18} color="#888" />
              ) : (
                <EyeOff size={18} color="#888" />
              )}
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </Text>
          )}
        </View>

        {/* Sign In Button */}
        <Button
          onPress={handleSubmit(onSubmit)}
          className="w-full py-3 rounded-lg bg-PRIMARY900 dark:bg-PRIMARY50"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-TEXTlight dark:text-TEXTdark">Sign in</Text>
          )}
        </Button>
      </View>
    </View>
  );
}
