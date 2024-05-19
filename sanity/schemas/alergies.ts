export default {
  name: 'allergies', // corrected the spelling of 'alergies' to 'allergies'
  type: 'document',
  title: 'Allergies',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name of Allergy', // singular form for consistency
    },
    {
      name: 'affectedProducts', // corrected the spelling and made it plural to reflect the array type
      type: 'array',
      title: 'Affected Products',
      of: [{type: 'reference', to: {type: 'product'}}],
    },
  ],
}
