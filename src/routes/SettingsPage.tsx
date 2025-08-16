import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchSettings,
  updateSettings,
  clearSettings,
} from "../store/settingsSlice";
import { LearningNote } from "../components/LearningNote";
import { useTheme } from "../hooks/useTheme";

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading, error } = useSelector(
    (state: RootState) => state.settings
  );

  useEffect(() => {
    console.log("⚙️ [Settings] Component mounted, fetching settings");
    dispatch(fetchSettings("noobuser"));
  }, [dispatch]);

  // Sync Redux settings language with i18n
  useEffect(() => {
    if (settings?.language && settings.language !== i18n.language) {
      console.log(`🌐 [i18n] Changing language to: ${settings.language}`);
      i18n.changeLanguage(settings.language);
    }
  }, [settings?.language, i18n]);

  const handleUpdateNotifications = (notifications: boolean) => {
    dispatch(updateSettings({ notifications }));
  };

  const handleUpdateLanguage = (language: string) => {
    console.log(`🌐 [i18n] Language changing to: ${language}`);
    dispatch(updateSettings({ language }));
    i18n.changeLanguage(language);
  };

  const handleClearSettings = () => {
    dispatch(clearSettings());
  };

  if (loading && !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg">{t("settings.loading")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">{t("settings.title")}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>{t("settings.error")}:</strong> {error}
        </div>
      )}

      {settings ? (
        <div
          className={`p-6 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-100"
          }`}>
          <h2 className="text-xl font-semibold mb-4">
            {t("settings.userSettings")}
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">
                {t("settings.profileInfo")}
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>{t("settings.username")}:</strong> {settings.username}
                </p>
                <p>
                  <strong>{t("settings.email")}:</strong> {settings.email}
                </p>
                <p>
                  <strong>{t("settings.userId")}:</strong> {settings.id}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t("settings.preferences")}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) =>
                        handleUpdateNotifications(e.target.checked)
                      }
                      disabled={loading}
                      className="mr-2"
                    />
                    {t("settings.emailNotifications")}
                  </label>
                  {loading && (
                    <span className="text-sm text-gray-500">
                      {t("settings.updating")}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <span>{t("settings.language")}:</span>
                    <select
                      value={settings.language}
                      onChange={(e) => handleUpdateLanguage(e.target.value)}
                      disabled={loading}
                      className="px-2 py-1 border rounded text-gray-900">
                      <option value="en">{t("languages.english")}</option>
                      <option value="hi">{t("languages.hindi")}</option>
                      <option value="fr">{t("languages.french")}</option>
                      <option value="de">{t("languages.german")}</option>
                    </select>
                  </label>
                  {loading && (
                    <span className="text-sm text-gray-500">
                      {t("settings.updating")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={handleClearSettings}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                {t("settings.clearSettings")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`p-6 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-100"
          }`}>
          <p className="text-center text-gray-500">
            {t("settings.noSettings")}
          </p>
          <button
            onClick={() => dispatch(fetchSettings("noobuser"))}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            {t("settings.loadSettings")}
          </button>
        </div>
      )}

      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-xl font-semibold mb-4">
          {t("settings.reduxDevTools")}
        </h2>
        <p className="mb-2">{t("settings.reduxDescription")}</p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>{t("settings.reduxFeature1")}</li>
          <li>{t("settings.reduxFeature2")}</li>
          <li>{t("settings.reduxFeature3")}</li>
          <li>{t("settings.reduxFeature4")}</li>
        </ul>
      </div>

      <LearningNote title={t("learning.settingsTitle")}>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-blue-600">
              {t("learning.reduxBenefits")}
            </h4>
            <p>
              <strong>{t("learning.lessBoilerplate").split(":")[0]}:</strong>{" "}
              {t("learning.lessBoilerplate").split(":")[1]}
            </p>
            <p>
              <strong>{t("learning.immerIntegration").split(":")[0]}:</strong>{" "}
              {t("learning.immerIntegration").split(":")[1]}
            </p>
            <p>
              <strong>{t("learning.devTools").split(":")[0]}:</strong>{" "}
              {t("learning.devTools").split(":")[1]}
            </p>
            <p>
              <strong>{t("learning.asyncThunks").split(":")[0]}:</strong>{" "}
              {t("learning.asyncThunks").split(":")[1]}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-green-600">
              {t("learning.whenToUseRedux")}
            </h4>
            <p>• {t("learning.complexState")}</p>
            <p>• {t("learning.persistState")}</p>
            <p>• {t("learning.timeTravel")}</p>
            <p>• {t("learning.teamCollaboration")}</p>
          </div>

          <div>
            <h4 className="font-bold text-purple-600">
              {t("learning.asyncPatterns")}
            </h4>
            <p>
              • <strong>{t("learning.pending").split(":")[0]}:</strong>{" "}
              {t("learning.pending").split(":")[1]}
            </p>
            <p>
              • <strong>{t("learning.fulfilled").split(":")[0]}:</strong>{" "}
              {t("learning.fulfilled").split(":")[1]}
            </p>
            <p>
              • <strong>{t("learning.rejected").split(":")[0]}:</strong>{" "}
              {t("learning.rejected").split(":")[1]}
            </p>
            <p>• {t("learning.userFeedback")}</p>
          </div>

          <div>
            <h4 className="font-bold text-orange-600">
              {t("learning.contextVsRedux")}
            </h4>
            <p>
              <strong>{t("learning.contextDescription").split(":")[0]}:</strong>{" "}
              {t("learning.contextDescription").split(":")[1]}
            </p>
            <p>
              <strong>{t("learning.reduxDescription").split(":")[0]}:</strong>{" "}
              {t("learning.reduxDescription").split(":")[1]}
            </p>
            <p>{t("learning.bothUsed")}</p>
          </div>

          <div>
            <h4 className="font-bold text-indigo-600">
              {t("learning.i18nFeature")}
            </h4>
            <p>{t("learning.i18nDescription")}</p>
            <p>
              <strong>{t("learning.i18nBenefits").split(":")[0]}:</strong>{" "}
              {t("learning.i18nBenefits").split(":")[1]}
            </p>
          </div>
        </div>
      </LearningNote>
    </div>
  );
};

export default SettingsPage;
