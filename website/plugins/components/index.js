/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const {normalizeUrl, docuHash, aliasedSitePath} = require('@docusaurus/utils');
const rightToc = require('@docusaurus/mdx-loader/src/remark/rightToc');

const {generateComponentPosts} = require('./componentUtils');

const DEFAULT_OPTIONS = {
  path: 'components', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'components', // URL Route.
  include: ['**/*.{md,mdx}'], // Extensions to include.
  componentPostComponent: '@theme/ComponentPage',
  remarkPlugins: [],
  rehypePlugins: [],
  truncateMarker: /<!--\s*(truncate)\s*-->/, // string or regex
};

module.exports = pluginContentComponent;

function pluginContentComponent(context, opts) {
  const options = {...DEFAULT_OPTIONS, ...opts};
  const {siteDir, generatedFilesDir} = context;
  const contentPath = path.resolve(siteDir, options.path);
  const dataDir = path.join(
    generatedFilesDir,
    'components',
  );

  return {
    name: 'components',

    getPathsToWatch() {
      const {include = []} = options;
      const globPattern = include.map(pattern => `${contentPath}/${pattern}`);
      return [...globPattern];
    },

    // Fetches component contents and returns metadata for the necessary routes.
    async loadContent() {
      const componentPosts = await generateComponentPosts(contentPath, context, options);
      if (!componentPosts) {
        return null;
      }

      return {
        componentPosts,
      };
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }

      const {
        componentPostComponent,
      } = options;

      const aliasedSource = (source) =>
        `~component/${path.relative(dataDir, source)}`;
      const {addRoute, createData} = actions;
      const {
        componentPosts,
      } = content;

      // Create routes for component entries.
      await Promise.all(
        componentPosts.map(async componentPost => {
          const {metadata} = componentPost;
          await createData(
            // Note that this created data path must be in sync with metadataPath provided to mdx-loader
            `${docuHash(metadata.source)}.json`,
            JSON.stringify(metadata, null, 2),
          );

          addRoute({
            path: metadata.permalink,
            component: componentPostComponent,
            exact: true,
            modules: {
              content: metadata.source,
            },
          });
        }),
      );
    },

    configureWebpack(
      _config,
      isServer,
      {getBabelLoader, getCacheLoader},
    ) {
      const {rehypePlugins, remarkPlugins, truncateMarker} = options;
      return {
        resolve: {
          alias: {
            '~component': dataDir,
          },
        },
        module: {
          rules: [
            {
              test: /(\.mdx?)$/,
              include: [contentPath],
              use: [
                getCacheLoader(isServer),
                getBabelLoader(isServer),
                {
                  loader: '@docusaurus/mdx-loader',
                  options: {
                    remarkPlugins,
                    rehypePlugins,
                    // Note that metadataPath must be the same/ in-sync as the path from createData for each MDX
                    metadataPath: (mdxPath) => {
                      const aliasedSource = aliasedSitePath(mdxPath, siteDir);
                      return path.join(
                        dataDir,
                        `${docuHash(aliasedSource)}.json`,
                      );
                    },
                  },
                },
                {
                  loader: path.resolve(__dirname, './markdownLoader.js'),
                  options: {
                    truncateMarker,
                  },
                },
              ].filter(Boolean),
            },
          ],
        },
      };
    },
  };
}
