import React, { useState, useEffect, useRef } from "react";

import DropdownStyles from "./Dropdown.module.css";

interface Props {
  children: React.ReactElement[];
}

const DropdownBtn: React.FC<Props> = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeDropdown(e: Event) {
      if (!elRef.current?.contains(e.target as HTMLElement)) {
        setShowDropdown(false);
      }
    }

    window.addEventListener("click", closeDropdown);
    return () => {
      window.removeEventListener("click", closeDropdown);
    };
  });

  return (
    <div className={DropdownStyles["dropdown-container"]}>
      <div
        ref={elRef}
        onClick={() => setShowDropdown((state) => !state)}
        className="dropdown-btn"
      >
        {children[0]}
      </div>
      {showDropdown && children[1]}
    </div>
  );
};

export default DropdownBtn;
