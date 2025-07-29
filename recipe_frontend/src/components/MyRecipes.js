import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../utils/api";
import { useUser } from "../context/UserContext";

export default function MyRecipes() {
  const { token, user } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await api.listRecipes({ limit: 100 });
      setRecipes(all.filter((r) => r.owner_id === user?.id));
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="spinner" />;
  return (
    <div className="my-recipes">
      <h2>My Recipes</h2>
      <Link to="/recipe/new" className="btn" style={{marginBottom: 16}}>+ Add Recipe</Link>
      {!recipes.length && (
        <div style={{ color: "#888", marginTop: 25 }}>You haven't added any recipes yet.</div>
      )}
      <div className="recipe-grid">
        {recipes.map((r) => (
          <div className="recipe-card" key={r.id}>
            <Link className="recipe-card-title" to={`/recipe/${r.id}`}>
              {r.title}
            </Link>
            <div className="recipe-card-tags">
              {(r.tag_names || []).map((t) => (
                <span className="recipe-card-tag" key={t}>{t}</span>
              ))}
            </div>
            <div className="recipe-card-footer">
              <Link className="btn btn-secondary" style={{marginRight:4}} to={`/recipe/${r.id}/edit`}>
                Edit
              </Link>
              <Link className="btn btn-accent" to={`/recipe/${r.id}`}>
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
