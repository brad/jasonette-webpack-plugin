export default {
  body: {
    header: {
      // Hello, comments!
      text: 'Hello, { ˃̵̑ᴥ˂̵̑}!'
    },
    sections: [
      {
        items: [
          {
            type: 'label',
            text: function() {
              return 'Hello pretty functions!'
            }
          },
          {
            type: 'label',
            text: 'regular string'
          },
          {
            type: 'label',
            text: 5
          },
          {
            type: 'label',
            text: new Date()
          },
        ]
      }
    ]
  }
}
