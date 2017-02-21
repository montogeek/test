const TimePicker = ({ select }) => {
  const min = [0,0]
  const max = [24,60]
  const times = createIntervals(min, max, 15)
  let selected = times[48]

  function createIntervals(from, to, interval) {
    const times = []
    let [ minHour, minMin ] = from
    let [ maxHour, maxMin ] = to

    for(let hour = minHour; hour <= maxHour; hour++) {
      const ampm = hour > 11 ? 'PM' : 'AM'
      for (let min = minMin; min < maxMin; min += interval) {
        const min0 = min < 10 ? '0' + min : min;
        times.push(`${hour}:${min0} ${ampm}`)
      }
    }

    return times
  }

  function renderOption(time) {
    const [ hour, min ] = time.split(':')
    const hour12 = hour > 12 ? hour - 12 : hour

    const option = document.createElement('option')
    option.value = time
    option.text = `${hour12}:${min}`

    return option
  }

  function render({ from = min, to = max } = {}) {
    clear()
    let availableTimes = times
    let defaultSelected = 48 // 12:00 PM
    if(from !== min) {
      availableTimes = times.slice(((from[0] * 4) + Math.ceil((from[1] + 1)/ 15) ))
      defaultSelected = availableTimes[0]
    }

    const options = availableTimes.reduce((container, option) => {
      container.appendChild(renderOption(option))
      return container
    }, document.createDocumentFragment())

    select.appendChild(options)
    select.selectedIndex = defaultSelected
    select.addEventListener('change', (ev) => {
      selected = select.options[select.selectedIndex].text;
    })
  }

  function clear() {
    Array.from(select).forEach((option) => option.remove())
  }

  function set(option, value) {
    return render({ [option]: value })
  }

  function reset() {
    return render()
  }

  function get() {
    return selected
  }

  render()

  // API
  return {
    clear: clear,
    set: set,
    get: get,
    reset: reset
  }
}

window.TimePicker = TimePicker