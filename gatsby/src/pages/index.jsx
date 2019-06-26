import React from 'react';
import { graphql, Link } from 'gatsby';
import slugify from 'slugify';

import getCurrentLanguage from '../utils/getCurrentLanguage';

const Homepage = ({ data, location }) => {
  const currentLanguage = getCurrentLanguage(location);
  const news = data.allNews.edges;

  return (
    <main className="ecl-u-pv-xl">
      <div className="ecl-container">
        <h2 className="ecl-u-type-heading-2">Latest news</h2>
        <ul className="ecl-unordered-list">
          {news.map(newsNode => {
            const { node } = newsNode;
            const { id, title, oe_teaser, path } = node;
            const { langcode } = path;

            return (
              <li className="ecl-unordered-list__item" key={id}>
                <Link
                  to={`/${langcode}/news#${slugify(title, { lower: true })}`}
                  className="ecl-u-d-block ecl-link ecl-link--standalone"
                >
                  <strong>{title}</strong>
                </Link>

                {oe_teaser ? (
                  <div
                    key={id}
                    className="ecl-paragraph"
                    dangerouslySetInnerHTML={{
                      __html: oe_teaser.processed,
                    }}
                  />
                ) : (
                  ''
                )}
              </li>
            );
          })}
        </ul>
        <p className="ecl-u-type-paragraph">
          <Link
            className="ecl-link ecl-link--standalone"
            to={`/${currentLanguage}/news`}
          >
            See more news
          </Link>
        </p>
      </div>
    </main>
  );
};

export const query = graphql`
  query getNews($locale: String!, $languageRegex: String!) {
    allNews(
      filter: { id: { regex: $languageRegex }, langcode: { eq: $locale } }
      limit: 10
      sort: { order: DESC, fields: oe_publication_date }
    ) {
      edges {
        node {
          id
          title
          path {
            alias
            langcode
          }
          oe_teaser {
            processed
          }
        }
      }
    }
  }
`;

export default Homepage;
