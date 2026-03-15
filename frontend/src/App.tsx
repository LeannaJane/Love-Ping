import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-pink-50">
        <nav className="border-b border-pink-100 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link to="/" className="text-xl font-bold text-pink-600">
              LovePing
            </Link>

            <div className="flex gap-3">
              <Link
                to="/register"
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-pink-50"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
              >
                Login
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <main className="flex min-h-[calc(100vh-73px)] items-center justify-center p-6">
                <div className="max-w-2xl text-center">
                  <h1 className="text-5xl font-bold tracking-tight text-pink-600">
                    LovePing
                  </h1>
                  <p className="mt-4 text-lg text-gray-600">
                    Send quick little pings like hugs, kisses, love, and “message me”.
                  </p>
                </div>
              </main>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;