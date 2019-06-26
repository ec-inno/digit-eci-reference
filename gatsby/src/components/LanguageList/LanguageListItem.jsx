import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'gatsby';

import Context, { SET_LANGUAGE_OVERLAY_VISIBILITY } from '../../Context';

// As close as possible to https://github.com/ec-europa/europa-component-library/blob/v2-dev/src/systems/ec/implementations/react/page-structure/language-list/src/LanguageListItem.jsx
const LanguageListItem = ({ label, lang, href, isActive, isOverlay }) => {
  const { dispatch } = useContext(Context);

  return (
    <Link
      onClick={() =>
        dispatch({
          type: SET_LANGUAGE_OVERLAY_VISIBILITY,
          hideOverlay: true,
        })
      }
      lang={lang}
      hrefLang={lang}
      to={href}
      className="ecl-language-list__link ecl-link ecl-link--standalone"
      {...(isActive && {
        icon: {
          shape: 'ui--check',
          size: 'xs',
        },
      })}
      {...(lang && {
        lang,
        hrefLang: lang,
        ...(isOverlay ? { rel: 'alternate' } : {}),
      })}
    >
      {label}
    </Link>
  );
};

LanguageListItem.propTypes = {
  label: PropTypes.string,
  lang: PropTypes.string,
  href: PropTypes.string,
  isActive: PropTypes.bool,
  isOverlay: PropTypes.bool,
};

LanguageListItem.defaultProps = {
  label: '',
  lang: '',
  href: '',
  isActive: false,
  isOverlay: false,
};

export default LanguageListItem;
