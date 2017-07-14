module.exports = {  
  'Can load homepage': function(client) {
    client
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .assert.title('Skritter - Learn to Write Chinese and Japanese Characters')
      // .waitForElementVisible('button[name=btnG]', 1000)
      // .click('button[name=btnG]')
      // .pause(1000)
      .end()
  }
};