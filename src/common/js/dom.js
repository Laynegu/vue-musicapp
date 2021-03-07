/**封装与dom有关的操作 */

/*给指定元素增加类名 */
export function addClass(ele, className) {
  // 判断指定元素中是否已含有相关类名
  if (hasClass(ele, className)) {
    return;
  } else {
    let classArr = ele.className.split(' ');
    classArr.push(className);
    ele.className = classArr.join(' ');
  }
}

/**判断指定元素是否含有某个类名 */
export function hasClass(ele, className) {
  const regexp = new RegExp(`/(^|\\s)${className}(\\|s$)/`);
  return regexp.test(ele.className);
}

/**获取指定元素的属性（或设置） */
export function getAttr(ele, name, value) {
  const prefix = 'data-';
  if (value) {
    //设置
    ele.setAttribute(prefix + name, value);
  } 
  return ele.getAttribute(prefix + name);
}

// 统一处理css的兼容性
let divStyle = document.createElement('div').style;
let vendor = (() => {
  let transform = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "transform",
  }

  for (const key in transform) {
    if (divStyle[transform[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

export function cssPrefix(cssStyle) {
  if (!vendor) {
    return false;
  }
  if (vendor === 'standard') {
    return cssStyle;
  }
  return vendor + cssStyle.charAt(0).toUpperCase() + cssStyle.substr(1);
}
