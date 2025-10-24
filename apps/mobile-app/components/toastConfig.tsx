import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { BaseToastProps } from "react-native-toast-message";
import { CheckCircle, XCircle, Info, Trash2 } from "lucide-react-native";

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const BaseToast = ({
  icon,
  borderColor,
  bgColor,
  titleColor,
  descColor,
  text1,
  text2,
}: {
  icon: React.ReactNode;
  borderColor: string;
  bgColor: string;
  titleColor: string;
  descColor: string;
  text1?: string;
  text2?: string;
}) => (
  <View
    className="flex-row items-start w-[90%] rounded-xl px-4 py-3 mt-1"
    style={{ borderColor, backgroundColor: bgColor, borderWidth: 1 }}
  >
    <View className="mr-3 mt-0.5">{icon}</View>

    <View className="flex-1">
      {text1 && (
        <Text className="font-semibold text-sm" style={{ color: titleColor }}>
          {text1}
        </Text>
      )}
      {text2 && (
        <Text className="text-xs mt-0.5" style={{ color: descColor }}>
          {text2}
        </Text>
      )}
    </View>
  </View>
);

const toastConfig = {
  success: ({ text1, text2 }: CustomToastProps) => (
    <BaseToast
      icon={<CheckCircle size={20} color="#12B76A" />}
      borderColor="#ABEFC6"
      bgColor="#ECFDF3"
      titleColor="#067647"
      descColor="#16A34A"
      text1={text1}
      text2={text2}
    />
  ),

  error: ({ text1, text2 }: CustomToastProps) => (
    <BaseToast
      icon={<XCircle size={20} color="#D92D20" />}
      borderColor="#FEE4E2"
      bgColor="#FEF3F2"
      titleColor="#D92D20"
      descColor="#EF4444"
      text1={text1}
      text2={text2}
    />
  ),

  delete: ({ text1, text2 }: CustomToastProps) => (
    <BaseToast
      icon={<Trash2 size={20} color="#B42318" />}
      borderColor="#FEE4E2"
      bgColor="#FEF3F2"
      titleColor="#B42318"
      descColor="#DC2626"
      text1={text1}
      text2={text2}
    />
  ),

  info: ({ text1, text2 }: CustomToastProps) => (
    <BaseToast
      icon={<Info size={20} color="#2563EB" />}
      borderColor="#BFDBFE"
      bgColor="#EFF6FF"
      titleColor="#1D4ED8"
      descColor="#3B82F6"
      text1={text1}
      text2={text2}
    />
  ),
};

export default toastConfig;
