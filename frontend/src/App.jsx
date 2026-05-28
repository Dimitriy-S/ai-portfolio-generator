import { useCallback, useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import Auth from "./Auth";
import { supabase } from "./lib/supabase";

const API_URL = "https://ai-portfolio-backend-gz83.onrender.com";
const PUBLIC_PORTFOLIO_PREFIX = "/portfolio/";

const createSlug = (source) => {
  const base = source
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base || "portfolio"}-${Date.now()}`;
};

const getPortfolioTitle = (portfolio) =>
  portfolio?.name?.trim() ||
  portfolio?.profession?.trim() ||
  "Untitled Portfolio";

const getPublicUrl = (slug) =>
  `${window.location.origin}${PUBLIC_PORTFOLIO_PREFIX}${slug}`;

const downloadPdf = async (element, portfolio) => {
  if (!element) {
    return;
  }

  const fileName = `${createSlug(getPortfolioTitle(portfolio))}.pdf`;

  await html2pdf()
    .set({
      margin: 0,
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    })
    .from(element)
    .save();
};

function PdfPortfolio({ portfolio, exportRef }) {
  return (
    <div className="fixed -left-[9999px] top-0">
      <div
        ref={exportRef}
        className="w-[794px] bg-white px-14 py-12 font-sans text-neutral-950"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">
          {portfolio.theme || "Portfolio"}
        </p>
        <h1 className="text-4xl font-bold leading-tight">
          {portfolio.name || "Untitled Portfolio"}
        </h1>
        <h2 className="mt-2 text-xl font-semibold text-neutral-600">
          {portfolio.profession}
        </h2>

        <section className="mt-8">
          <h3 className="mb-3 border-b border-neutral-200 pb-2 text-xl font-bold">
            About
          </h3>
          <p className="text-base leading-7 text-neutral-700">{portfolio.bio}</p>
        </section>

        <section className="mt-8">
          <h3 className="mb-3 border-b border-neutral-200 pb-2 text-xl font-bold">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {portfolio.skills?.map((skill, index) => (
              <span
                key={index}
                className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h3 className="mb-3 border-b border-neutral-200 pb-2 text-xl font-bold">
            Projects
          </h3>
          <div className="space-y-4">
            {portfolio.projects?.map((project, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
              >
                <h4 className="text-lg font-bold">{project.title}</h4>
                <p className="mt-2 text-sm leading-6 text-neutral-700">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h3 className="mb-3 border-b border-neutral-200 pb-2 text-xl font-bold">
            Contacts
          </h3>
          <div className="space-y-1 text-base text-neutral-700">
            <p>Email: {portfolio.contacts?.email || "Not specified"}</p>
            <p>GitHub: {portfolio.contacts?.github || "Not specified"}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function PortfolioView({
  portfolio,
  showSaveButton,
  saveLoading,
  onSave,
  pdfLoading,
  onDownloadPdf,
}) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 border-b border-neutral-800 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-indigo-400">{portfolio.theme}</p>
          <h2 className="text-4xl font-bold">{portfolio.name}</h2>
          <h3 className="mt-2 text-xl text-neutral-300">
            {portfolio.profession}
          </h3>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={pdfLoading}
            className="rounded-xl border border-neutral-700 px-5 py-3 font-semibold text-neutral-200 transition hover:border-indigo-500 hover:text-white disabled:text-neutral-500"
          >
            {pdfLoading ? "Preparing PDF..." : "Download PDF"}
          </button>

          {showSaveButton && (
            <button
              type="button"
              onClick={onSave}
              disabled={saveLoading}
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:bg-neutral-700"
            >
              {saveLoading ? "Saving..." : "Save Portfolio"}
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 leading-relaxed text-neutral-300">{portfolio.bio}</p>

      <h3 className="mb-4 mt-8 text-2xl font-bold">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {portfolio.skills?.map((skill, index) => (
          <span
            key={index}
            className="rounded-full border border-indigo-500/30 bg-indigo-600/20 px-4 py-2 text-indigo-300"
          >
            {skill}
          </span>
        ))}
      </div>

      <h3 className="mb-4 mt-8 text-2xl font-bold">Projects</h3>
      <div className="space-y-4">
        {portfolio.projects?.map((project, index) => (
          <div
            key={index}
            className="rounded-xl border border-neutral-700 bg-neutral-800 p-5"
          >
            <h4 className="text-xl font-semibold">{project.title}</h4>
            <p className="mt-2 text-neutral-300">{project.description}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-4 mt-8 text-2xl font-bold">Contacts</h3>
      <div className="space-y-1 text-neutral-300">
        <p>Email: {portfolio.contacts?.email || "Не указан"}</p>
        <p>GitHub: {portfolio.contacts?.github || "Не указан"}</p>
      </div>
    </div>
  );
}

function PublicPortfolioPage({ portfolio, loading, error, onCopy }) {
  const publicPdfRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDownloadPdf = async () => {
    setPdfLoading(true);

    try {
      await downloadPdf(publicPdfRef.current, portfolio.data);
    } catch (error) {
      console.error(error);
      alert("Не удалось скачать PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-6 py-4 text-neutral-300">
          Loading public portfolio...
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
        <div className="max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center">
          <h1 className="text-3xl font-bold">Portfolio not found</h1>
          <p className="mt-3 text-neutral-400">
            This public portfolio is unavailable or has been made private.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <PdfPortfolio portfolio={portfolio.data} exportRef={publicPdfRef} />

      <main className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Public Portfolio
            </p>
            <h1 className="mt-2 text-4xl font-bold">AI Portfolio Generator</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="rounded-xl border border-neutral-700 px-5 py-3 font-semibold text-neutral-200 transition hover:border-indigo-500 hover:text-white disabled:text-neutral-500"
            >
              {pdfLoading ? "Preparing PDF..." : "Download PDF"}
            </button>
            <button
              type="button"
              onClick={onCopy}
              className="rounded-xl border border-neutral-700 px-5 py-3 font-semibold text-neutral-200 transition hover:border-indigo-500 hover:text-white"
            >
              Copy Public Link
            </button>
          </div>
        </div>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl shadow-black/30">
          <PortfolioView
            portfolio={portfolio.data}
            showSaveButton={false}
            pdfLoading={pdfLoading}
            onDownloadPdf={handleDownloadPdf}
          />
        </section>
      </main>
    </div>
  );
}

function App() {
  const isPublicRoute = window.location.pathname.startsWith(
    PUBLIC_PORTFOLIO_PREFIX
  );
  const publicSlug = isPublicRoute
    ? decodeURIComponent(
        window.location.pathname.slice(PUBLIC_PORTFOLIO_PREFIX.length)
      )
    : "";

  const previewPdfRef = useRef(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [savedPortfolios, setSavedPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [publicPortfolio, setPublicPortfolio] = useState(null);
  const [publicLoading, setPublicLoading] = useState(isPublicRoute);
  const [publicError, setPublicError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [publishLoadingId, setPublishLoadingId] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const loadSavedPortfolios = useCallback(async (userId) => {
    setListLoading(true);

    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("id,title,data,created_at,is_public,slug")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setSavedPortfolios(data || []);
    } catch (error) {
      console.error(error);
      alert("Не удалось загрузить сохранённые портфолио.");
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isPublicRoute) {
      return;
    }

    const loadPublicPortfolio = async () => {
      setPublicLoading(true);
      setPublicError("");

      try {
        const { data, error } = await supabase
          .from("portfolios")
          .select("title,data,created_at,slug,is_public")
          .eq("slug", publicSlug)
          .eq("is_public", true)
          .single();

        if (error) {
          throw error;
        }

        setPublicPortfolio(data);
      } catch (error) {
        console.error(error);
        setPublicError("Portfolio not found.");
      } finally {
        setPublicLoading(false);
      }
    };

    loadPublicPortfolio();
  }, [isPublicRoute, publicSlug]);

  useEffect(() => {
    if (isPublicRoute) {
      return undefined;
    }

    let isMounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
      }

      if (isMounted) {
        setSession(data.session);
        setAuthLoading(false);

        if (data.session?.user?.id) {
          await loadSavedPortfolios(data.session.user.id);
        }
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setAuthLoading(false);

      if (!currentSession) {
        setPortfolio(null);
        setSavedPortfolios([]);
        setSelectedPortfolioId(null);
        return;
      }

      if (currentSession.user?.id) {
        loadSavedPortfolios(currentSession.user.id);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isPublicRoute, loadSavedPortfolios]);

  const generatePortfolio = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/generate?prompt=${encodeURIComponent(prompt)}`
      );

      if (!response.ok) {
        throw new Error("Backend returned an error.");
      }

      const data = await response.json();
      setPortfolio(data);
      setSelectedPortfolioId(null);
    } catch (error) {
      console.error(error);
      alert("Ошибка генерации. Проверь backend.");
    } finally {
      setLoading(false);
    }
  };

  const savePortfolio = async () => {
    if (!portfolio || !session?.user?.id) {
      return;
    }

    setSaveLoading(true);

    try {
      const title = getPortfolioTitle(portfolio);

      const { data, error } = await supabase
        .from("portfolios")
        .insert({
          user_id: session.user.id,
          title,
          data: portfolio,
        })
        .select("id,title,data,created_at,is_public,slug")
        .single();

      if (error) {
        throw error;
      }

      setSavedPortfolios((current) => [data, ...current]);
      setSelectedPortfolioId(data.id);
    } catch (error) {
      console.error(error);
      alert("Не удалось сохранить портфолио.");
    } finally {
      setSaveLoading(false);
    }
  };

  const selectSavedPortfolio = (savedPortfolio) => {
    setPortfolio(savedPortfolio.data);
    setSelectedPortfolioId(savedPortfolio.id);
  };

  const togglePublicPortfolio = async (savedPortfolio) => {
    if (!session?.user?.id) {
      return;
    }

    setPublishLoadingId(savedPortfolio.id);

    try {
      const isMakingPublic = !savedPortfolio.is_public;
      const nextSlug =
        savedPortfolio.slug ||
        createSlug(
          savedPortfolio.title ||
            savedPortfolio.data?.name ||
            savedPortfolio.data?.profession ||
            "portfolio"
        );

      const updatePayload = isMakingPublic
        ? { is_public: true, slug: nextSlug }
        : { is_public: false };

      const { data, error } = await supabase
        .from("portfolios")
        .update(updatePayload)
        .eq("id", savedPortfolio.id)
        .eq("user_id", session.user.id)
        .select("id,title,data,created_at,is_public,slug")
        .single();

      if (error) {
        throw error;
      }

      setSavedPortfolios((current) =>
        current.map((portfolioItem) =>
          portfolioItem.id === savedPortfolio.id ? data : portfolioItem
        )
      );
    } catch (error) {
      console.error(error);
      alert("Не удалось изменить публичность портфолио.");
    } finally {
      setPublishLoadingId(null);
    }
  };

  const copyPublicLink = async (slug) => {
    try {
      await navigator.clipboard.writeText(getPublicUrl(slug));
      alert("Public link copied.");
    } catch (error) {
      console.error(error);
      alert("Не удалось скопировать ссылку.");
    }
  };

  const handleDownloadPdf = async () => {
    if (!portfolio) {
      return;
    }

    setPdfLoading(true);

    try {
      await downloadPdf(previewPdfRef.current, portfolio);
    } catch (error) {
      console.error(error);
      alert("Не удалось скачать PDF.");
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
      alert("Не удалось удалить портфолио.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert("Не удалось выйти из аккаунта.");
    }
  };

  if (isPublicRoute) {
    return (
      <PublicPortfolioPage
        portfolio={publicPortfolio}
        loading={publicLoading}
        error={publicError}
        onCopy={() => copyPublicLink(publicSlug)}
      />
    );
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-6 py-4 text-neutral-300">
          Проверка сессии...
        </div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 text-white">
      {portfolio && (
        <PdfPortfolio portfolio={portfolio} exportRef={previewPdfRef} />
      )}

      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-400">{session.user.email}</p>
            <h1 className="text-4xl font-bold">AI Portfolio Generator</h1>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-neutral-700 px-5 py-3 font-semibold text-neutral-200 transition hover:border-red-400 hover:text-red-200"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="mb-4 text-2xl font-semibold">AI Assistant</h2>

              <textarea
                className="h-64 w-full resize-none rounded-xl border border-neutral-700 bg-neutral-800 p-4 outline-none transition focus:border-indigo-500"
                placeholder="Расскажите о себе, опыте, навыках, проектах..."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />

              <button
                type="button"
                onClick={generatePortfolio}
                disabled={loading || !prompt.trim()}
                className="mt-4 w-full rounded-xl bg-indigo-600 py-3 font-semibold transition hover:bg-indigo-500 disabled:bg-neutral-700"
              >
                {loading ? "Генерация..." : "Generate Portfolio"}
              </button>
            </section>

            <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold">My Portfolios</h2>
                <button
                  type="button"
                  onClick={() => loadSavedPortfolios(session.user.id)}
                  disabled={listLoading}
                  className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300 transition hover:border-indigo-500 hover:text-white disabled:text-neutral-600"
                >
                  {listLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {savedPortfolios.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-700 p-5 text-sm text-neutral-500">
                  Сохранённые портфолио появятся здесь.
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPortfolios.map((savedPortfolio) => (
                    <div
                      key={savedPortfolio.id}
                      className={`rounded-xl border p-4 transition ${
                        selectedPortfolioId === savedPortfolio.id
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-neutral-800 bg-neutral-950/60"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => selectSavedPortfolio(savedPortfolio)}
                        className="block w-full text-left"
                      >
                        <span className="block font-semibold text-white">
                          {savedPortfolio.title}
                        </span>
                        <span className="mt-1 block text-sm text-neutral-500">
                          {savedPortfolio.created_at
                            ? new Date(
                                savedPortfolio.created_at
                              ).toLocaleString()
                            : "Без даты"}
                        </span>
                      </button>

                      {savedPortfolio.is_public && savedPortfolio.slug && (
                        <div className="mt-3 rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-sm text-indigo-100">
                          <p className="break-all">
                            {PUBLIC_PORTFOLIO_PREFIX}
                            {savedPortfolio.slug}
                          </p>
                          <button
                            type="button"
                            onClick={() => copyPublicLink(savedPortfolio.slug)}
                            className="mt-2 font-semibold text-indigo-300 transition hover:text-indigo-100"
                          >
                            Copy Public Link
                          </button>
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => togglePublicPortfolio(savedPortfolio)}
                          disabled={publishLoadingId === savedPortfolio.id}
                          className="rounded-lg border border-emerald-500/30 px-3 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/10 disabled:border-neutral-700 disabled:text-neutral-500"
                        >
                          {publishLoadingId === savedPortfolio.id
                            ? "Updating..."
                            : savedPortfolio.is_public
                              ? "Make Private"
                              : "Make Public"}
                        </button>

                        <button
                          type="button"
                          onClick={() => deletePortfolio(savedPortfolio.id)}
                          disabled={deleteLoadingId === savedPortfolio.id}
                          className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10 disabled:border-neutral-700 disabled:text-neutral-500"
                        >
                          {deleteLoadingId === savedPortfolio.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            {!portfolio ? (
              <div className="flex h-full min-h-80 items-center justify-center text-center text-neutral-500">
                Здесь появится предпросмотр портфолио
              </div>
            ) : (
              <PortfolioView
                portfolio={portfolio}
                showSaveButton
                saveLoading={saveLoading}
                onSave={savePortfolio}
                pdfLoading={pdfLoading}
                onDownloadPdf={handleDownloadPdf}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
