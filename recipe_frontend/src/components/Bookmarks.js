import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../utils/api";
import { useUser } from "../context/UserContext";

export default function Bookmarks() {
  const { token, user } = useUser();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listBookmarks(token)
      .then((bms) => setBookmarks(bms))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="spinner" />;
  return (
    <div className="bookmarks">
      <h2>Saved Recipes</h2>
      {!bookmarks.length && (
        <div style={{ color: "#888", marginTop: 25 }}>
          You haven't saved any recipes yet.
        </div>
      )}
      <div className="recipe-grid">
        {bookmarks.map(({ recipe }) =>
          recipe ? (
            <div className="recipe-card" key={recipe.id}>
              <Link className="recipe-card-title" to={`/recipe/${recipe.id}`}>
                {recipe.title}
              </Link>
              <div className="recipe-card-tags">
                {(recipe.tag_names || []).map((t) => (
                  <span className="recipe-card-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="recipe-card-footer">
                <Link className="btn btn-accent" to={`/recipe/${recipe.id}`}>
                  View
                </Link>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
