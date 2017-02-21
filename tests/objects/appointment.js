module.exports = {
  url: 'http://127.0.0.1:8080',
  elements: {
    filterAnydate: {
      selector: 'input[name="filter"][checked]',
    },
    filterWeekdays: {
      selector: 'input[name="filter"][data-weekend="false"]',
    },
    filterWeekends: {
      selector: 'input[name="filter"][data-weekend="true"]'
    },
    datepicker: {
      selector: '#select-date'
    },
    dateinput: {
      selector: '#datepicker'
    },
    timepicker: {
      selector: '#timepicker'
    },
    saveBtn: {
      selector: '#save'
    },
    cancelBtn: {
      selector: '#cancel'
    },
    confirmationMsg: {
      selector: '#confirmation'
    },
    calendar: {
      selector: '#calendar'
    },
    nextBtn: {
      selector: '#next'
    },
    prevBtn: {
      selector: '#prev'
    },
    monthLabel: {
      selector: '#month'
    }
  }
}