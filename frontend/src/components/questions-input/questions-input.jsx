import React, { useState } from "react";
import "./questions-input.css";
import { filterElements } from "./filterElements";

function QuestionsInput({ selectedCheckboxes, setSelectedCheckboxes }) {
  const [visibleIndexes, setVisibleIndexes] = useState([]);

  const handleContentDisplay = (index) => {
    setVisibleIndexes((prevIndexes) =>
      prevIndexes.includes(index)
        ? prevIndexes.filter((i) => i !== index)
        : [...prevIndexes, index]
    );
  };

  const handleCheckboxChange = (category, items) => {
    setSelectedCheckboxes((prev) => {
      const updated = { ...prev };

      if (!updated[category]) {
        updated[category] = [];
      }

      const exists = updated[category].some(
        (i) => i.metaname === items.metaname
      );

      if (exists) {
        updated[category] = updated[category].filter(
          (i) => i.metaname !== items.metaname
        );
      } else {
        updated[category].push(items);
      }
      return updated;
    });
  };

  return (
    <div className="questions-input">
      <div className="heading">
        <p className="main">Pasirinkite filtrus</p>
        <p className="sub">Bent 5 iš bet kurios kategorijos</p>
      </div>
      <div className="column">
        {filterElements.map((element, index) => {
          return (
            <div className="item" key={index}>
              <button type="button" onClick={() => handleContentDisplay(index)}>
                <span>{element.title}</span>
                <div
                  className={`icon ${
                    visibleIndexes.includes(index) ? "rotate" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 21 21"
                    fill="none"
                  >
                    <path
                      d="M2.14603 5.67C2.2324 5.6695 2.31802 5.68605 2.39797 5.71871C2.47793 5.75137 2.55065 5.79949 2.61197 5.86031L10.0342 13.2825C10.0952 13.344 10.1677 13.3928 10.2477 13.4261C10.3277 13.4595 10.4135 13.4766 10.5001 13.4766C10.5867 13.4766 10.6725 13.4595 10.7525 13.4261C10.8324 13.3928 10.905 13.344 10.966 13.2825L18.3751 5.86031C18.4361 5.7988 18.5087 5.74998 18.5887 5.71666C18.6686 5.68335 18.7544 5.66619 18.841 5.66619C18.9277 5.66619 19.0134 5.68335 19.0934 5.71666C19.1734 5.74998 19.246 5.7988 19.307 5.86031C19.4292 5.98327 19.4978 6.1496 19.4978 6.32297C19.4978 6.49634 19.4292 6.66267 19.307 6.78562L11.8913 14.2144C11.5158 14.5707 11.0178 14.7694 10.5001 14.7694C9.98238 14.7694 9.4844 14.5707 9.10885 14.2144L1.6801 6.78562C1.58979 6.6935 1.52864 6.5768 1.50429 6.45011C1.47994 6.32343 1.49347 6.19237 1.54319 6.07333C1.59291 5.95429 1.6766 5.85255 1.78382 5.78081C1.89104 5.70908 2.01703 5.67053 2.14603 5.67Z"
                      fill="black"
                    />
                  </svg>
                </div>
              </button>
              <div
                className={`content ${
                  visibleIndexes.includes(index) ? "visible" : ""
                }`}
              >
                {visibleIndexes.includes(index) &&
                  element.items.map((items, subIndex) => {
                    return (
                      <div className="row" key={subIndex}>
                        <input
                          type="checkbox"
                          id={`${element.title}-${items.name}`}
                          name={items.name}
                          checked={
                            selectedCheckboxes[element.title]?.some(
                              (i) => i.metaname === items.metaname
                            ) || false
                          }
                          onChange={() =>
                            handleCheckboxChange(element.title, items)
                          }
                        />
                        <label htmlFor={items.name}>{items.name}</label>
                      </div>
                    );
                  })}
              </div>
              <div className="separator"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionsInput;
