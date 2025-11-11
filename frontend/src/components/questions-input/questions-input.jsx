import React, { useState } from "react";
import PropTypes from "prop-types";
import "./questions-input.css";
import { filterElements } from "./filterElements";

// kodas isskaidytas i mazesnes funkcijas, kad sumazinti ciklomatini sudetinguma

function QuestionsInput({ selectedCheckboxes, setSelectedCheckboxes }) {
  const [visibleIndexes, setVisibleIndexes] = useState([]);

  const toggleVisibility = (index) => {
    setVisibleIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCheckboxChange = (category, item) => {
    setSelectedCheckboxes((prev) => {
      const updated = { ...prev };
      const selectedItems = updated[category] || [];
      const exists = selectedItems.some((i) => i.metaname === item.metaname);

      updated[category] = exists
        ? selectedItems.filter((i) => i.metaname !== item.metaname)
        : [...selectedItems, item];

      return updated;
    });
  };

  const selectAll = () => {
    const allSelected = filterElements.every(
      ({ title, items }) =>
        (selectedCheckboxes[title] || []).length === items.length
    );

    if (allSelected) {
      setSelectedCheckboxes({});
    } else {
      const updated = {};
      for (const { title, items } of filterElements) {
        updated[title] = [...items];
      }
      setSelectedCheckboxes(updated);
    }
  };

  const renderCategoryItems = (categoryTitle, items) => {
    return items.map((item) => (
      <div className="row" key={item.name}>
        <input
          type="checkbox"
          id={`${categoryTitle}-${item.name}`}
          name={item.name}
          checked={
            selectedCheckboxes[categoryTitle]?.some(
              (i) => i.metaname === item.metaname
            ) || false
          }
          onChange={() => handleCheckboxChange(categoryTitle, item)}
        />
        <label htmlFor={`${categoryTitle}-${item.name}`}>{item.name}</label>
      </div>
    ));
  };

  const renderCategory = (element, index) => {
    const isVisible = visibleIndexes.includes(index);

    return (
      <div className="item" key={element.title}>
        <button type="button" onClick={() => toggleVisibility(index)}>
          <span>{element.title}</span>
          <div className={`icon ${isVisible ? "rotate" : ""}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 21 21"
              fill="none"
            >
              {" "}
              <path
                d="M2.14603 5.67C2.2324 5.6695 2.31802 5.68605 2.39797 5.71871C2.47793 5.75137 2.55065 5.79949 2.61197 5.86031L10.0342 13.2825C10.0952 13.344 10.1677 13.3928 10.2477 13.4261C10.3277 13.4595 10.4135 13.4766 10.5001 13.4766C10.5867 13.4766 10.6725 13.4595 10.7525 13.4261C10.8324 13.3928 10.905 13.344 10.966 13.2825L18.3751 5.86031C18.4361 5.7988 18.5087 5.74998 18.5887 5.71666C18.6686 5.68335 18.7544 5.66619 18.841 5.66619C18.9277 5.66619 19.0134 5.68335 19.0934 5.71666C19.1734 5.74998 19.246 5.7988 19.307 5.86031C19.4292 5.98327 19.4978 6.1496 19.4978 6.32297C19.4978 6.49634 19.4292 6.66267 19.307 6.78562L11.8913 14.2144C11.5158 14.5707 11.0178 14.7694 10.5001 14.7694C9.98238 14.7694 9.4844 14.5707 9.10885 14.2144L1.6801 6.78562C1.58979 6.6935 1.52864 6.5768 1.50429 6.45011C1.47994 6.32343 1.49347 6.19237 1.54319 6.07333C1.59291 5.95429 1.6766 5.85255 1.78382 5.78081C1.89104 5.70908 2.01703 5.67053 2.14603 5.67Z"
                fill="black"
              />{" "}
            </svg>
          </div>
        </button>

        <div className={`content ${isVisible ? "visible" : ""}`}>
          {isVisible && renderCategoryItems(element.title, element.items)}
        </div>

        <div className="separator"></div>
      </div>
    );
  };

  return (
    <div className="questions-input">
      <div className="heading">
        <div className="text">
          <p className="main">Pasirinkite filtrus</p>
          <p className="sub">Bent 5 iš bet kurios kategorijos</p>
        </div>
        <div className="select-all">
          <button type="button" onClick={selectAll}>
            Pasirinkti visus
          </button>
        </div>
      </div>

      <div className="column">
        {filterElements.map((element, index) => renderCategory(element, index))}
      </div>
    </div>
  );
}

// istaisytas code smell - prideta prop validacija
QuestionsInput.propTypes = {
  selectedCheckboxes: PropTypes.object.isRequired,
  setSelectedCheckboxes: PropTypes.func.isRequired,
};

export default QuestionsInput;
