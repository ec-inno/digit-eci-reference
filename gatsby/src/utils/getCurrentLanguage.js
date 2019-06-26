/**
 * Extracts current language from `location`.
 *
 * @param {Object} location
 * @returns {String}
 */
const getCurrentLanguage = location => {
  const locations = location.pathname.split('/').filter(p => p);
  const currentLanguage = locations[0];
  return currentLanguage;
};

export default getCurrentLanguage;
