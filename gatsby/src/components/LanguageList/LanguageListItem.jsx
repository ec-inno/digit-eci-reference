import React, { useContext } from 'react';
import PropTypes from 'prop-types';

// This Link is specific to this component. It has the logic of an ECL link component to handle icons, but also at the same time uses GatsbyJS's Link link for it's benefits.
import Link from '../Link/LinkGatsby';

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
      href={href}
      label={label}
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
