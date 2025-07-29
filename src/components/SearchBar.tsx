import React from 'react';
import type {SearchBarProps} from '../types';
import './SearchBar.css';

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Поиск квартир..."
                className="search-input"
            />
            <button onClick={onSearch} className="search-button">
                🔍
            </button>
            <button className="filter-button">
                ⚙️
            </button>
        </div>
    );
};

export default SearchBar;