import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "welcome": "Future of Shopping",
      "products": "Products",
      "cart": "Cart",
      "login": "Login",
      "explore": "Explore Products",
      "searchPlaceholder": "Search for Products, Brands and More",
      "becomeSeller": "Become a Seller",
      "customerCare": "24x7 Customer Care"
    }
  },
  np: {
    translation: {
      "welcome": "किनमेलको भविष्य",
      "products": "उत्पादनहरु",
      "cart": "कार्ट",
      "login": "लगइन",
      "explore": "उत्पादन हेर्नुहोस्",
      "searchPlaceholder": "उत्पादनहरू, ब्रान्डहरू र थप खोज्नुहोस्",
      "becomeSeller": "विक्रेता बन्नुहोस्",
      "customerCare": "२४x७ ग्राहक सेवा"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("neoLanguage") || "en", // Remembers choice across reboots
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;