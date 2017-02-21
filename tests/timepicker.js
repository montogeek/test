let page = {}
let allOptionsLength = 100

module.exports = {
  before: function(browser) {
    page = browser.page.appointment()
    page.navigate()
  },
  after: function(browser) {
    browser.end()
  },
  'Should display all time intervals': function(browser) {
    browser.elements('css selector', page.elements.timepicker.selector + '> option', function(res) {
      this.assert.equal(res.value.length, allOptionsLength)
    })
  },
  'Should display 12:00 PM by default': function(browser) {
    page.expect.element('@timepicker').value.to.equal('12:00 PM')
  },
  'Should display nearest 15 minute increment if date selected is today': function(browser) {
    const currentDateSelector = `${page.elements.calendar.selector} table > tbody td.selected`
    page.click('@datepicker')
    page.click(currentDateSelector)

    const currentDate = new Date()
    const [hour, min] = [currentDate.getHours(), currentDate.getMinutes()]
    const expectedLength = allOptionsLength - ((hour * 4) + Math.ceil((min + 1)/ 15))

    browser.elements('css selector', page.elements.timepicker.selector + '> option', function(res) {
      this.assert.equal(res.value.length, expectedLength)
    })
  }
}