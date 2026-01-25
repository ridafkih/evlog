export default defineAppConfig({
  socials: {
    x: 'https://x.com/evlog_js',
    github: 'https://github.com/hugorcd/evlog',
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'zinc',
    },
    button: {
      slots: {
        base: 'active:translate-y-px transition-transform duration-300',
      },
    },
    prose: {
      slots: {
        h1: {
          base: 'font-serif tracking-tight',
        },
        h2: {
          base: 'font-serif tracking-tight',
        },
        h3: {
          base: 'font-serif tracking-tight',
        },
        h4: {
          base: 'font-serif tracking-tight',
        },
      },
    },
    contentSurround: {
      variants: {
        direction: {
          left: {
            linkLeadingIcon: ['group-active:translate-x-0',],
          },
          right: {
            linkLeadingIcon: ['group-active:translate-x-0',],
          },
        },
      },
    },
  },
})
