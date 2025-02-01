module.exports = {
  //...
  safelist: [
    {
        pattern: /col-span-\d+/,
        variants: ['sm', 'md', 'lg', 'xl','2xl']
    },
    {
        pattern: /grid-cols-\d+/,
        variants:['sm', 'md', 'lg', 'xl','2xl'],
    },
    {
        pattern: /col-start-\d+/,
        variants:['sm', 'md', 'lg', 'xl','2xl'],
    },
    {
      pattern: /gap-\d+/,
      variants:['sm', 'md', 'lg', 'xl','2xl'],
    },
    {
        pattern: /text-(sm|base|md|lg|2xl|3xl|4xl|5xl|6xl)/,
        variants: []
    }

  ] 
} 