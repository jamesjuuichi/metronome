import React from "react";
import cx from "classnames";
import style from "./Grid.module.css";

export default function Grid({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cx(style.grid, className)}>{children}</div>;
}
