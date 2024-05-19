export default {
  name: 'user',
  type: 'document',
  title: 'User',
  fields: [
    {
      name: 'id',
      type: 'string',
      title: 'userId',
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email Address',
    },
    {
      name: 'name',
      type: 'string',
      title: 'Name',
    },
    {
      name: 'username',
      type: 'string',
      title: 'User Name',
    },
    {
      name: 'role',
      type: 'string',
      title: 'Role',
      options: {
        list: [
          {title: 'Admin', value: 'admin'},
          {title: 'User', value: 'user'},
        ],
      },
    },
    {
      name: 'allergies',
      type: 'array',
      title: 'Allergies',
      of: [{type: 'reference', to: {type: 'allergies'}}],
    },
    {
      name: 'favoriteProducts',
      type: 'array',
      title: 'Disliked Ingredients',
      of: [{type: 'reference', to: {type: 'product'}}],
    },
  ],
}
