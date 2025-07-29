import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../utils/api";
import { useUser } from "../context/UserContext";

export default function RecipeForm({ editMode = false }) {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [ingredientNames, setIngredientNames] = useState([]);
  const [tagNames, setTagNames] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, token } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // For tag/ingredient suggestions
    api.listRecipes({ limit: 50 }).then((list) => {
      const tagsSet = new Set();
      const ingSet = new Set();
      for (const r of list) {
        (r.tag_names || []).forEach((t) => tagsSet.add(t));
        (r.ingredient_names || []).forEach((i) => ingSet.add(i));
      }
      setAllTags(Array.from(tagsSet));
      setAllIngredients(Array.from(ingSet));
    });
  }, []);

  useEffect(() => {
    if (editMode && id) {
      setLoading(true);
      api.getRecipe(id)
        .then((r) => {
          // Only owner can edit; enforce at UI & backend
          setTitle(r.title || "");
          setDescription(r.description || "");
          setSteps(r.steps || "");
          setIngredientNames(r.ingredient_names || []);
          setTagNames(r.tag_names || []);
        })
        .catch(() => setAlert("Could not load recipe."))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [editMode, id]);

  function handleMultiValueChange(str, setter) {
    // comma, semicolon or enter splits value
    setter(
      str
        .split(/[\n,;]+/)
        .map((v) => v.trim())
        .filter(Boolean)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setAlert("Title is required.");
      return;
    }
    setLoading(true);
    setAlert("");
    const body = {
      title,
      description,
      steps,
      ingredient_names: ingredientNames,
      tag_names: tagNames,
    };
    const doRequest = editMode
      ? api.updateRecipe(token, id, body)
      : api.createRecipe(token, body);

    doRequest
      .then((r) => navigate(`/recipe/${r.id}`))
      .catch((e) => setAlert(e.message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="form-box" style={{maxWidth:520}}>
      <h2>{editMode ? "Edit Recipe" : "Add a New Recipe"}</h2>
      <form onSubmit={handleSubmit}>
        {alert && <div className="alert">{alert}</div>}
        <label>Title *</label>
        <input
          type="text"
          required
          minLength={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <label>Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>Steps (multiple lines separate steps)</label>
        <textarea
          rows={4}
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
        <label>
          Ingredients <span style={{fontWeight:400, fontSize:".95em"}}>(comma, semicolon, or newline separated)</span>
        </label>
        <textarea
          rows={2}
          value={ingredientNames.join(", ")}
          placeholder="e.g. flour, sugar, eggs"
          onChange={(e) => handleMultiValueChange(e.target.value, setIngredientNames)}
        />
        {allIngredients.length > 0 && (
          <div style={{ fontSize: ".88em", color: "#888" }}>
            Known ingredients:&nbsp;
            {allIngredients.map((i) => (
              <span key={i} style={{ marginRight: 8 }}>{i}</span>
            ))}
          </div>
        )}
        <label>
          Tags <span style={{fontWeight:400, fontSize:".95em"}}>(optional, comma, semicolon, or newline)</span>
        </label>
        <textarea
          rows={1}
          value={tagNames.join(", ")}
          placeholder="e.g. dessert, vegan"
          onChange={(e) => handleMultiValueChange(e.target.value, setTagNames)}
        />
        {allTags.length > 0 && (
          <div style={{ fontSize: ".88em", color: "#888" }}>
            Known tags:&nbsp;
            {allTags.map((t) => (
              <span key={t} style={{ marginRight: 8 }}>{t}</span>
            ))}
          </div>
        )}
        <button className="btn" disabled={loading}>
          {loading ? "Saving..." : editMode ? "Update" : "Create Recipe"}
        </button>
      </form>
    </div>
  );
}
