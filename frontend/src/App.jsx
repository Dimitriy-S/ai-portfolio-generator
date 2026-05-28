import { useCallback, useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import Auth from "./Auth";
import { supabase } from "./lib/supabase";

const API_URL = "https://ai-portfolio-backend-gz83.onrender.com";

const getPortfolioTitle = (portfolio) =>
  portfolio?.name?.trim() ||
  portfolio?.profession?.trim() ||
  "Untitled Portfolio";

const downloadPdf = async (pdfRef) => {
  const element = pdfRef.current;

  if (!element) {
    alert("PDF блок не найден");
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

function PdfPortfolio({ portfolio, exportRef }) {
  return (
    <div
      style={{
        height: 1,
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
            {portfolio.name || "Untitled Portfolio"}
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
            Email: {portfolio.contacts?.email || "Not specified"} - GitHub:{" "}
            {portfolio.contacts?.github || "Not specified"}
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
            About
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
            Skills
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
            Projects
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
            Contacts
          </h3>
          <div style={{ color: "#333333" }}>
            <p style={{ margin: "0 0 4px" }}>
              Email: {portfolio.contacts?.email || "Not specified"}
            </p>
            <p style={{ margin: 0 }}>
              GitHub: {portfolio.contacts?.github || "Not specified"}
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

function App() {
  const previewPdfRef = useRef(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [savedPortfolios, setSavedPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const loadSavedPortfolios = useCallback(async (userId) => {
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
      alert("Не удалось загрузить сохранённые портфолио.");
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
  }, [loadSavedPortfolios]);

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
        .select("id,title,data,created_at")
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

  const handleDownloadPdf = async () => {
    if (!portfolio) {
      return;
    }

    setPdfLoading(true);

    try {
      await downloadPdf(previewPdfRef);
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Не удалось создать PDF");
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

                      <button
                        type="button"
                        onClick={() => deletePortfolio(savedPortfolio.id)}
                        disabled={deleteLoadingId === savedPortfolio.id}
                        className="mt-3 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10 disabled:border-neutral-700 disabled:text-neutral-500"
                      >
                        {deleteLoadingId === savedPortfolio.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
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
