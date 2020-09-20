import React from "react";

import ClassicTabStyles from "./ClassicTab.module.css";

type Props = {
  renderLinks: () => React.ReactNode;
};

const ClassicTab: React.FC<Props> = ({ renderLinks }) => {
  return (
    <ul className={`${ClassicTabStyles["classic-tab"]}`}>{renderLinks()}</ul>
  );
};

export default ClassicTab;
