import { CONFIG } from "@/constants/config";

export const getImage = (imageName: string) => {
  return `${CONFIG.BASE_URL_MEDIA}/${imageName}`;
};
