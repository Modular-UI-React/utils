/*
 * Creates a callback chain
 */
export const callbackChain = (...callbacks: Function[]) => {
  return (shortCircuit: boolean, ...args: any[]) => {
    for (const func of callbacks) {
      if (shortCircuit && func?.(...args)) return true
    }
    return !shortCircuit
  }
}

/*
 * Merges the properties of two objects. Properties in the first object can be
 * deleted by defining those properties as 'undefined' or 'null' in the second object.
 */
export const mergeObjects = (o: object, p: object, rules?: object) => {
  if (o == null || p == null) return {}

  const merged = { ...o }

  for (const key in p) {
    if (p[key] == null && merged[key] != null) {
      delete merged[key]
    } else {
      const type1 = typeof p[key]
      const type2 = typeof o[key]
      if (type1 === type2 && rules) {
        const combined = rules?.[type1]?.(p[key], o[key])
        if (combined) {
          merged[key] = combined
        } else {
          merged[key] = p[key]
        }
      } else {
        merged[key] = p[key]
      }
    }
  }

  return merged
}

/*
 * - Flattens a nested array
 * - Converts a single non-array element into an array
 * - Filters undefined/null array elements
 */
export const parseArray = (children: any) => {
  if (children == null) return []

  if (Array.isArray(children)) {
    return children.flat(Infinity).filter((child) => child != null)
  }

  return [children]
}

/*
 * Joins a series of names and turn it into a valid JSX className attribute
 */
export const concatClassNames = (...names: string[]) => {
  return [...names].join(' ').replace(/\s+$/, '')
}

/*
 * Sets element width (css definition)
 */
export const setElementWidth = (element: HTMLElement, width: number) => {
  const style = getComputedStyle(element)
  let newWidth = width
  if (style.boxSizing === 'content-box') {
    newWidth -=
      Number.parseInt(style.paddingLeft) +
      Number.parseInt(style.paddingRight) +
      Number.parseInt(style.borderLeft) +
      Number.parseInt(style.borderRight)
  }
  element.style.width = newWidth + 'px'
}

/*
 * Sets element height (css definition)
 */
export const setElementHeight = (element: HTMLElement, height: number) => {
  const style = getComputedStyle(element)
  let newHeight = height
  if (style.boxSizing === 'content-box') {
    newHeight -=
      Number.parseInt(style.paddingTop) +
      Number.parseInt(style.paddingBottom) +
      Number.parseInt(style.borderTop) +
      Number.parseInt(style.borderBottom)
  }
  element.style.height = newHeight + 'px'
}

/*
 * Gets element size (css definition)
 */
export const getElementCssSize = (element: HTMLElement) => {
  const style = getComputedStyle(element)
  return [Number.parseInt(style.width), Number.parseInt(style.height)]
}

/*
 * Get an element's exact position
 */
export const getElementPosition = (element: HTMLElement) => {
  let xPos = 0
  let yPos = 0

  let elem: any = element

  while (elem) {
    if (elem.tagName.toUpperCase() === 'BODY') {
      // deal with browser quirks with body/window/document and page scroll
      const xScroll = elem.scrollLeft || document.documentElement.scrollLeft
      const yScroll = elem.scrollTop || document.documentElement.scrollTop

      xPos += elem.offsetLeft - xScroll + elem.clientLeft
      yPos += elem.offsetTop - yScroll + elem.clientTop
    } else {
      // for all other non-BODY elements
      xPos += elem.offsetLeft - elem.scrollLeft + elem.clientLeft
      yPos += elem.offsetTop - elem.scrollTop + elem.clientTop
    }

    elem = elem.offsetParent
  }
  return [xPos, yPos]
}

/*
 * Get an element's distance (dx, dy) from a given point
 */
export const getElementDistanceFromPoint = (
  element: HTMLElement,
  x: number,
  y: number,
  fromCenter: boolean = true
) => {
  const width = element.offsetWidth
  const height = element.offsetHeight
  const [ex, ey] = getElementPosition(element)

  if (fromCenter) {
    return [Math.floor(ex + width / 2 - x), Math.floor(ey + height / 2 - y)]
  }
  return [Math.min(ex - x, ex + width - x), Math.min(ey - y, ey + height - y)]
}
