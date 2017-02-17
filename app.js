const saveEle = document.getElementById('save')
const cancelEle = document.getElementById('cancel')
const dateEle = document.getElementById('datepicker')
const timeEle = document.getElementById('time')
const messageEle = document.getElementById('confirmation')

save.addEventListener('click', () => {
  const date = dateEle.value
  const time = timeEle.options[timeEle.selectedIndex].text
  messageEle.innerText = `Good! Your appointment is set for ${date} at ${time}. Thanks!`
})

cancel.addEventListener('click', () => {
  dateEle.value = ''
  messageEle.innerText = ''
})

function getFilter() {
  const filterBtn = document.querySelectorAll('input[name="filter"]:checked')
  return filterBtn[0].getAttribute('data-weekend') ? filterBtn[0].getAttribute('data-weekend') === 'true' : null
}

function filterCalendar(ev) {
  const weekend = ev.target.getAttribute('data-weekend') === 'true'
  showCalendar(weekend)
}

const radioBtns = document.querySelectorAll('input[name="filter"]')
radioBtns.forEach((radioBtn) => {
  radioBtn.addEventListener('click', filterCalendar)
})

function showCalendar(filter) {
  const weekend = filter ? filter : getFilter();

  DatePicker({
    input: document.getElementById('datepicker'),
    weekend,
    onSelect: (date) => {
      const newDate = new Date()
      if(date.toDateString() === newDate.toDateString()) {
        TimePicker({
          from: [newDate.getHours(), (Math.ceil(newDate.getMinutes() / 15) * 15) % 60]
        })
      } else {
        TimePicker()
      }
    }
  })
}

const datePickerBtn = document.getElementById('select-date')
datePickerBtn.addEventListener('click', () => showCalendar())

TimePicker()