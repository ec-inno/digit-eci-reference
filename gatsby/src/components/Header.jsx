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
  const [langcode, urlPath] = pathname.split('/').filter(p => p);

  // Change logo to a language-specific one, if applicable.
  if (langcode !== defaultLangKey) {
    logo = logoPaths[langcode];
  }

  const translationSet = contentTranslations.find(contentTranslation => {
    return (
      contentTranslation.path.alias === `/${urlPath}` &&
      contentTranslation.path.langcode === langcode
    );
  });

  // Are there translations for this content page?
  if (
    translationSet &&
    translationSet.translations &&
    translationSet.translations.length
  ) {
    items = translationSet.translations.map(translation => {
      // translation is a structure of data coming from jsonapi about a pathauto alias.
      // Because gatsby has already created content matching this path, we only need to reformat the information.
      const { alias, langcode } = translation;

      return {
        href: `/${langcode}${alias}`,
        lang: langcode,
        label: languageMap[langcode],
        // src/components/LanguageList/LanguageListItem.jsx is not ready yet for isActive
        // isActive: langcode === langcode,
      };
    });
    opensOverlay = true;
  } else {
    items = languages.map(language => ({
      href: urlPath ? `/${language.lang}/${urlPath}` : `/${language.lang}`,
      ...language,
    }));
    opensOverlay = true;
  }

  return (
    <>
      <header className="ecl-site-header">
        <div className="ecl-site-header__container ecl-container">
          <div className="ecl-site-header__banner">
            <Link
              className="ecl-link ecl-link--standalone"
              to={`/${langcode}`}
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
              code={langcode}
              name={languageMap[langcode]}
              href="#"
              opensOverlay={opensOverlay}
            />
          </div>
        </div>
        <SiteName currentLanguage={langcode} />
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
