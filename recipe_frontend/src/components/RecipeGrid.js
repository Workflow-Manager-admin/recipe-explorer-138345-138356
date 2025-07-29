import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../utils/api";
import { useUser } from "../context/UserContext";

export default function RecipeGrid({ search, tag, ingredient }) {
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { token, user } = useUser();

  // Obtain bookmarks if signed in
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.listRecipes({ q: search, tag, ingredient, limit: 32 }),
      user?.id ? api.listBookmarks(token) : Promise.resolve([]),
    ])
      .then(([rcps, bms]) => {
        setRecipes(rcps);
        setBookmarkedIds(
          new Set(bms.map((b) => (b.recipe ? b.recipe.id : null)).filter(Boolean))
        );
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [search, tag, ingredient, user, token]);

  function handleBookmark(r) {
    if (!user) return; // Should be protected via login
    if (!bookmarkedIds.has(r.id)) {
      api.bookmarkRecipe(token, r.id)
        .then(() => setBookmarkedIds(new Set([...bookmarkedIds, r.id])));
    } else {
      api.unbookmarkRecipe(token, r.id)
        .then(() => {
          const newSet = new Set([...bookmarkedIds]);
          newSet.delete(r.id);
          setBookmarkedIds(newSet);
        });
    }
  }

  if (loading) return <div className="spinner" />;
  if (!recipes.length)
    return (
      <div style={{ color: "#888", marginTop: 44 }}>No recipes found.</div>
    );

  return (
    <div className="recipe-grid">
      {recipes.map((r) => (
        <div key={r.id} className="recipe-card">
          <div>
            <Link to={`/recipe/${r.id}`} className="recipe-card-title">
              {r.title}
            </Link>
            <div className="recipe-card-tags">
              {(r.tag_names || []).map((t) => (
                <span className="recipe-card-tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <div className="recipe-card-description">
              {r.description ? r.description.slice(0, 85) : ""}
              {r.description && r.description.length > 85 && "..."}
            </div>
          </div>
          <div className="recipe-card-footer">
            <span className="recipe-card-owner">
              by {r.owner_id === user?.id ? "You" : `User #${r.owner_id}`}
            </span>
            {user && (
              <button
                className={
                  "recipe-card-bookmark" +
                  (bookmarkedIds.has(r.id) ? " bookmarked" : "")
                }
                title={
                  bookmarkedIds.has(r.id)
                    ? "Remove from bookmarks"
                    : "Save to bookmarks"
                }
                onClick={() => handleBookmark(r)}
              >
                {bookmarkedIds.has(r.id) ? "★" : "☆"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
