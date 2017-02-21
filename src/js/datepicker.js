/**
 * DatePicker
 * @param {Node} input Input element
 * @param {onSet} function Function called when a date is selected
 * @return {Object}
 */
const DatePicker = ({ input, onSet }) => {
  const locale = 'en-us'
  let selectedDate = new Date()
  let currenDate = new Date()
  const containerEle = document.getElementById('calendar')
  containerEle.classList.add('absolute')

  /**
   * Get year in numeric (2017) format
   * @param {Date} date Date
   * @param {string} locale BCP 47 language tag
   * @return {integer} Year
   */
  function getYear(date, locale) {
    return date.toLocaleString(locale, { year: "numeric" })
  }

  /**
   * Get month in long (Feb) format
   * @param {Date} date Date
   * @param {string} locale BCP 47 language tag
   * @return {integer} Month name
   */
  function getMonthName(date, locale) {
    return date.toLocaleString(locale, { month: "long" })
  }

  /**
   * Get day name in short (Mon) format
   * @param {Date} date Date
   * @param {string} locale BCP 47 language tag
   * @return {integer} Day name
   */
  function getDayName(date, locale) {
    return date.toLocaleString(locale, { weekday: "short" })
  }

  /**
   * Returns previous or next date
   * @param {Date} date Date
   * @param {string} direction Previous or next month
   * @return {Date} Previous or next month date
   */
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

  /**
   * Returns user friendly date
   * @param {Date} date Date
   * @return {string} Formatted date
   */
  function getFormattedDate(date) {
    const year = date.getFullYear()

    let month = (1 + date.getMonth()).toString()
    month = month.length > 1 ? month : '0' + month

    let day = date.getDate().toString()
    day = day.length > 1 ? day : '0' + day

    return month + '/' + day + '/' + year
  }

  /**
   * Returns a matrix with current month data
   * @param {Date} date Date
   * @param {boolean} weekend Weekend filter
   * @return {Array[]} Month data
   */
  function createMonthData(date, weekend) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const currentMonth = firstDayOfMonth.getMonth()
    const firstDayOfWeek = new Date(firstDayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay()))

    return Array.from({ length: 6 }).map(() => {
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
          selectable = futureDate && sameMonth
          if(weekend) {
            selectable =  selectable && isWeekend(dayWeek)
          } else {
            selectable = selectable && !isWeekend(dayWeek) || today
          }
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
  }

  /**
   * Returns a week row, a <tr> Node
   * @param {Array} week Array of days
   * @param {Node} input Input element
   * @return {Node[]} Week
   */
  function renderWeek(week, input) {

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
        td.classList.add('gray0')
        td.addEventListener('click', () => {})
      }

      if(day.selected) {
        td.classList.add('selected')
      }

      tr.appendChild(td)
    })

    return tr
  }

  /**
   * Returns calendar body, a <tbody> Node
   * @param {Array} month Array of weeks
   * @param {Node} input Input element
   * @return {Node[]} Month
   */
  function renderBody(month, input) {
    const tbody = document.createElement('tbody')
    month.forEach((week) => {
      tbody.appendChild(renderWeek(week, input))
    })

    return tbody
  }

  /**
   * Returns weekdays row, a <thead> Node
   * @param {Array} weekDays Array of days name
   * @return {Node[]} Week days
   */
  function renderWeekDays(weekDays) {
    const thead = document.createElement('thead')
    const tr = document.createElement('tr')

    weekDays.forEach((day) => {
      const td = document.createElement('td')
      td.innerText = day
      td.classList.add('pa1')

      tr.appendChild(td)
    })

    thead.appendChild(tr)

    return thead
  }

  /**
   * Returns prev or next button to navigate between months
   * @param {Date} date Date
   * @param {string} direction Previous or next month
   * @param {Node} input Input element
   * @param {boolean} weekend Weekend filter
   * @return {Node} Button
   */
  function renderButton(date, direction, input, weekend) {
    const button = document.createElement('button')
    const icon = document.createElement('img')
    icon.src = `icons/${direction}.svg`

    button.id = direction
    button.classList.add('pointer')
    button.classList.add('b--none')
    button.classList.add('bg-transparent')
    button.classList.add('pa0')
    button.appendChild(icon)
    button.addEventListener('click', () => render({ date: getMonthDate(date, direction), input, weekend }))

    return button
  }

  /**
   * Returns calendar header, a <div> Node
   * @param {Date} date Date
   * @param {Node} input Input element
   * @param {boolean} weekend Weekend filter
   * @return {Node} Header HTML
   */
  function renderHeader(date, input, weekend) {
    const html = document.createElement('div')
    html.classList.add('flex')
    html.classList.add('justify-between')
    html.classList.add('mb1')
    html.classList.add('pa1')

    const span = document.createElement('span')
    span.innerText = `${getMonthName(date)} ${getYear(date)}`
    span.id = 'month'

    html.appendChild(renderButton(date, 'prev', input, weekend))
    html.appendChild(span)
    html.appendChild(renderButton(date, 'next', input, weekend))

    return html
  }

  /**
   * Returns a calendar
   * @param {Date} date Date, defaults to current date
   * @param {Node} input Input element
   * @param {boolean} weekend Weekend filter
   * @return {Node} Calendar HTML
   */
  function render({ date = currenDate, input, weekend = null } = {}) {
    const month = createMonthData(date, weekend)

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
    calendar.appendChild(renderBody(month, input))

    const container = document.createElement('div')
    container.classList.add('ba')
    container.classList.add('b--gray0')
    container.classList.add('pa1')
    container.classList.add('bg-white')
    container.classList.add('shadow-4')

    container.appendChild(renderHeader(date, input, weekend))
    container.appendChild(calendar)

    if(containerEle.hasChildNodes()) {
      containerEle.removeChild(containerEle.firstChild)
    }
    containerEle.classList.add('db')
    containerEle.classList.remove('dn')
    containerEle.appendChild(container)
  }

  function close() {
    containerEle.classList.add('dn')
    containerEle.classList.remove('db')
  }

  function clear() {
    input.value = ''
    currenDate = new Date()
    selectedDate = new Date()
  }

  function set(option, value) {
    return render({ [option]: value, input })
  }

  function get() {
    return getFormattedDate(selectedDate)
  }

  function open() {
    containerEle.classList.add('db')
    containerEle.classList.remove('dn')
    return render({ input: input })
  }

  document.addEventListener('click', (ev) => {
    const target = ev.target

    if(
      target.nodeName !== 'IMG' &&
      !containerEle.contains(target) &&
      target.nodeName !== 'INPUT' &&
      target.nodeName !== 'LABEL'
    ) {
      close()
    }
  })

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