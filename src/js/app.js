const saveEle = document.getElementById('save')
const cancelEle = document.getElementById('cancel')
const messageEle = document.getElementById('confirmation')
const radioBtns = document.querySelectorAll('input[name="filter"]')
const datePickerBtn = document.getElementById('select-date')
const datePickerInput = document.getElementById('datepicker')

const datepickerIns = DatePicker({
  input: document.getElementById('datepicker'),
  onSet: updateTimePicker
})

const timepickerIns = TimePicker({
  select: document.getElementById('timepicker')
})

/**
 * Updates timepicker setting `from`
 */
function updateTimePicker(date) {
  const today = new Date()
  if(date.toDateString() === today.toDateString()) {
    timepickerIns.set('from', [today.getHours(), today.getMinutes()])
  } else {
    timepickerIns.reset()
  }
}

/**
 * Returns calendar filter from radio buttons
 * @return {boolean}
 */
function getFilter() {
  const filterBtn = document.querySelectorAll('input[name="filter"]:checked')
  return filterBtn[0].getAttribute('data-weekend') ? filterBtn[0].getAttribute('data-weekend') === 'true' : null
}

/**
 * Set datepicker filter
 */
function filterCalendar(ev) {
  const weekend = getFilter()
  datepickerIns.set('weekend', weekend)
}

save.addEventListener('click', () => {
  const date = datepickerIns.get()
  const time =  timepickerIns.get()
  messageEle.innerText = `Good! Your appointment is set for ${date} at ${time}. Thanks!`
})

cancel.addEventListener('click', () => {
  datepickerIns.clear()
  timepickerIns.reset()
  radioBtns[0].checked = true
  messageEle.innerText = ''
})


radioBtns.forEach((radioBtn) => {
  radioBtn.addEventListener('click', filterCalendar)
})

datePickerBtn.addEventListener('click', () => {
  datepickerIns.open()
})

datePickerInput.addEventListener('click', () => {
  datepickerIns.open()
})