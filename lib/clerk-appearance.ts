import { experimental__simple } from "@clerk/themes";
import type { Appearance } from "@clerk/types";

export const clerkAppearance: Appearance = {
  theme: experimental__simple,
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "#7C5CFC",
    colorForeground: "#101828",
    colorMutedForeground: "#6A7282",
    colorBackground: "#FFFFFF",
    colorInput: "#F9FAFB",
    colorInputForeground: "#101828",
    colorNeutral: "#E7EAF3",
    colorPrimaryForeground: "#FFFFFF",
    colorDanger: "#EF4444",
    colorSuccess: "#10B981",
    colorWarning: "#FF8904",
    borderRadius: "1rem",
    fontFamily: "inherit",
  },
  elements: {
    card: "border border-[#E7EAF3] bg-white shadow-none",
    headerTitle: "text-[#101828]",
    headerSubtitle: "text-[#6A7282]",
    formFieldLabel: "text-[#101828]",
    formFieldInput: "bg-[#F9FAFB] text-[#101828] border border-[#E7EAF3]",
    formButtonPrimary: "bg-[#7C5CFC] text-white hover:opacity-90",
    footerActionText: "text-[#6A7282]",
    footerActionLink: "text-[#7C5CFC]",
    dividerText: "text-[#99A1AF]",
    dividerLine: "bg-[#E7EAF3]",
    socialButtonsBlockButton:
      "bg-white text-[#101828] border border-[#E7EAF3] hover:bg-[#F9FAFB]",
    socialButtonsBlockButtonText: "text-[#101828]",
    socialButtonsProviderIcon: "opacity-100",
    identityPreviewText: "text-[#101828]",
    formResendCodeLink: "text-[#7C5CFC]",
  },
  layout: {
    socialButtonsPlacement: "bottom",
    socialButtonsVariant: "blockButton",
  },
};
