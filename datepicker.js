const DatePicker = ({ input, onSet }) => {
  const locale = 'en-us'
  let selectedDate = new Date()
  let currenDate = new Date()

  function getYear(date, locale) {
    return date.toLocaleString(locale, { year: "numeric" })
  }

  function getMonthName(date, locale) {
    return date.toLocaleString(locale, { month: "long" })
  }

  function getDayName(date, locale) {
    return date.toLocaleString(locale, { weekday: "short" })
  }

  function renderWeek(week, input, date) {

    const tr = document.createElement('tr')

    week.forEach((day) => {
      const td = document.createElement('td')
      td.innerText = day.day
      td.classList.add('pa2')
      td.classList.add('tc')

      if(day.selectable) {
        td.classList.add('pointer')
        td.addEventListener('click', (ev) => {
          input.value = getFormattedDate(day.date)
          currentDate = selectedDate = day.date
          onSet(day.date)
          close()
        })
      } else {
        td.classList.add('disabled')
        td.addEventListener('click', () => {})
      }

      if(day.selected) {
        td.classList.add('selected')
      }

      tr.appendChild(td)
    })

    return tr
  }

  function renderBody(month, input, date) {
    const tbody = document.createElement('tbody')
    month.forEach((week) => {
      tbody.appendChild(renderWeek(week, input, date))
    })

    return tbody
  }

  function renderWeekDays(weekDays) {
    const thead = document.createElement('thead')
    const tr = document.createElement('tr')

    weekDays.forEach((day) => {
      const td = document.createElement('td')
      td.innerText = day
      td.classList.add('pa2')

      tr.appendChild(td)
    })

    thead.appendChild(tr)

    return thead
  }

  function getMonthDate(date, direction) {
    const dates = {
      'next': (date) => {
        if (date.getMonth() == 11) {
          return new Date(date.getFullYear() + 1, 0, 1)
        } else {
          return new Date(date.getFullYear(), date.getMonth() + 1, 1)
        }
      },
      'prev': (date) => {
        if (date.getMonth() == 0) {
          return new Date(date.getFullYear() - 1, 11, 1)
        } else {
          return new Date(date.getFullYear(), date.getMonth() - 1, 1)
        }
      }
    }

    currenDate = dates[direction](date)

    return dates[direction](date)
  }

  function renderButton(date, direction, input, weekend) {
    const button = document.createElement('button')
    const icon = document.createElement('img')
    icon.src = `icons/${direction}.svg`

    button.classList.add('pointer')
    button.classList.add('b--none')
    button.classList.add('bg-transparent')
    button.classList.add('pa0')
    button.appendChild(icon)
    button.addEventListener('click', () => render({ date: getMonthDate(date, direction), input, weekend }))

    return button
  }

  function getFormattedDate(date) {
    const year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }

  function renderHeader(date, input, weekend) {
    const html = document.createElement('div')
    html.classList.add('flex')
    html.classList.add('justify-between')
    html.classList.add('mb1')

    const span = document.createElement('span')
    span.innerText = `${getMonthName(date)} ${getYear(date)}`

    html.appendChild(renderButton(date, 'prev', input, weekend))
    html.appendChild(span)
    html.appendChild(renderButton(date, 'next', input, weekend))

    return html
  }

  function render({ date = currenDate, input, weekend = null } = {}) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const currentMonth = firstDayOfMonth.getMonth()
    const firstDayOfWeek = new Date(firstDayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay()))

    const month = Array.from({ length: 6 }).map(() => {
      return Array.from({ length: 7 }).map(() => {
        const dayDate = new Date(firstDayOfWeek)
        const day = firstDayOfWeek.getDate()
        const dayWeek = firstDayOfWeek.getDay()

        const today = firstDayOfWeek.toDateString() === new Date().toDateString()
        const selected = firstDayOfWeek.toDateString() === selectedDate.toDateString()
        const sameMonth = firstDayOfWeek.getMonth() === currentMonth
        const futureDate = firstDayOfWeek.getTime() >= new Date().getTime()
        const isWeekend = (day) => day === 0 || day === 6

        let selectable = true
        if(weekend === null) {
          selectable = futureDate && sameMonth || today
        } else {
          selectable = futureDate && sameMonth && (weekend ? isWeekend(dayWeek) : !isWeekend(dayWeek)) || (weekend ? false : today)
        }

        firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 1)

        return {
          selectable,
          day,
          date: dayDate,
          selected
        }
      })
    })

    const weekDays = Array.from({ length: 7 }).map((week, i) => {
      const newDate = new Date(date.getDate() - date.getDay())
      newDate.setDate(i)
      return getDayName(newDate)
    })

    const calendar = document.createElement('table')
    calendar.classList.add('w-100')
    calendar.classList.add('dt--fixed')
    calendar.cellPadding = 0
    calendar.cellSpacing = 0

    calendar.appendChild(renderWeekDays(weekDays))
    calendar.appendChild(renderBody(month, input, date))

    const container = document.createElement('div')
    container.classList.add('ba')
    container.classList.add('pa2')
    container.classList.add('bg-white')
    container.classList.add('shadow-4')

    container.appendChild(renderHeader(date, input, weekend))
    container.appendChild(calendar)

    const target = document.getElementById('calendar')
    if(target.hasChildNodes()) {
      target.removeChild(target.firstChild)
    }
    target.appendChild(container)
  }

  function close() {
    const target = document.getElementById('calendar')
    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }
  }

  function clear() {
    input.value = ''
  }

  function set(option, value) {
    return render({ [option]: value, input })
  }

  function get() {
    return getFormattedDate(selectedDate)
  }

  function open() {
    return render({ input: input })
  }

  // API
  return {
    clear: clear,
    close: close,
    set: set,
    get: get,
    open: open
  }
}

window.DatePicker = DatePicker