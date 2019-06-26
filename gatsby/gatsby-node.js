const path = require('path');
const languages = require('./src/languages');

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'news') {
    // Create a new field on Gatsby side to later store information about translations of a given node.

    createNodeField({
      name: 'translations',
      node,
      value: [],
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const newsPerPage = 10;
  const pagesPerLanguage = {};

  const result = await graphql(`
    query getAllNews {
      allNews {
        edges {
          node {
            id
            path {
              alias
              langcode
            }
          }
        }
      }
    }
  `);

  const { allNews } = result.data;
  const newsNodes = allNews.edges;

  newsNodes.forEach(({ node }) => {
    const { alias, langcode } = node.path;

    if (alias && langcode) {
      const pathInGatsby = `/${langcode}${alias}`;

      createPage({
        path: pathInGatsby,
        component: path.resolve('./src/templates/news.jsx'),
        context: {
          alias,
          langcode,
        },
      });

      if (!pagesPerLanguage[langcode]) {
        pagesPerLanguage[langcode] = [];
      }

      const nodeExists = pagesPerLanguage[langcode].find(
        n => n.path.alias === alias && n.path.langcode === langcode
      );

      if (!nodeExists) pagesPerLanguage[langcode].push(node);
    }
  });

  // Create news sections with paginations for each language.
  Object.keys(pagesPerLanguage).forEach(language => {
    const items = pagesPerLanguage[language];
    const languageRegex = `//${language}//`;
    const numPages = Math.ceil(items.length / newsPerPage);

    /* eslint-disable-next-line compat/compat */
    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/${language}/news` : `/${language}/news/${i + 1}`,
        component: path.resolve('./src/templates/news-pagination.jsx'),
        context: {
          limit: newsPerPage,
          skip: i * newsPerPage,
          numPages,
          currentPage: i + 1,
          locale: language,
          languageRegex,
        },
      });
    });
  });
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  try {
    return languages.langs.map(lang => {
      const localizedPath = `/${lang}${page.path}`;
      const languageRegex = `//${lang}//`;

      const localePage = {
        ...page,
        path: localizedPath,
        // Be extra careful with context: https://www.gatsbyjs.org/docs/creating-and-modifying-pages/#pass-context-to-pages
        context: {
          ...page.context,
          locale: lang,
          languageRegex,
        },
      };

      // Not working yet.
      // @see https://github.com/gatsbyjs/gatsby/issues/15101
      if (localePage.path.match(/^\/[a-z]{2}\/404\/$/)) {
        localePage.matchPath = `/${lang}/*`;
      }

      deletePage(page);
      return createPage(localePage);
    });
  } catch (error) {
    throw error;
  }
};
