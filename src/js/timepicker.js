/**
 * TimePicker
 * @param {Node} select Element type select
 * @return {Object}
 */
const TimePicker = ({ select }) => {
  const min = [0,0]
  const max = [24,60]
  const times = createIntervals(min, max, 15)
  let selected = times[48]

  /**
   * Returns an array of intervals with format `12:O0 PM`
   * @param {array} [from=[0,0]] Minimun hour and minute
   * @param {array} [min=[24,60]] Maximun hour and minute
   * @param {number} [interval=15] Minutes interval
   * @return {array} Intervals
   */
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

  /**
   * Returns an option
   * @param {string} time Time
   * @return {Node} Option
   */
  function renderOption(time) {
    const [ hour, min ] = time.split(':')
    const hour12 = hour > 12 ? hour - 12 : hour

    const option = document.createElement('option')
    option.value = time
    option.text = `${hour12}:${min}`

    return option
  }

  /**
   * Append options to a <select>
   * @param {array} [from=[0,0]] Minimun hour and minute
   * @param {array} [min=[24,60]] Maximun hour and minute
   */
  function render({ from = min, to = max } = {}) {
    clear()
    let availableTimes = times
    let defaultSelected = 48 // 12:00 PM
    if(from !== min) {
      /**
       * Times have 4 (15 minute interval) elements for each hour, to get nearest 15 min interval
       * we calculate the array index using: (hour * 4) + ceil((minute + 1) / 15),
       * first part of the equation give us hour interval index and last past give us minute interval index.
       */
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

  /**
   * Deletes all option nodes
   */
  function clear() {
    Array.from(select).forEach((option) => option.remove())
  }

  /**
   * Set an option
   * @param {string} option Option to set
   * @param {array} value New value for option
   */
  function set(option, value) {
    return render({ [option]: value })
  }

  /**
   * Render with default parameters
   */
  function reset() {
    return render()
  }

  /**
   * Return current selected option
   */
  function get() {
    return selected
  }

  // Render options by default
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