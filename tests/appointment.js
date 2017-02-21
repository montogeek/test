let page = {}

module.exports = {
  before: function(browser) {
    page = browser.page.appointment()
    page.navigate()
  },
  after: function(browser) {
    browser.end()
  },
  'Display web page correctly': function(browser) {
    browser.assert.visible('body')
    page.expect.element('@confirmationMsg').to.not.be.visible
  },
  'Displays page header correctly': function(browser) {
    browser.expect.element('h1').text.to.equal('Welcome to the Appointment Creator!')
  },
  'Displays page description correctly': function(browser) {
    browser.expect.element('p').text.to.equal('Please start by selecting a date and time for your appointment:')
  },
  'Displays calendar filters correctly': function(browser) {
    browser.expect.element('p.mt0').text.to.equal('Filter calendar by:')
    page.expect.element('@filterAnydate').to.be.selected
    page.expect.element('@filterWeekdays').to.not.be.selected
    page.expect.element('@filterWeekends').to.not.be.selected
  },
  'Displays datepicker input correctly': function(browser) {
    page.expect.element('@datepicker').to.be.visible
    page.expect.element('@dateinput').to.be.visible
  },
  'Displays timepicker input correctly': function(browser) {
    page.expect.element('@timepicker').to.be.visible
  },
  'Displays buttons correctly': function(browser) {
    page.expect.element('@saveBtn').to.be.visible
    page.expect.element('@cancelBtn').to.be.visible
  },
  'Open calendar when date picker button is clicked': function(browser) {
    page.click('@datepicker')
    page.expect.element('@calendar').to.be.visible
  }
}