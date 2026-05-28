import { useCallback, useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import Auth from "./Auth";
import { languageOptions, translations } from "./i18n";
import { supabase } from "./lib/supabase";

const API_URL = "https://ai-portfolio-backend-gz83.onrender.com";
const PORTFOLIO_STYLES = [
  "Minimal",
  "Modern",
  "Corporate",
  "Creative",
  "Developer",
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem("theme") === "light" ? "light" : "dark";
};

const getInitialLanguage = () => {
  if (typeof window === "undefined") {
    return "uk";
  }

  const savedLanguage = window.localStorage.getItem("language");
  return translations[savedLanguage] ? savedLanguage : "uk";
};

const getPortfolioTitle = (portfolio, t) =>
  portfolio?.name?.trim() ||
  portfolio?.profession?.trim() ||
  t.untitledPortfolio;

const downloadPdf = async (pdfRef, t) => {
  const element = pdfRef.current;

  if (!element) {
    alert(t.pdfBlockMissing);
    return;
  }

  const options = {
    margin: 10,
    filename: "portfolio.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().set(options).from(element).save();
};

function PdfPortfolio({ portfolio, exportRef, t }) {
  return (
    <div
      style={{
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <div
        ref={exportRef}
        style={{
          background: "#ffffff",
          color: "#1f2933",
          width: "760px",
          padding: "44px 48px",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "13.5px",
          lineHeight: "1.55",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #d8dee4",
            marginBottom: "26px",
            paddingBottom: "18px",
          }}
        >
          <h1
            style={{
              color: "#111827",
              fontSize: "34px",
              fontWeight: 700,
              lineHeight: "1.1",
              margin: "0",
            }}
          >
            {portfolio.name || t.appTitle}
          </h1>
          <h2
            style={{
              color: "#4b5563",
              fontSize: "18px",
              fontWeight: 400,
              margin: "8px 0 0",
            }}
          >
            {portfolio.profession}
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "12.5px",
              margin: "12px 0 0",
            }}
          >
            {t.email}: {portfolio.contacts?.email || t.notSpecified} -{" "}
            {t.github}: {portfolio.contacts?.github || t.notSpecified} -{" "}
            {t.phone}: {portfolio.contacts?.phone || t.notSpecified}
          </p>
        </div>

        <div>
          <h3
            style={{
              borderBottom: "1px solid #e5e7eb",
              color: "#111827",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.4px",
              margin: "0 0 10px",
              paddingBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            {t.about}
          </h3>
          <p style={{ color: "#333333", margin: 0 }}>{portfolio.bio}</p>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h3
            style={{
              borderBottom: "1px solid #e5e7eb",
              color: "#111827",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.4px",
              margin: "0 0 10px",
              paddingBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            {t.skills}
          </h3>
          <p style={{ color: "#333333", margin: 0 }}>
            {portfolio.skills?.join(", ")}
          </p>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h3
            style={{
              borderBottom: "1px solid #e5e7eb",
              color: "#111827",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.4px",
              margin: "0 0 12px",
              paddingBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            {t.projects}
          </h3>
          <div>
            {portfolio.projects?.map((project, index) => (
              <div key={index} style={{ marginBottom: "18px" }}>
                <h4
                  style={{
                    color: "#111111",
                    fontSize: "15px",
                    fontWeight: 700,
                    margin: "0 0 4px",
                  }}
                >
                  {project.title}
                </h4>
                <p style={{ color: "#333333", margin: 0 }}>
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h3
            style={{
              borderBottom: "1px solid #e5e7eb",
              color: "#111827",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.4px",
              margin: "0 0 10px",
              paddingBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            {t.contacts}
          </h3>
          <div style={{ color: "#333333" }}>
            <p style={{ margin: "0 0 4px" }}>
              {t.email}: {portfolio.contacts?.email || t.notSpecified}
            </p>
            <p style={{ margin: "0 0 4px" }}>
              {t.github}: {portfolio.contacts?.github || t.notSpecified}
            </p>
            <p style={{ margin: 0 }}>
              {t.phone}: {portfolio.contacts?.phone || t.notSpecified}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioView({
  portfolio,
  showSaveButton,
  saveLoading,
  onSave,
  improveLoading,
  onImprove,
  pdfLoading,
  onDownloadPdf,
  theme,
  t,
}) {
  const isDark = theme === "dark";

  return (
    <div>
      <div
        className={cn(
          "mb-6 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between",
          isDark ? "border-neutral-800" : "border-gray-200"
        )}
      >
        <div>
          <h2 className={cn("text-4xl font-bold", isDark && "text-white")}>
            {portfolio.name}
          </h2>
          <h3
            className={cn(
              "mt-2 text-xl",
              isDark ? "text-neutral-300" : "text-slate-600"
            )}
          >
            {portfolio.profession}
          </h3>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={pdfLoading}
            className={cn(
              "rounded-2xl border px-5 py-3 font-semibold transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed",
              isDark
                ? "border-neutral-700 bg-neutral-900 text-neutral-100 hover:border-cyan-400 hover:text-cyan-100 disabled:text-neutral-500"
                : "border-gray-200 bg-white text-slate-700 shadow-sm hover:border-indigo-300 hover:text-indigo-700 disabled:text-gray-400"
            )}
          >
            {pdfLoading ? t.preparingPdf : t.downloadPdf}
          </button>

          {showSaveButton && (
            <>
              <button
                type="button"
                onClick={onImprove}
                disabled={improveLoading}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5 hover:shadow-fuchsia-500/30 disabled:translate-y-0 disabled:from-neutral-700 disabled:to-neutral-700 disabled:text-neutral-400"
              >
                {improveLoading ? t.improving : t.improvePortfolio}
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={saveLoading}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30 disabled:translate-y-0 disabled:bg-neutral-700 disabled:from-neutral-700 disabled:to-neutral-700"
              >
                {saveLoading ? t.saving : t.savePortfolio}
              </button>
            </>
          )}
        </div>
      </div>

      <p
        className={cn(
          "mt-6 leading-relaxed",
          isDark ? "text-neutral-300" : "text-slate-600"
        )}
      >
        {portfolio.bio}
      </p>

      <h3 className="mb-4 mt-8 text-2xl font-bold">{t.skills}</h3>
      <div className="flex flex-wrap gap-2">
        {portfolio.skills?.map((skill, index) => (
          <span
            key={index}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold",
              isDark
                ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-200"
                : "border-indigo-200 bg-indigo-50 text-indigo-700"
            )}
          >
            {skill}
          </span>
        ))}
      </div>

      <h3 className="mb-4 mt-8 text-2xl font-bold">{t.projects}</h3>
      <div className="space-y-4">
        {portfolio.projects?.map((project, index) => (
          <div
            key={index}
            className={cn(
              "rounded-2xl border p-5 transition hover:-translate-y-0.5",
              isDark
                ? "border-neutral-700 bg-neutral-800/80 hover:border-indigo-400/50"
                : "border-gray-200 bg-white shadow-sm hover:border-indigo-200 hover:shadow-md"
            )}
          >
            <h4 className="text-xl font-semibold">{project.title}</h4>
            <p
              className={cn(
                "mt-2",
                isDark ? "text-neutral-300" : "text-slate-600"
              )}
            >
              {project.description}
            </p>
          </div>
        ))}
      </div>

      <h3 className="mb-4 mt-8 text-2xl font-bold">{t.contacts}</h3>
      <div
        className={cn(
          "space-y-1",
          isDark ? "text-neutral-300" : "text-slate-600"
        )}
      >
        <p>{t.email}: {portfolio.contacts?.email || t.notSpecified}</p>
        <p>{t.github}: {portfolio.contacts?.github || t.notSpecified}</p>
        <p>{t.phone}: {portfolio.contacts?.phone || t.notSpecified}</p>
      </div>
    </div>
  );
}

function App() {
  const previewPdfRef = useRef(null);
  const [theme, setTheme] = useState(getInitialTheme);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Minimal");
  const [portfolio, setPortfolio] = useState(null);
  const [savedPortfolios, setSavedPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [improveLoading, setImproveLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const isDark = theme === "dark";
  const t = translations[language] || translations.uk;
  const tRef = useRef(t);
  const authUserIdRef = useRef(null);
  const loadedPortfoliosUserIdRef = useRef(null);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    window.localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const loadSavedPortfolios = useCallback(async (userId, options = {}) => {
    if (!userId) {
      return;
    }

    const force = options.force === true;

    if (!force && loadedPortfoliosUserIdRef.current === userId) {
      return;
    }

    loadedPortfoliosUserIdRef.current = userId;
    setListLoading(true);

    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("id,title,data,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setSavedPortfolios(data || []);
    } catch (error) {
      console.error(error);
      if (loadedPortfoliosUserIdRef.current === userId) {
        loadedPortfoliosUserIdRef.current = null;
      }
      alert(tRef.current.loadError);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
      }

      if (isMounted) {
        const userId = data.session?.user?.id ?? null;

        authUserIdRef.current = userId;
        setSession(data.session);
        setAuthLoading(false);

        if (userId) {
          await loadSavedPortfolios(userId);
        }
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) {
        return;
      }

      const nextUserId = currentSession?.user?.id ?? null;
      const previousUserId = authUserIdRef.current;

      authUserIdRef.current = nextUserId;
      setSession(currentSession);
      setAuthLoading(false);

      if (!nextUserId) {
        loadedPortfoliosUserIdRef.current = null;
        setPortfolio(null);
        setSavedPortfolios([]);
        setSelectedPortfolioId(null);
        return;
      }

      if (nextUserId !== previousUserId) {
        loadSavedPortfolios(nextUserId);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadSavedPortfolios]);

  const generatePortfolio = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/generate?prompt=${encodeURIComponent(
          prompt
        )}&style=${encodeURIComponent(selectedStyle)}&language=${encodeURIComponent(
          language
        )}`
      );

      if (!response.ok) {
        throw new Error("Backend returned an error.");
      }

      const data = await response.json();
      setPortfolio(data);
      setSelectedPortfolioId(null);
    } catch (error) {
      console.error(error);
      alert(t.generateError);
    } finally {
      setLoading(false);
    }
  };

  const improvePortfolio = async () => {
    if (!portfolio) {
      return;
    }

    setImproveLoading(true);

    try {
      const response = await fetch(`${API_URL}/improve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolio,
          style: selectedStyle,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend returned an error.");
      }

      const data = await response.json();
      setPortfolio({
        ...portfolio,
        ...data,
        skills: data.skills?.length ? data.skills : portfolio.skills,
        contacts: {
          ...portfolio.contacts,
          ...data.contacts,
          phone: data.contacts?.phone ?? portfolio.contacts?.phone ?? "",
        },
      });
      setSelectedPortfolioId(null);
    } catch (error) {
      console.error(error);
      alert(t.improveError);
    } finally {
      setImproveLoading(false);
    }
  };

  const savePortfolio = async () => {
    if (!portfolio || !session?.user?.id) {
      return;
    }

    setSaveLoading(true);

    try {
      const title = getPortfolioTitle(portfolio, t);

      const { data, error } = await supabase
        .from("portfolios")
        .insert({
          user_id: session.user.id,
          title,
          data: portfolio,
        })
        .select("id,title,data,created_at")
        .single();

      if (error) {
        throw error;
      }

      setSavedPortfolios((current) => [data, ...current]);
      setSelectedPortfolioId(data.id);
    } catch (error) {
      console.error(error);
      alert(t.saveError);
    } finally {
      setSaveLoading(false);
    }
  };

  const selectSavedPortfolio = (savedPortfolio) => {
    setPortfolio(savedPortfolio.data);
    setSelectedPortfolioId(savedPortfolio.id);
  };

  const handleDownloadPdf = async () => {
    if (!portfolio) {
      return;
    }

    setPdfLoading(true);

    try {
      await downloadPdf(previewPdfRef, t);
    } catch (error) {
      console.error("PDF export error:", error);
      alert(t.pdfCreateError);
    } finally {
      setPdfLoading(false);
    }
  };

  const deletePortfolio = async (portfolioId) => {
    if (!session?.user?.id) {
      return;
    }

    setDeleteLoadingId(portfolioId);

    try {
      const { error } = await supabase
        .from("portfolios")
        .delete()
        .eq("id", portfolioId)
        .eq("user_id", session.user.id);

      if (error) {
        throw error;
      }

      setSavedPortfolios((current) =>
        current.filter((savedPortfolio) => savedPortfolio.id !== portfolioId)
      );

      if (selectedPortfolioId === portfolioId) {
        setPortfolio(null);
        setSelectedPortfolioId(null);
      }
    } catch (error) {
      console.error(error);
      alert(t.deleteError);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert(t.logoutError);
    }
  };

  const pageClass = isDark
    ? "bg-neutral-950 text-white"
    : "bg-slate-50 text-slate-950";
  const cardClass = isDark
    ? "border-neutral-800 bg-neutral-900/90 shadow-black/20"
    : "border-gray-200 bg-white shadow-indigo-100/70";
  const mutedTextClass = isDark ? "text-neutral-400" : "text-slate-500";
  const inputClass = isDark
    ? "border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:border-cyan-400"
    : "border-gray-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-indigo-400";

  if (authLoading) {
    return (
      <div
        className={cn(
          "flex min-h-screen items-center justify-center transition-colors",
          pageClass
        )}
      >
        <div className={cn("rounded-2xl border px-6 py-4", cardClass)}>
          {t.checkingSession}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <Auth
        theme={theme}
        language={language}
        onLanguageChange={setLanguage}
        onToggleTheme={toggleTheme}
        t={t}
      />
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors",
        pageClass
      )}
    >
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-1 w-screen bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400" />

      {portfolio && (
        <PdfPortfolio portfolio={portfolio} exportRef={previewPdfRef} t={t} />
      )}

      <div className="relative mx-auto max-w-7xl px-6 pb-6 pt-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={cn("text-sm", mutedTextClass)}>
              {session.user.email}
            </p>
            <h1 className="text-4xl font-bold tracking-tight">{t.appTitle}</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "rounded-2xl border px-5 py-3 font-semibold transition hover:-translate-y-0.5",
                isDark
                  ? "border-neutral-700 bg-neutral-900 text-cyan-100 hover:border-cyan-400"
                  : "border-gray-200 bg-white text-indigo-700 shadow-sm hover:border-indigo-300"
              )}
            >
              {isDark ? t.themeLight : t.themeDark}
            </button>

            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className={cn(
                "rounded-2xl border px-4 py-3 font-semibold outline-none transition",
                isDark
                  ? "border-neutral-700 bg-neutral-900 text-cyan-100 hover:border-cyan-400"
                  : "border-gray-200 bg-white text-indigo-700 shadow-sm hover:border-indigo-300"
              )}
            >
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={logout}
              className={cn(
                "rounded-2xl border px-5 py-3 font-semibold transition hover:-translate-y-0.5",
                isDark
                  ? "border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-red-400 hover:text-red-200"
                  : "border-gray-200 bg-white text-slate-700 shadow-sm hover:border-red-300 hover:text-red-600"
              )}
            >
              {t.logout}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <section
              className={cn(
                "rounded-3xl border p-6 shadow-xl transition",
                cardClass
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{t.aiAssistant}</h2>
                <span className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-3 py-1 text-xs font-bold text-white">
                  AI
                </span>
              </div>

              <label className="mb-4 block">
                <span
                  className={cn(
                    "mb-2 block text-sm font-semibold",
                    isDark ? "text-neutral-300" : "text-slate-700"
                  )}
                >
                  {t.portfolioStyle}
                </span>
                <select
                  value={selectedStyle}
                  onChange={(event) => setSelectedStyle(event.target.value)}
                  className={cn(
                    "w-full rounded-2xl border p-3 outline-none transition",
                    inputClass
                  )}
                >
                  {PORTFOLIO_STYLES.map((style) => (
                    <option key={style} value={style}>
                      {t.styles?.[style] || style}
                    </option>
                  ))}
                </select>
              </label>

              <div
                className={cn(
                  "overflow-hidden rounded-2xl border transition",
                  isDark
                    ? "border-neutral-700 bg-neutral-800 focus-within:border-cyan-400"
                    : "border-gray-200 bg-white focus-within:border-indigo-400"
                )}
              >
                <textarea
                  className={cn(
                    "app-scrollbar h-64 w-full resize-none border-0 bg-transparent py-4 pl-4 pr-6 outline-none",
                    isDark
                      ? "text-white placeholder:text-neutral-500"
                      : "text-slate-950 placeholder:text-slate-400"
                  )}
                  placeholder={t.promptPlaceholder}
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={generatePortfolio}
                disabled={loading || !prompt.trim()}
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:from-neutral-700 disabled:to-neutral-700 disabled:text-neutral-400"
              >
                {loading ? t.generating : t.generatePortfolio}
              </button>
            </section>

            <section
              className={cn(
                "rounded-3xl border p-6 shadow-xl transition",
                cardClass
              )}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold">{t.myPortfolios}</h2>
                <button
                  type="button"
                  onClick={() =>
                    loadSavedPortfolios(session.user.id, { force: true })
                  }
                  disabled={listLoading}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm font-semibold transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed",
                    isDark
                      ? "border-neutral-700 text-neutral-300 hover:border-indigo-400 hover:text-white disabled:text-neutral-600"
                      : "border-gray-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700 disabled:text-gray-400"
                  )}
                >
                  {listLoading ? t.loading : t.refresh}
                </button>
              </div>

              {savedPortfolios.length === 0 ? (
                <div
                  className={cn(
                    "rounded-2xl border border-dashed p-5 text-sm",
                    isDark
                      ? "border-neutral-700 text-neutral-500"
                      : "border-gray-300 text-slate-500"
                  )}
                >
                  {t.noSavedPortfolios}
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPortfolios.map((savedPortfolio) => (
                    <div
                      key={savedPortfolio.id}
                      className={cn(
                        "rounded-2xl border p-4 transition hover:-translate-y-0.5",
                        selectedPortfolioId === savedPortfolio.id
                          ? isDark
                            ? "border-indigo-400 bg-indigo-500/10"
                            : "border-indigo-300 bg-indigo-50"
                          : isDark
                            ? "border-neutral-800 bg-neutral-950/60 hover:border-cyan-400/50"
                            : "border-gray-200 bg-white hover:border-indigo-200 hover:shadow-md"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => selectSavedPortfolio(savedPortfolio)}
                        className="block w-full text-left"
                      >
                        <span className="block font-semibold">
                          {savedPortfolio.title}
                        </span>
                        <span className={cn("mt-1 block text-sm", mutedTextClass)}>
                          {savedPortfolio.created_at
                            ? new Date(
                                savedPortfolio.created_at
                              ).toLocaleString(
                                language === "uk" ? "uk-UA" : "en-US"
                              )
                            : t.noDate}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deletePortfolio(savedPortfolio.id)}
                        disabled={deleteLoadingId === savedPortfolio.id}
                        className={cn(
                          "mt-3 rounded-xl border px-3 py-2 text-sm font-semibold transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed",
                          isDark
                            ? "border-red-500/30 text-red-200 hover:bg-red-500/10 disabled:border-neutral-700 disabled:text-neutral-500"
                            : "border-red-200 text-red-600 hover:bg-red-50 disabled:border-gray-200 disabled:text-gray-400"
                        )}
                      >
                        {deleteLoadingId === savedPortfolio.id
                          ? t.deleting
                          : t.delete}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <section
            className={cn(
              "rounded-3xl border p-6 shadow-xl transition",
              cardClass
            )}
          >
            {!portfolio ? (
              <div
                className={cn(
                  "flex h-full min-h-80 items-center justify-center rounded-2xl border border-dashed text-center",
                  isDark
                    ? "border-neutral-700 text-neutral-500"
                    : "border-gray-300 text-slate-500"
                )}
              >
                {t.previewEmpty}
              </div>
            ) : (
              <PortfolioView
                portfolio={portfolio}
                showSaveButton
                saveLoading={saveLoading}
                onSave={savePortfolio}
                improveLoading={improveLoading}
                onImprove={improvePortfolio}
                pdfLoading={pdfLoading}
                onDownloadPdf={handleDownloadPdf}
                theme={theme}
                t={t}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
