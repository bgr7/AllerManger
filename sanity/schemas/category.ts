export default {
  name: 'category',
  type: 'document',
  title: 'Categories',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name of Category',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Categorie Slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Tag of Category',
    },
    {
      name: 'images',
      type: 'image',
      title: 'Category Images',
      of: [{type: 'image'}],
    },
  ],
}
