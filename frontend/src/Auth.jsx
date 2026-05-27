import { useState } from "react";
import { supabase } from "./lib/supabase";

function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const credentials = {
        email: email.trim(),
        password,
      };

      const { error: authError } = isLogin
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials);

      if (authError) {
        throw authError;
      }

      if (!isLogin) {
        setMessage("Регистрация успешна. Если включено подтверждение email, проверьте почту.");
      }
    } catch (authError) {
      setError(authError.message || "Не удалось выполнить действие.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_440px]">
          <section className="flex flex-col justify-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              AI Portfolio Generator
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              Создавайте портфолио с AI после безопасного входа
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              Пользователь вводит только главную информацию о себе, а AI агент
              формирует био, навыки, проекты, контакты и готовый предпросмотр.
            </p>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl shadow-black/30">
            <div className="mb-6 flex rounded-xl bg-neutral-950 p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`w-1/2 rounded-lg py-2 text-sm font-semibold transition ${
                  isLogin
                    ? "bg-indigo-600 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`w-1/2 rounded-lg py-2 text-sm font-semibold transition ${
                  !isLogin
                    ? "bg-indigo-600 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            <h2 className="text-2xl font-bold">
              {isLogin ? "Вход в аккаунт" : "Регистрация"}
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Сессия сохраняется автоматически через Supabase Auth.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-neutral-300">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 outline-none transition focus:border-indigo-500"
                  placeholder="student@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-neutral-300">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 outline-none transition focus:border-indigo-500"
                  placeholder="Минимум 6 символов"
                />
              </label>

              {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}

              {message && (
                <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-3 font-semibold transition hover:bg-indigo-500 disabled:bg-neutral-700"
              >
                {loading ? "Подождите..." : isLogin ? "Login" : "Create account"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Auth;
