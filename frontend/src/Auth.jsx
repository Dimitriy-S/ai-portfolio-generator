import { useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const validatePassword = (password) => ({
  hasValidLength: password.length >= 10 && password.length <= 50,
  hasUppercase: /[A-ZА-ЯЁ]/.test(password),
  hasDigit: /\d/.test(password),
});

function Auth({ theme = "dark", onToggleTheme }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isLogin = mode === "login";
  const isDark = theme === "dark";
  const passwordChecks = useMemo(() => validatePassword(password), [password]);
  const isPasswordValid =
    passwordChecks.hasValidLength &&
    passwordChecks.hasUppercase &&
    passwordChecks.hasDigit;
  const isSubmitDisabled = loading || (!isLogin && !isPasswordValid);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!isLogin && !isPasswordValid) {
      setError(
        "Пароль должен содержать 10–50 символов, минимум 1 заглавную букву и минимум 1 цифру."
      );
      return;
    }

    setLoading(true);

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
        setMessage(
          "Регистрация успешна. Если включено подтверждение email, проверьте почту."
        );
      }
    } catch (authError) {
      setError(authError.message || "Не удалось выполнить действие.");
    } finally {
      setLoading(false);
    }
  };

  const pageClass = isDark
    ? "bg-neutral-950 text-white"
    : "bg-slate-50 text-slate-950";
  const cardClass = isDark
    ? "border-neutral-800 bg-neutral-900/90 shadow-black/30"
    : "border-gray-200 bg-white shadow-indigo-100/70";
  const mutedTextClass = isDark ? "text-neutral-300" : "text-slate-600";
  const inputClass = isDark
    ? "border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:border-cyan-400"
    : "border-gray-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-indigo-400";

  return (
    <div
      className={cn(
        "min-h-screen transition-colors",
        pageClass
      )}
    >
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-1 w-screen bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center px-6 pb-10 pt-11">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_440px]">
          <section className="flex flex-col justify-center">
            <div className="mb-5 flex items-center gap-3">
              <p className="rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
                AI Portfolio Generator
              </p>
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5",
                    isDark
                      ? "border-neutral-700 bg-neutral-900 text-cyan-100 hover:border-cyan-400"
                      : "border-gray-200 bg-white text-indigo-700 shadow-sm hover:border-indigo-300"
                  )}
                >
                  {isDark ? "Light" : "Dark"}
                </button>
              )}
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Создавайте портфолио с AI после безопасного входа
            </h1>
            <p className={cn("mt-6 max-w-2xl text-lg leading-8", mutedTextClass)}>
              Пользователь вводит только главную информацию о себе, а AI агент
              формирует био, навыки, проекты, контакты и готовый предпросмотр.
            </p>
          </section>

          <section
            className={cn(
              "rounded-3xl border p-6 shadow-2xl transition",
              cardClass
            )}
          >
            <div
              className={cn(
                "mb-6 flex rounded-2xl p-1",
                isDark ? "bg-neutral-950" : "bg-slate-100"
              )}
            >
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={cn(
                  "w-1/2 rounded-xl py-2 text-sm font-semibold transition",
                  isLogin
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20"
                    : isDark
                      ? "text-neutral-400 hover:text-white"
                      : "text-slate-500 hover:text-slate-950"
                )}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={cn(
                  "w-1/2 rounded-xl py-2 text-sm font-semibold transition",
                  !isLogin
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20"
                    : isDark
                      ? "text-neutral-400 hover:text-white"
                      : "text-slate-500 hover:text-slate-950"
                )}
              >
                Register
              </button>
            </div>

            <h2 className="text-2xl font-bold">
              {isLogin ? "Вход в аккаунт" : "Регистрация"}
            </h2>
            <p className={cn("mt-2 text-sm", isDark ? "text-neutral-400" : "text-slate-500")}>
              Сессия сохраняется автоматически через Supabase Auth.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span
                  className={cn(
                    "mb-2 block text-sm font-medium",
                    isDark ? "text-neutral-300" : "text-slate-700"
                  )}
                >
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className={cn(
                    "w-full rounded-2xl border px-4 py-3 outline-none transition",
                    inputClass
                  )}
                  placeholder="student@example.com"
                />
              </label>

              <label className="block">
                <span
                  className={cn(
                    "mb-2 block text-sm font-medium",
                    isDark ? "text-neutral-300" : "text-slate-700"
                  )}
                >
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={isLogin ? 1 : 10}
                  maxLength={50}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-3 outline-none transition",
                    !isLogin && password && !isPasswordValid
                      ? "border-red-500 bg-red-500/10 focus:border-red-400"
                      : inputClass
                  )}
                  placeholder={
                    isLogin ? "Введите пароль" : "Минимум 10 символов"
                  }
                />
              </label>

              {!isLogin && (
                <div
                  className={cn(
                    "rounded-2xl border p-4 text-sm",
                    isDark
                      ? "border-neutral-800 bg-neutral-950/70 text-neutral-300"
                      : "border-gray-200 bg-slate-50 text-slate-600"
                  )}
                >
                  <p className={cn("font-medium", isDark ? "text-neutral-200" : "text-slate-800")}>
                    Пароль должен содержать:
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li
                      className={
                        passwordChecks.hasValidLength
                          ? "text-emerald-500"
                          : isDark
                            ? "text-neutral-400"
                            : "text-slate-500"
                      }
                    >
                      10–50 символов
                    </li>
                    <li
                      className={
                        passwordChecks.hasUppercase
                          ? "text-emerald-500"
                          : isDark
                            ? "text-neutral-400"
                            : "text-slate-500"
                      }
                    >
                      минимум 1 заглавную букву
                    </li>
                    <li
                      className={
                        passwordChecks.hasDigit
                          ? "text-emerald-500"
                          : isDark
                            ? "text-neutral-400"
                            : "text-slate-500"
                      }
                    >
                      минимум 1 цифру
                    </li>
                  </ul>
                </div>
              )}

              {error && (
                <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                  {error}
                </p>
              )}

              {message && (
                <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:from-neutral-700 disabled:to-neutral-700 disabled:text-neutral-400"
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
