import React from 'react';
import classnames from 'classnames';
import { Link } from 'gatsby';

import data from './data';

const Menu = ({ location }) => {
  const locations = location.pathname.split('/').filter(p => p);
  const [language, path] = locations;
  const links = data[language];

  return (
    <nav className="eci-menu">
      <div className="ecl-container">
        <ul className="eci-menu__list">
          {links && links.length ? (
            links.map((link, key) => {
              const { label, href } = link;
              let classActive = '';

              if (
                // In case of home page.
                (href === '/' && path === undefined) ||
                // Or any other internal one.
                (path && href.includes(path))
              ) {
                classActive = 'eci-menu__option--is-selected';
              }

              const classNames = classnames(classActive, 'eci-menu__option');

              return (
                <li className={classNames} key={key}>
                  <Link
                    to={
                      // If the user has left a base path, correct it, as there's always a language.
                      href === '/' ? `/${language}` : `/${language}${href}`
                    }
                    className="eci-menu__link ecl-link"
                  >
                    {label}
                  </Link>
                </li>
              );
            })
          ) : (
            <li className="eci-menu__option eci-menu__option--is-selected">
              <a href={`/${language}`} className="eci-menu__link ecl-link">
                Home
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
