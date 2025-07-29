import React, { useEffect, useState } from "react";
import * as api from "../utils/api";

export default function Sidebar({
  search,
  setSearch,
  filterTag,
  setFilterTag,
  filterIngredient,
  setFilterIngredient,
}) {
  // For tag/ingredient dropdown population
  const [tags, setTags] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    api.listRecipes({ limit: 100 })
      .then((list) => {
        // Flatten tags/ingredients from many recipes
        const tagsSet = new Set();
        const ingSet = new Set();
        for (const r of list) {
          (r.tag_names || []).forEach((t) => tagsSet.add(t));
          (r.ingredient_names || []).forEach((i) => ingSet.add(i));
        }
        setTags(Array.from(tagsSet));
        setIngredients(Array.from(ingSet));
      });
  }, []);

  return (
    <aside className="sidebar">
      <section>
        <label htmlFor="search-box">Search</label>
        <input
          id="search-box"
          type="text"
          value={search}
          placeholder="Search recipes..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>
      <section>
        <label htmlFor="tag-filter">Filter by Tag</label>
        <select
          id="tag-filter"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        >
          <option value="">All</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </section>
      <section>
        <label htmlFor="ingredient-filter">Filter by Ingredient</label>
        <select
          id="ingredient-filter"
          value={filterIngredient}
          onChange={(e) => setFilterIngredient(e.target.value)}
        >
          <option value="">All</option>
          {ingredients.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </section>
    </aside>
  );
}
