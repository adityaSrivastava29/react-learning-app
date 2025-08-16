import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
const resources = {
  en: {
    translation: {
      // Settings Page
      "settings.title": "Settings - Redux Toolkit",
      "settings.userSettings": "User Settings",
      "settings.profileInfo": "Profile Information",
      "settings.username": "Username",
      "settings.email": "Email",
      "settings.userId": "User ID",
      "settings.preferences": "Preferences",
      "settings.emailNotifications": "Email Notifications",
      "settings.language": "Language",
      "settings.clearSettings": "Clear Settings",
      "settings.updating": "Updating...",
      "settings.loading": "Loading settings...",
      "settings.noSettings": "No settings loaded",
      "settings.loadSettings": "Load Settings",
      "settings.error": "Error",

      // Redux DevTools Section
      "settings.reduxDevTools": "Redux DevTools",
      "settings.reduxDescription":
        "Open Redux DevTools to see the state changes in real-time:",
      "settings.reduxFeature1":
        "Actions are dispatched when you interact with settings",
      "settings.reduxFeature2":
        "Async thunks show pending/fulfilled/rejected states",
      "settings.reduxFeature3": "Time-travel debugging lets you replay actions",
      "settings.reduxFeature4": "State diff shows exactly what changed",

      // Learning Notes
      "learning.settingsTitle": "Settings Module - Redux Toolkit Deep Dive",
      "learning.reduxBenefits": "Redux Toolkit Benefits",
      "learning.lessBoilerplate":
        "Less Boilerplate: createSlice generates actions and reducers",
      "learning.immerIntegration":
        'Immer Integration: Write "mutative" logic that\'s actually immutable',
      "learning.devTools": "DevTools: Built-in Redux DevTools support",
      "learning.asyncThunks":
        "Async Thunks: Handle side effects with createAsyncThunk",

      "learning.whenToUseRedux": "When to Use Redux",
      "learning.complexState": "Complex state logic across multiple components",
      "learning.persistState":
        "State that needs to persist across route changes",
      "learning.timeTravel": "Need for time-travel debugging",
      "learning.teamCollaboration": "Team collaboration on large applications",

      "learning.asyncPatterns": "Async Thunk Patterns",
      "learning.pending": "Pending: Set loading state, clear errors",
      "learning.fulfilled": "Fulfilled: Update state with response data",
      "learning.rejected": "Rejected: Handle errors gracefully",
      "learning.userFeedback":
        "Always provide user feedback for async operations",

      "learning.contextVsRedux": "Context vs Redux Trade-offs",
      "learning.contextDescription":
        "Context: Simple, React-native, good for theme/auth",
      "learning.reduxDescription":
        "Redux: Predictable, debuggable, great for complex apps",
      "learning.bothUsed":
        "This app uses both: Context for theme, Redux for settings!",

      "learning.i18nFeature": "Internationalization (i18n) Feature",
      "learning.i18nDescription":
        "Language switching is implemented using react-i18next",
      "learning.i18nBenefits":
        "Benefits: Real-time language switching, persistent language preference, professional i18n patterns",

      // Language options
      "languages.english": "English",
      "languages.hindi": "हिंदी",
      "languages.french": "Français",
      "languages.german": "Deutsch",
    },
  },
  hi: {
    translation: {
      // Settings Page
      "settings.title": "सेटिंग्स - Redux टूलकिट",
      "settings.userSettings": "उपयोगकर्ता सेटिंग्स",
      "settings.profileInfo": "प्रोफ़ाइल जानकारी",
      "settings.username": "उपयोगकर्ता नाम",
      "settings.email": "ईमेल",
      "settings.userId": "उपयोगकर्ता आईडी",
      "settings.preferences": "प्राथमिकताएं",
      "settings.emailNotifications": "ईमेल सूचनाएं",
      "settings.language": "भाषा",
      "settings.clearSettings": "सेटिंग्स साफ़ करें",
      "settings.updating": "अपडेट हो रहा है...",
      "settings.loading": "सेटिंग्स लोड हो रही हैं...",
      "settings.noSettings": "कोई सेटिंग्स लोड नहीं हुईं",
      "settings.loadSettings": "सेटिंग्स लोड करें",
      "settings.error": "त्रुटि",

      // Redux DevTools Section
      "settings.reduxDevTools": "Redux डेवटूल्स",
      "settings.reduxDescription":
        "वास्तविक समय में स्थिति परिवर्तन देखने के लिए Redux DevTools खोलें:",
      "settings.reduxFeature1":
        "सेटिंग्स के साथ इंटरैक्ट करने पर एक्शन भेजे जाते हैं",
      "settings.reduxFeature2":
        "Async thunks pending/fulfilled/rejected स्थितियां दिखाते हैं",
      "settings.reduxFeature3":
        "Time-travel debugging आपको एक्शन दोहराने देता है",
      "settings.reduxFeature4": "State diff बताता है कि क्या बदला है",

      // Learning Notes
      "learning.settingsTitle": "सेटिंग्स मॉड्यूल - Redux टूलकिट गहरी जानकारी",
      "learning.reduxBenefits": "Redux टूलकिट के फायदे",
      "learning.lessBoilerplate":
        "कम बॉयलरप्लेट: createSlice एक्शन और रिड्यूसर जेनरेट करता है",
      "learning.immerIntegration":
        'Immer एकीकरण: "mutative" लॉजिक लिखें जो वास्तव में immutable है',
      "learning.devTools": "DevTools: अंतर्निहित Redux DevTools समर्थन",
      "learning.asyncThunks":
        "Async Thunks: createAsyncThunk के साथ साइड इफेक्ट्स संभालें",

      "learning.whenToUseRedux": "Redux कब उपयोग करें",
      "learning.complexState": "कई घटकों में जटिल स्थिति तर्क",
      "learning.persistState": "रूट परिवर्तन के दौरान बनी रहने वाली स्थिति",
      "learning.timeTravel": "Time-travel debugging की आवश्यकता",
      "learning.teamCollaboration": "बड़े एप्लिकेशन में टीम सहयोग",

      "learning.asyncPatterns": "Async Thunk पैटर्न",
      "learning.pending":
        "Pending: लोडिंग स्थिति सेट करें, त्रुटियां साफ़ करें",
      "learning.fulfilled":
        "Fulfilled: प्रतिक्रिया डेटा के साथ स्थिति अपडेट करें",
      "learning.rejected": "Rejected: त्रुटियों को सुंदर तरीके से संभालें",
      "learning.userFeedback":
        "हमेशा async संचालन के लिए उपयोगकर्ता फीडबैक प्रदान करें",

      "learning.contextVsRedux": "Context बनाम Redux ट्रेड-ऑफ",
      "learning.contextDescription":
        "Context: सरल, React-देशी, theme/auth के लिए अच्छा",
      "learning.reduxDescription":
        "Redux: अनुमान लगाने योग्य, डिबग योग्य, जटिल ऐप्स के लिए बेहतरीन",
      "learning.bothUsed":
        "यह ऐप दोनों का उपयोग करता है: theme के लिए Context, settings के लिए Redux!",

      "learning.i18nFeature": "अंतर्राष्ट्रीयकरण (i18n) सुविधा",
      "learning.i18nDescription":
        "react-i18next का उपयोग करके भाषा स्विचिंग अब पूरी तरह कार्यात्मक है",
      "learning.i18nBenefits":
        "लाभ: वास्तविक समय भाषा स्विचिंग, स्थायी भाषा प्राथमिकता, पेशेवर i18n पैटर्न",

      // Language options
      "languages.english": "English",
      "languages.hindi": "हिंदी",
      "languages.french": "Français",
      "languages.german": "Deutsch",
    },
  },
  fr: {
    translation: {
      // Settings Page
      "settings.title": "Paramètres - Redux Toolkit",
      "settings.userSettings": "Paramètres Utilisateur",
      "settings.profileInfo": "Informations du Profil",
      "settings.username": "Nom d'utilisateur",
      "settings.email": "Email",
      "settings.userId": "ID Utilisateur",
      "settings.preferences": "Préférences",
      "settings.emailNotifications": "Notifications Email",
      "settings.language": "Langue",
      "settings.clearSettings": "Effacer les Paramètres",
      "settings.updating": "Mise à jour...",
      "settings.loading": "Chargement des paramètres...",
      "settings.noSettings": "Aucun paramètre chargé",
      "settings.loadSettings": "Charger les Paramètres",
      "settings.error": "Erreur",

      // Redux DevTools Section
      "settings.reduxDevTools": "Redux DevTools",
      "settings.reduxDescription":
        "Ouvrez Redux DevTools pour voir les changements d'état en temps réel:",
      "settings.reduxFeature1":
        "Les actions sont dispatchées lorsque vous interagissez avec les paramètres",
      "settings.reduxFeature2":
        "Les async thunks montrent les états pending/fulfilled/rejected",
      "settings.reduxFeature3":
        "Le débogage time-travel vous permet de rejouer les actions",
      "settings.reduxFeature4":
        "Le diff d'état montre exactement ce qui a changé",

      // Learning Notes
      "learning.settingsTitle":
        "Module Paramètres - Plongée Profonde Redux Toolkit",
      "learning.reduxBenefits": "Avantages de Redux Toolkit",
      "learning.lessBoilerplate":
        "Moins de Boilerplate: createSlice génère les actions et reducers",
      "learning.immerIntegration":
        'Intégration Immer: Écrivez une logique "mutative" qui est en fait immutable',
      "learning.devTools": "DevTools: Support intégré de Redux DevTools",
      "learning.asyncThunks":
        "Async Thunks: Gérez les effets de bord avec createAsyncThunk",

      "learning.whenToUseRedux": "Quand Utiliser Redux",
      "learning.complexState":
        "Logique d'état complexe à travers plusieurs composants",
      "learning.persistState":
        "État qui doit persister lors des changements de route",
      "learning.timeTravel": "Besoin de débogage time-travel",
      "learning.teamCollaboration":
        "Collaboration d'équipe sur de grandes applications",

      "learning.asyncPatterns": "Modèles Async Thunk",
      "learning.pending":
        "Pending: Définir l'état de chargement, effacer les erreurs",
      "learning.fulfilled":
        "Fulfilled: Mettre à jour l'état avec les données de réponse",
      "learning.rejected": "Rejected: Gérer les erreurs avec élégance",
      "learning.userFeedback":
        "Toujours fournir des commentaires utilisateur pour les opérations async",

      "learning.contextVsRedux": "Compromis Context vs Redux",
      "learning.contextDescription":
        "Context: Simple, natif React, bon pour theme/auth",
      "learning.reduxDescription":
        "Redux: Prévisible, débogable, excellent pour les applications complexes",
      "learning.bothUsed":
        "Cette app utilise les deux: Context pour le thème, Redux pour les paramètres!",

      "learning.i18nFeature": "Fonctionnalité d'Internationalisation (i18n)",
      "learning.i18nDescription":
        "Le changement de langue est maintenant entièrement fonctionnel avec react-i18next",
      "learning.i18nBenefits":
        "Avantages: Changement de langue en temps réel, préférence de langue persistante, modèles i18n professionnels",

      // Language options
      "languages.english": "English",
      "languages.hindi": "हिंदी",
      "languages.french": "Français",
      "languages.german": "Deutsch",
    },
  },
  de: {
    translation: {
      // Settings Page
      "settings.title": "Einstellungen - Redux Toolkit",
      "settings.userSettings": "Benutzereinstellungen",
      "settings.profileInfo": "Profilinformationen",
      "settings.username": "Benutzername",
      "settings.email": "E-Mail",
      "settings.userId": "Benutzer-ID",
      "settings.preferences": "Voreinstellungen",
      "settings.emailNotifications": "E-Mail-Benachrichtigungen",
      "settings.language": "Sprache",
      "settings.clearSettings": "Einstellungen Löschen",
      "settings.updating": "Wird aktualisiert...",
      "settings.loading": "Einstellungen werden geladen...",
      "settings.noSettings": "Keine Einstellungen geladen",
      "settings.loadSettings": "Einstellungen Laden",
      "settings.error": "Fehler",

      // Redux DevTools Section
      "settings.reduxDevTools": "Redux DevTools",
      "settings.reduxDescription":
        "Öffnen Sie Redux DevTools, um Zustandsänderungen in Echtzeit zu sehen:",
      "settings.reduxFeature1":
        "Aktionen werden gesendet, wenn Sie mit Einstellungen interagieren",
      "settings.reduxFeature2":
        "Async Thunks zeigen pending/fulfilled/rejected Zustände",
      "settings.reduxFeature3":
        "Time-travel Debugging ermöglicht das Wiederholen von Aktionen",
      "settings.reduxFeature4": "State Diff zeigt genau, was sich geändert hat",

      // Learning Notes
      "learning.settingsTitle": "Einstellungen Modul - Redux Toolkit Tiefgang",
      "learning.reduxBenefits": "Redux Toolkit Vorteile",
      "learning.lessBoilerplate":
        "Weniger Boilerplate: createSlice generiert Aktionen und Reducer",
      "learning.immerIntegration":
        'Immer Integration: Schreiben Sie "mutative" Logik, die tatsächlich unveränderlich ist',
      "learning.devTools": "DevTools: Eingebaute Redux DevTools Unterstützung",
      "learning.asyncThunks":
        "Async Thunks: Behandeln Sie Seiteneffekte mit createAsyncThunk",

      "learning.whenToUseRedux": "Wann Redux Verwenden",
      "learning.complexState":
        "Komplexe Zustandslogik über mehrere Komponenten hinweg",
      "learning.persistState":
        "Zustand, der über Routenänderungen hinweg bestehen muss",
      "learning.timeTravel": "Bedarf für Time-travel Debugging",
      "learning.teamCollaboration":
        "Team-Zusammenarbeit bei großen Anwendungen",

      "learning.asyncPatterns": "Async Thunk Muster",
      "learning.pending": "Pending: Ladezustand setzen, Fehler löschen",
      "learning.fulfilled": "Fulfilled: Zustand mit Antwortdaten aktualisieren",
      "learning.rejected": "Rejected: Fehler elegant behandeln",
      "learning.userFeedback":
        "Immer Benutzerfeedback für async Operationen bereitstellen",

      "learning.contextVsRedux": "Context vs Redux Abwägungen",
      "learning.contextDescription":
        "Context: Einfach, React-nativ, gut für Theme/Auth",
      "learning.reduxDescription":
        "Redux: Vorhersagbar, debuggbar, großartig für komplexe Apps",
      "learning.bothUsed":
        "Diese App verwendet beide: Context für Theme, Redux für Einstellungen!",

      "learning.i18nFeature": "Internationalisierung (i18n) Feature",
      "learning.i18nDescription":
        "Sprachwechsel ist jetzt vollständig funktionsfähig mit react-i18next",
      "learning.i18nBenefits":
        "Vorteile: Echtzeitsprachwechsel, persistente Sprachpräferenz, professionelle i18n-Muster",

      // Language options
      "languages.english": "English",
      "languages.hindi": "हिंदी",
      "languages.french": "Français",
      "languages.german": "Deutsch",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already does escaping
  },
});

export default i18n;
