import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as api from "../utils/api";
import { useUser } from "../context/UserContext";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");
  const { user, token } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getRecipe(id)
      .then((r) => {
        setRecipe(r);
        if (user)
          api
            .listBookmarks(token)
            .then((bms) =>
              setBookmarked(bms.some((bm) => bm.recipe && bm.recipe.id === r.id))
            );
        else setBookmarked(false);
      })
      .catch(() => setAlert("Recipe not found or API error."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [id, user, token]);

  function handleBookmark() {
    if (!user || !recipe) return;
    if (!bookmarked) {
      api.bookmarkRecipe(token, recipe.id).then(() => setBookmarked(true));
    } else {
      api.unbookmarkRecipe(token, recipe.id).then(() => setBookmarked(false));
    }
  }

  function handleDelete() {
    if (!user || !recipe) return;
    if (
      window.confirm(
        "Are you sure you want to delete this recipe? This cannot be undone."
      )
    ) {
      api
        .deleteRecipe(token, recipe.id)
        .then(() => navigate("/my-recipes"))
        .catch((e) => setAlert("Failed to delete: " + e.message));
    }
  }

  if (loading) return <div className="spinner" />;
  if (!recipe)
    return <div style={{ color: "#888", marginTop: 46 }}>{alert || "Recipe missing."}</div>;

  return (
    <div className="recipe-detail">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2>{recipe.title}</h2>
        {user && (
          <button
            className={
              "recipe-card-bookmark" + (bookmarked ? " bookmarked" : "")
            }
            onClick={handleBookmark}
            title={
              bookmarked
                ? "Remove from bookmarks"
                : "Bookmark this recipe"
            }
            aria-label="bookmark"
          >
            {bookmarked ? "★" : "☆"}
          </button>
        )}
      </div>
      <div className="recipe-detail-meta">
        Created by {recipe.owner_id === user?.id ? "You" : `User #${recipe.owner_id}`},{" "}
        {recipe.created_at &&
          new Date(recipe.created_at).toLocaleDateString()}
      </div>
      <hr />
      {alert && <div className="alert">{alert}</div>}
      <div className="recipe-detail-ingredients">
        <strong>Ingredients: </strong>
        {recipe.ingredient_names?.length ? (
          recipe.ingredient_names.map((i) => <span key={i}>{i}</span>)
        ) : (
          <span>None listed</span>
        )}
      </div>
      <div className="recipe-detail-tags">
        <strong>Tags:&nbsp;</strong>
        {recipe.tag_names?.length ? (
          recipe.tag_names.map((t) => <span key={t}>{t}</span>)
        ) : (
          <span>none</span>
        )}
      </div>
      <div className="recipe-detail-desc" style={{ margin: "16px 0" }}>
        <b>Description:</b>
        <div>
          {recipe.description && recipe.description.length
            ? recipe.description
            : <em>(Description not provided.)</em>}
        </div>
      </div>
      <div className="recipe-detail-steps" style={{ margin: "16px 0" }}>
        <b>Steps:</b>
        <div>
          {recipe.steps && recipe.steps.length
            ? <pre style={{ whiteSpace: "pre-line" }}>{recipe.steps}</pre>
            : <em>(No steps provided.)</em>}
        </div>
      </div>
      {user && user.id === recipe.owner_id && (
        <div className="recipe-detail-actions">
          <Link
            className="btn btn-secondary"
            to={`/recipe/${recipe.id}/edit`}
          >
            ✏️ Edit
          </Link>
          <button
            className="btn btn-accent"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
