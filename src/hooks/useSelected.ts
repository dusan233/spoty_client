import React, { useEffect, useState, useRef } from "react";

const useSelected = (): [boolean, React.RefObject<HTMLDivElement>] => {
  const [selected, setSelected] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selectRow = (e: globalThis.MouseEvent) => {
      if (rowRef.current?.contains(e.target as HTMLElement)) {
        setSelected(true);
      } else {
        setSelected(false);
      }
    };
    window.addEventListener("click", selectRow);

    return () => {
      window.removeEventListener("click", selectRow);
    };
  }, []);

  return [selected, rowRef];
};

export default useSelected;
