import React, { useEffect, useState } from "react";
import cross from "../../assets/images/cross-bad.svg";
import "./error-alert.css";

function Error({ message }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible) return null;

  return (
    <div className="error" onClick={() => setVisible(false)}>
      <div className="content">
        <div className="icon">
          <img src={cross} loading="lazy" alt="Error" />
        </div>
        <div className="text">{message}</div>
      </div>
    </div>
  );
}

export default Error;
