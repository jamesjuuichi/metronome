import React from "react";

import Grid from "../Grid";
import BpmConfig from "./BpmConfig";
import BeatConfig from "./BeatConfig";
import PatternConfig from "./PatternConfig";

import style from "./style.module.scss";

export default function Controller() {
  return (
    <Grid className={style.controller}>
      <BpmConfig />
      <BeatConfig />
      <PatternConfig />
    </Grid>
  );
}
