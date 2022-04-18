import React from 'react';
import cx from 'classnames';

import Grid from '../Grid';
import BpmConfig from './BpmConfig';
import BeatConfig from './BeatConfig';
import PatternConfig from './PatternConfig';
import BeatPlayer from './BeatPlayer';

import style from './style.module.scss';

export default function Controller() {
  return (
    <div className={style.container}>
      <div className={style.scaler}>
        <Grid className={cx(style.controller, style.template)}>
          <BpmConfig />
          <BeatConfig />
          <PatternConfig />
          <BeatPlayer />
        </Grid>
      </div>
    </div>
  );
}
