import clsx from "clsx";
import React from "react";

const Title = ({ title, className }) => {
  return (
    <h2 className={clsx("text-2xl font-bold capitalize", className)}>
      {title}
    </h2>
  );
};

export default Title;