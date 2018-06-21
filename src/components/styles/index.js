// Example of CSS, SASS and LESS styles being used together

// ----------------------
// IMPORTS

/* NPM */
import React from 'react';

/* App */

// Styles
import sass from './styles.scss';

// ----------------------

export default () => (
  <ul className={css.styleExamples}>
    <li className={sass.example}>Styled by SASS</li>
  </ul>
);
