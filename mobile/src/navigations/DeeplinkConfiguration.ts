import NavigationService from "utils/NavigationService";

export const DeeplinkConfiguration = (link: string, token?: string) => {
  if (link?.includes("reset-password")) {
    const parts = link.split("/");
    NavigationService.navigate("ResetPasswordScreen", {
      token: parts[parts.length - 1] || "",
    });
  }

  if (link?.includes("/mobile/forum")) {
    const parts = link.split("/");
    NavigationService.navigate("ForumDetailScreen", {
      id: parts[parts.length - 1] || "",
    });
  }
};
