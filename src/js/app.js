const saveEle = document.getElementById('save')
const cancelEle = document.getElementById('cancel')
const messageEle = document.getElementById('confirmation')
const radioBtns = document.querySelectorAll('input[name="filter"]')
const datePickerBtn = document.getElementById('select-date')
const datePickerInput = document.getElementById('datepicker')

const datepickerIns = DatePicker({
  input: document.getElementById('datepicker'),
  onSet: updateTime
})
const timepickerIns = TimePicker({
  select: document.getElementById('timepicker')
})

function updateTime(date) {
  const today = new Date()
  if(date.toDateString() === today.toDateString()) {
    timepickerIns.set('from', [today.getHours(), today.getMinutes()])
  } else {
    timepickerIns.reset()
  }
}

function getFilter() {
  const filterBtn = document.querySelectorAll('input[name="filter"]:checked')
  return filterBtn[0].getAttribute('data-weekend') ? filterBtn[0].getAttribute('data-weekend') === 'true' : null
}

function filterCalendar(ev) {
  const weekend = getFilter()
  datepickerIns.set('weekend', weekend)
}

save.addEventListener('click', () => {
  const date = datepickerIns.get('value')
  const time =  timepickerIns.get('value')
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