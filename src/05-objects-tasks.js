/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return { width, height, getArea() { return width * height; } };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return new proto.constructor(...Object.values(obj));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelectors {
  constructor() {
    this.selector = '';
    this.ShouldCheck = {
      element: 0,
      id: 0,
      pseudoElement: 0,
    };
    this.Order = 0;
    this.errors = {
      onlyOneTime: 'Element, id and pseudo-element should not occur more then one time inside the selector',
      selectorsOrder: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    };
  }

  checkSelectorOnlyOneTimeOccur(selector) {
    const { onlyOneTime } = this.errors;
    if (this.ShouldCheck[selector]) throw new Error(onlyOneTime);
  }

  checkSelectorsOrder(defOrder) {
    const { Order } = this;
    const { selectorsOrder } = this.errors;
    if (Order > defOrder) throw new Error(selectorsOrder);
  }

  element(value) {
    const defOrder = 1;

    this.checkSelectorOnlyOneTimeOccur('element');
    this.checkSelectorsOrder(defOrder);

    this.selector += value;
    this.ShouldCheck.element = 1;
    this.Order = defOrder;
    return this;
  }

  id(value) {
    const defOrder = 2;

    this.checkSelectorOnlyOneTimeOccur('id');
    this.checkSelectorsOrder(defOrder);

    this.selector += `#${value}`;
    this.ShouldCheck.id = 1;
    this.Order = defOrder;
    return this;
  }

  class(value) {
    const defOrder = 3;

    this.checkSelectorsOrder(defOrder);

    this.selector += `.${value}`;
    this.Order = defOrder;
    return this;
  }

  attr(value) {
    const defOrder = 4;

    this.checkSelectorsOrder(defOrder);

    this.selector += `[${value}]`;
    this.Order = defOrder;
    return this;
  }

  pseudoClass(value) {
    const defOrder = 5;

    this.checkSelectorsOrder(defOrder);

    this.selector += `:${value}`;
    this.Order = defOrder;
    return this;
  }

  pseudoElement(value) {
    const defOrder = 6;

    this.checkSelectorOnlyOneTimeOccur('pseudoElement');
    this.checkSelectorsOrder(defOrder);

    this.selector += `::${value}`;
    this.ShouldCheck.pseudoElement = 1;
    this.Order = defOrder;
    return this;
  }

  combine(s1, combinator, s2) {
    this.selector = `${s1.selector} ${combinator} ${s2.selector}`;
    return this;
  }

  stringify() {
    return this.selector;
  }
}

const cssSelectorBuilder = {
  element: (value) => new CssSelectors().element(value),
  id: (value) => new CssSelectors().id(value),
  class: (value) => new CssSelectors().class(value),
  attr: (value) => new CssSelectors().attr(value),
  pseudoClass: (value) => new CssSelectors().pseudoClass(value),
  pseudoElement: (value) => new CssSelectors().pseudoElement(value),
  combine: (s1, combinator, s2) => new CssSelectors().combine(s1, combinator, s2),
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
