const saveEle = document.getElementById('save')
const cancelEle = document.getElementById('cancel')
const dateEle = document.getElementById('datepicker')
const timeEle = document.getElementById('time')
const messageEle = document.getElementById('confirmation')
const datepicker = DatePicker({
  input: document.getElementById('datepicker'),
  onSet: updateTime
})
const timepicker = TimePicker({
  select: document.getElementById('timepicker')
})


save.addEventListener('click', () => {
  const date = datepicker.get('value')
  const time =  timepicker.get('value')
  messageEle.innerText = `Good! Your appointment is set for ${date} at ${time}. Thanks!`
})

cancel.addEventListener('click', () => {
  datepicker.clear()
  timepicker.reset()
  messageEle.innerText = ''
})

function getFilter() {
  const filterBtn = document.querySelectorAll('input[name="filter"]:checked')
  return filterBtn[0].getAttribute('data-weekend') ? filterBtn[0].getAttribute('data-weekend') === 'true' : null
}

function filterCalendar(ev) {
  const weekend = getFilter()
  datepicker.set('weekend', weekend)
}

const radioBtns = document.querySelectorAll('input[name="filter"]')
radioBtns.forEach((radioBtn) => {
  radioBtn.addEventListener('click', filterCalendar)
})

function showCalendar(filter) {
  const weekend = filter ? filter : getFilter();

  datepicker.open()
}

function updateTime(date) {
  const today = new Date()
  if(date.toDateString() === today.toDateString()) {
    timepicker.set('from', [today.getHours(), today.getMinutes()])
  } else {
    timepicker.reset()
  }
}

const datePickerBtn = document.getElementById('select-date')
datePickerBtn.addEventListener('click', () => showCalendar())