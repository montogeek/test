let page = {}

module.exports = {
  before: function(browser) {
    page = browser.page.appointment()
    page.navigate()
  },
  after: function(browser) {
    browser.end()
  },
  'Should display web page correctly': function(browser) {
    browser.assert.visible('body')
    page.expect.element('@confirmationMsg').to.not.be.visible
  },
  'Should display page header correctly': function(browser) {
    browser.expect.element('h1').text.to.equal('Welcome to the Appointment Creator!')
  },
  'Should displays page description correctly': function(browser) {
    browser.expect.element('p').text.to.equal('Please start by selecting a date and time for your appointment:')
  },
  'Should displays calendar filters correctly': function(browser) {
    browser.expect.element('p.mt0').text.to.equal('Filter calendar by:')
    page.expect.element('@filterAnydate').to.be.selected
    page.expect.element('@filterWeekdays').to.not.be.selected
    page.expect.element('@filterWeekends').to.not.be.selected
  },
  'Should display datepicker input correctly': function(browser) {
    page.expect.element('@datepicker').to.be.visible
    page.expect.element('@dateinput').to.be.visible
  },
  'Should display timepicker input correctly': function(browser) {
    page.expect.element('@timepicker').to.be.visible
  },
  'Should display buttons correctly': function(browser) {
    page.expect.element('@saveBtn').to.be.visible
    page.expect.element('@cancelBtn').to.be.visible
  },
  'Should open calendar when date picker button is clicked': function(browser) {
    page.click('@datepicker')
    page.expect.element('@calendar').to.be.visible
  },
  'Should open calendar by clicking on filters': function(browser) {
    page.click('@filterAnydate')
    page.expect.element('@calendar').to.be.visible

    page.click('@filterWeekdays')
    page.expect.element('@calendar').to.be.visible

    page.click('@filterWeekends')
    page.expect.element('@calendar').to.be.visible
  },
  'Should filter calendar by clicking on filters': function(browser) {
    const weekendDate = `${page.elements.calendar.selector} table > tbody > tr:nth-child(4) > td:nth-child(7)`
    const weekdayDate = `${page.elements.calendar.selector} table > tbody > tr:nth-child(4) > td:nth-child(6)`

    page.click('@filterWeekdays')
    page.expect.element(weekendDate).to.have.css('cursor').which.equals('not-allowed')

    page.click('@filterWeekends')
    page.expect.element(weekdayDate).to.have.css('cursor').which.equals('not-allowed')
  },
  'Should show confirmation message when Save button is clicked': function(browser) {
    const date = new Date()
    const month = (date.getMonth() + 1).toString()
    const formattedDate = `${(month.length > 1 ? month : `0${month}`)}/${date.getDate()}/${date.getFullYear()}`
    page.click('@datepicker')
    page.click('@currentDate')

    page.click('@saveBtn')
    page.expect.element('@confirmationMsg').to.be.visible
    page.expect.element('@confirmationMsg').text.which.equals(`Good! Your appointment is set for ${formattedDate} at 12:00 PM. Thanks!`)
  },
  'Should reset date and time inputs; clear confirmation message when Cancel button is clicked': function(browser) {
    const option = `${page.elements.timepicker.selector} > option:nth-child(1)`
    page.click('@datepicker')
    page.click('@currentDate')
    page.click(option)

    page.click('@saveBtn')
    page.click('@cancelBtn')

    page.expect.element('@dateinput').value.to.equal('')
    page.expect.element('@timepicker').value.to.equal('12:00 PM')
    page.expect.element('@confirmationMsg').text.to.equal('')
    page.expect.element('@confirmationMsg').to.not.be.visible
  }
}