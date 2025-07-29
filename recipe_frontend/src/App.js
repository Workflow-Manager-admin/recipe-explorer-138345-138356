import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import RecipeGrid from "./components/RecipeGrid";
import RecipeDetail from "./components/RecipeDetail";
import AuthPage from "./components/AuthPage";
import MyRecipes from "./components/MyRecipes";
import RecipeForm from "./components/RecipeForm";
import Bookmarks from "./components/Bookmarks";
import UserContextProvider, { useUser } from "./context/UserContext";
import "./App.css";

// PUBLIC_INTERFACE
function AppContent() {
  const { user, token, isLoading } = useUser();
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterIngredient, setFilterIngredient] = useState("");

  if (isLoading) return <div className="center-screen">Loading...</div>;

  return (
    <Router>
      <Navbar user={user} />
      <div className="main-grid">
        <Sidebar
          search={search}
          setSearch={setSearch}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          filterIngredient={filterIngredient}
          setFilterIngredient={setFilterIngredient}
        />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <RecipeGrid
                  search={search}
                  tag={filterTag}
                  ingredient={filterIngredient}
                />
              }
            />
            <Route path="/login" element={!user ? <AuthPage mode="login" /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <AuthPage mode="register" /> : <Navigate to="/" />} />
            <Route path="/recipe/new" element={user ? <RecipeForm /> : <Navigate to="/login" />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/recipe/:id/edit" element={user ? <RecipeForm editMode /> : <Navigate to="/login" />} />
            <Route path="/my-recipes" element={user ? <MyRecipes /> : <Navigate to="/login" />} />
            <Route path="/bookmarks" element={user ? <Bookmarks /> : <Navigate to="/login" />} />
            <Route path="*" element={<div className="not-found">Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Theme color at top level, user context at root
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <UserContextProvider>
      <div className="App">
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <AppContent />
      </div>
    </UserContextProvider>
  );
}

export default App;
