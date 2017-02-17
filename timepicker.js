function createIntervals(from, to, interval) {
  const times = []
  let [ minHour, minMin ] = from
  let [ maxHour, maxMin ] = to

  for(let hour = minHour; hour < maxHour; hour++) {
    for (let min = minMin; min < maxMin; min += interval) {
      var min0 = min < 10 ? '0' + min : min;
      times.push(`${hour}:${min0}`)
    }
  }

  return times
}

function renderOption(time) {
  const [ hour, min ] = time.split(':')
  const ampm = hour > 11 ? 'PM' : 'AM'
  const hour12 = hour > 12 ? hour - 12 : hour

  const option = document.createElement('option')
  option.value = time
  option.text = `${hour12}:${min} ${ampm}`

  return option
}

function renderTime({ from = [0,0], to = [24,60] } = {}) {
  const timeEl = document.getElementById('time')
  Array.from(timeEl).forEach((option) => option.remove())

  const options = createIntervals(from, to, 15).reduce((container, option) => {
    container.appendChild(renderOption(option))
    return container
  }, document.createDocumentFragment())

  timeEl.appendChild(options)
}

window.TimePicker = renderTime