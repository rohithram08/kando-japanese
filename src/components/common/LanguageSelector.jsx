import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Globe } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

const LANGUAGES = [
  { code: "en", label: "English",    nativeLabel: "English",   flag: "🇺🇸", region: "Americas"    },
  { code: "zh", label: "Chinese",    nativeLabel: "中文",       flag: "🇨🇳", region: "Asia"         },
  { code: "ko", label: "Korean",     nativeLabel: "한국어",     flag: "🇰🇷", region: "Asia"         },
  { code: "es", label: "Spanish",    nativeLabel: "Español",   flag: "🇪🇸", region: "Europe"       },
  { code: "fr", label: "French",     nativeLabel: "Français",  flag: "🇫🇷", region: "Europe"       },
  { code: "de", label: "German",     nativeLabel: "Deutsch",   flag: "🇩🇪", region: "Europe"       },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", flag: "🇧🇷", region: "Americas"    },
  { code: "ar", label: "Arabic",     nativeLabel: "العربية",   flag: "🇸🇦", region: "Middle East" },
  { code: "ru", label: "Russian",    nativeLabel: "Русский",   flag: "🇷🇺", region: "Europe"       },
  { code: "th", label: "Thai",       nativeLabel: "ภาษาไทย",  flag: "🇹🇭", region: "Asia"         },
  { code: "hi", label: "Hindi",      nativeLabel: "हिंदी",     flag: "🇮🇳", region: "Asia"         },
  { code: "ta", label: "Tamil",      nativeLabel: "தமிழ்",     flag: "🇮🇳", region: "Asia"         },
];

const LanguageSelector = ({ compact = false, onLanguageChange }) => {
  const { nativeLanguage, setNativeLanguage } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const selected = LANGUAGES.find((l) => l.code === nativeLanguage) || LANGUAGES[0];

  const regions = [...new Set(LANGUAGES.map((l) => l.region))];

  const filtered =
    search.trim() === ""
      ? LANGUAGES
      : LANGUAGES.filter(
          (l) =>
            l.label.toLowerCase().includes(search.toLowerCase()) ||
            l.nativeLabel.toLowerCase().includes(search.toLowerCase())
        );

  const groupedFiltered = regions.reduce((acc, region) => {
    const items = filtered.filter((l) => l.region === region);
    if (items.length > 0) acc[region] = items;
    return acc;
  }, {});

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelect = (lang) => {
    setNativeLanguage(lang.code);
    onLanguageChange?.(lang);
    setIsOpen(false);
    setSearch("");
  };

  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-2.5 py-1.5 transition-colors"
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="text-gray-300 text-xs font-medium hidden sm:block">
            {selected.code.toUpperCase()}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="px-3 py-2 border-b border-gray-700">
                <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <Globe className="w-3 h-3" />
                  Native Language
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {LANGUAGES.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    onClick={() => handleSelect(lang)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors"
                  >
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {lang.label}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {lang.nativeLabel}
                      </p>
                    </div>
                    {selected.code === lang.code && (
                      <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-2xl px-4 py-3 transition-all"
      >
        <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="text-xl leading-none">{selected.flag}</span>
        <div className="flex-1 text-left">
          <p className="text-sm text-white font-medium">{selected.label}</p>
          <p className="text-xs text-gray-500">{selected.nativeLabel}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="px-3 py-2.5 border-b border-gray-700">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>

            <div className="max-h-72 overflow-y-auto py-1">
              {Object.entries(groupedFiltered).map(([region, langs]) => (
                <div key={region}>
                  <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                    {region}
                  </p>
                  {langs.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      onClick={() => handleSelect(lang)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                    >
                      <span className="text-xl leading-none w-7 text-center">
                        {lang.flag}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            selected.code === lang.code
                              ? "text-green-400"
                              : "text-white"
                          }`}
                        >
                          {lang.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lang.nativeLabel}
                        </p>
                      </div>
                      {selected.code === lang.code && (
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </div>
              ))}

              {Object.keys(groupedFiltered).length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-gray-500 text-sm">No languages found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;