let page = {}

module.exports = {
  before: function(browser) {
    page = browser.page.appointment()
    page.navigate()
  },
  after: function(browser, done) {
    browser.end()
    done()
  },
  beforeEach: function(browser) {
    browser.refresh()
  },
  'Should open calendar when date picker button is clicked': function(browser) {
    page.click('@datepicker')
    page.expect.element('@calendar').to.be.visible
  },
  'Should display current date selected': function(browser) {
    const currentDate = `${page.elements.calendar.selector} table > tbody td.selected`
    page.click('@datepicker')

    page.expect.element(currentDate).to.be.present
  },
  'Should be able to select date': function(browser) {
    const date = `${page.elements.calendar.selector} table > tbody > tr:nth-child(4) > td:nth-child(5)`

    page.click('@datepicker')
    page.click(date)

    page.expect.element('@dateinput').value.to.equal('02/23/2017')
  },
  'Should display current month': function(browser) {
    page.click('@datepicker')
    page.click('@nextBtn')
    page.click('@nextBtn')
    page.click('@prevBtn')

    page.expect.element('@monthLabel').text.to.equal('March 2017')
  },
  'Should not be able to select previous dates': function(browser) {
    const previousDate = `${page.elements.calendar.selector} table > tbody > tr:nth-child(3) > td:nth-child(2)`
    page.click('@datepicker')
    page.click('@prevBtn')

    page.expect.element(previousDate).to.have.css('cursor').which.equals('not-allowed')
  },
  'Should display previous selected date when opened again': function(browser) {
    const dateToSelect = `${page.elements.calendar.selector} table > tbody > tr:nth-child(3) > td:nth-child(2)`
    page.click('@datepicker')
    page.click('@nextBtn')
    page.click(dateToSelect)

    page.click('@datepicker')
    page.expect.element(dateToSelect).to.have.attribute('class').which.contains('selected')
  }
}