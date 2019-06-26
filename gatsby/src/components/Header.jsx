import React from 'react';
import { Link } from 'gatsby';

import logoPaths from '../utils/logoPaths';
import { map as languageMap, defaultLangKey } from '../languages';

import SiteName from './SiteName';
import LanguageListOverlay from './LanguageList/LanguageListOverlayWithContext';
import LanguageSelector from './LanguageSelector';

const Header = ({ languages, location, contentTranslations }) => {
  let items = [];
  let logo = logoPaths[defaultLangKey];
  let opensOverlay = false;

  const { pathname } = location;
  const pathParts = pathname.split('/').filter(p => p);
  const langcodeCurrent = pathParts.shift();
  const urlPath = pathParts.join('/');

  // Change logo to a language-specific one, if applicable.
  if (langcodeCurrent !== defaultLangKey) {
    logo = logoPaths[langcodeCurrent];
  }

  const translationSet = contentTranslations.find(contentTranslation => {
    return (
      contentTranslation.path.alias === `/${urlPath}` &&
      contentTranslation.path.langcode === langcodeCurrent
    );
  });

  // Are there translations for this content page?
  if (
    translationSet &&
    translationSet.translations &&
    translationSet.translations.length
  ) {
    // Add translations.
    items = translationSet.translations.map(translation => {
      // translation is a structure of data coming from jsonapi about a pathauto alias.
      // Because gatsby has already created content matching this path, we only need to reformat the information.
      const { alias, langcode } = translation;

      return {
        href: `/${langcode}${alias}`,
        lang: langcode,
        label: languageMap[langcode],
      };
    });

    // Add currently active language.
    items.push({
      href: pathname,
      lang: langcodeCurrent,
      label: languageMap[langcodeCurrent],
      isActive: true,
    });

    // Enable overlay.
    opensOverlay = true;
  }
  // The page is based on drupal content, not translations.
  else if (!translationSet && pathParts.length > 1) {
    opensOverlay = false;
  }
  // The page is programatic: /news, /about, etc. Translation pattern is predictable.
  else {
    items = languages.map(language => {
      const href = urlPath
        ? `/${language.lang}/${urlPath}`
        : `/${language.lang}`;
      const isActive = href.includes(langcodeCurrent);

      return {
        href,
        isActive,
        ...language,
      };
    });

    // Enable the overlay.
    opensOverlay = true;
  }

  // Correct order.
  items = items.sort((a, b) =>
    a.lang < b.lang ? -1 : a.lang > b.lang ? 1 : 0
  );

  return (
    <>
      <header className="ecl-site-header">
        <div className="ecl-site-header__container ecl-container">
          <div className="ecl-site-header__banner">
            <Link
              className="ecl-link ecl-link--standalone"
              to={`/${langcodeCurrent}`}
              aria-label="European Union"
            >
              <img
                alt="European Union logo"
                title="European Union"
                className="ecl-site-header__logo-image"
                src={logo}
              />
            </Link>
            <LanguageSelector
              code={langcodeCurrent}
              name={languageMap[langcodeCurrent]}
              href="#"
              opensOverlay={opensOverlay}
            />
          </div>
        </div>
        <SiteName currentLanguage={langcodeCurrent} />
      </header>
      <LanguageListOverlay
        closeLabel="Close"
        title="Select your language"
        items={items}
      />
    </>
  );
};

export default Header;
