import { useEffect, useState } from "react";
import Auth from "./Auth";
import { supabase } from "./lib/supabase";

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);

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
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const generatePortfolio = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://ai-portfolio-backend-gz83.onrender.com/generate?prompt=${encodeURIComponent(prompt)}`
      );

      if (!response.ok) {
        throw new Error("Backend returned an error.");
      }

      const data = await response.json();
      setPortfolio(data);
    } catch (error) {
      console.error(error);
      alert("Ошибка генерации. Проверь backend.");
    } finally {
      setLoading(false);
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
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
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            {!portfolio ? (
              <div className="flex h-full min-h-80 items-center justify-center text-center text-neutral-500">
                Здесь появится предпросмотр портфолио
              </div>
            ) : (
              <div>
                <p className="mb-2 text-indigo-400">{portfolio.theme}</p>
                <h2 className="text-4xl font-bold">{portfolio.name}</h2>
                <h3 className="mt-2 text-xl text-neutral-300">
                  {portfolio.profession}
                </h3>

                <p className="mt-6 leading-relaxed text-neutral-300">
                  {portfolio.bio}
                </p>

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
                      <p className="mt-2 text-neutral-300">
                        {project.description}
                      </p>
                    </div>
                  ))}
                </div>

                <h3 className="mb-4 mt-8 text-2xl font-bold">Contacts</h3>
                <div className="space-y-1 text-neutral-300">
                  <p>Email: {portfolio.contacts?.email || "Не указан"}</p>
                  <p>GitHub: {portfolio.contacts?.github || "Не указан"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
