const path = require('node:path');

const sourceRoot = path.resolve(__dirname, '../src');
const modulesRoot = path.join(sourceRoot, 'modules');

function modulePath(filename) {
  const relative = path.relative(modulesRoot, filename);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return relative.split(path.sep);
}

module.exports = {
  rules: {
    'module-boundaries': {
      meta: {
        type: 'problem',
        schema: [],
        messages: {
          privateImport: 'Import {{module}} through its public index, not its implementation.',
          sharedImport: 'Shared UI must not import domain modules.',
        },
      },
      create(context) {
        const importer = context.filename;
        const owner = modulePath(importer)?.[0];

        function check(source) {
          if (!source || typeof source.value !== 'string') return;
          const specifier = source.value;
          const target = specifier.startsWith('@/')
            ? path.resolve(sourceRoot, specifier.slice(2))
            : specifier.startsWith('.')
              ? path.resolve(path.dirname(importer), specifier)
              : null;
          if (!target) return;
          const parts = modulePath(target);
          if (!parts || !parts[0]) return;
          const isCatalogData = target === path.join(modulesRoot, 'exercise-catalog', 'catalog');
          const isCoachApi = target === path.join(modulesRoot, 'ai-coach', 'server') &&
            ['coach+api.ts', 'session-coach+api.ts'].some((route) =>
              importer === path.resolve(sourceRoot, '../app/api', route));

          if (importer.startsWith(path.join(sourceRoot, 'ui') + path.sep)) {
            context.report({ node: source, messageId: 'sharedImport' });
          } else if (
            parts[0] !== owner &&
            parts.length > 1 &&
            !isCatalogData &&
            !isCoachApi &&
            !(parts.length === 2 && /^index(?:\.[cm]?[jt]sx?)?$/.test(parts[1]))
          ) {
            context.report({
              node: source,
              messageId: 'privateImport',
              data: { module: parts[0] },
            });
          }
        }

        return {
          ImportDeclaration: (node) => check(node.source),
          ExportNamedDeclaration: (node) => check(node.source),
          ExportAllDeclaration: (node) => check(node.source),
          ImportExpression: (node) => check(node.source),
          CallExpression: (node) => {
            if (node.callee.type === 'Identifier' && node.callee.name === 'require') {
              check(node.arguments[0]);
            }
          },
        };
      },
    },
  },
};
