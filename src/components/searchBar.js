import { React, useState } from "react";
import "./search.css";

export default function SearchBar({ onSearch }) {
  const [search, setSearch] = useState('');
  const searchItems = (value) => {
    setSearch(value);
    onSearch(value);
  };

  return (
    <div>
      <input
        className="search"
        type="text"
        placeholder="Search for name"
        value={search}
        onChange={(event) => searchItems(event.target.value)}
      />
    </div>
  );
}
