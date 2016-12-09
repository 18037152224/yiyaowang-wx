"use strict";var exports=module.exports={};
var _typeof3 = require('../../babel-runtime/helpers/typeof.js');

var _typeof4 = _interopRequireDefault2(_typeof3);

var _symbol = require('../../babel-runtime/core-js/symbol.js');

var _symbol2 = _interopRequireDefault2(_symbol);

var _from = require('../../babel-runtime/core-js/array/from.js');

var _from2 = _interopRequireDefault2(_from);

function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printBuffer = printBuffer;

var _helpers = require('./helpers.js');

var _diff = require('./diff.js');

var _diff2 = _interopRequireDefault(_diff);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
}

function _typeof(obj) {
  return obj && typeof _symbol2.default !== "undefined" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === 'undefined' ? 'undefined' : (0, _typeof4.default)(obj);
}

/**
 * Get log level string based on supplied params
 *
 * @param {string | function | object} level - console[level]
 * @param {object} action - selected action
 * @param {array} payload - selected payload
 * @param {string} type - log entry type
 *
 * @returns {string} level
 */
function getLogLevel(level, action, payload, type) {
  switch (typeof level === 'undefined' ? 'undefined' : _typeof(level)) {
    case 'object':
      return typeof level[type] === 'function' ? level[type].apply(level, _toConsumableArray(payload)) : level[type];
    case 'function':
      return level(action);
    default:
      return level;
  }
}

function defaultTitleFormatter(options) {
  var timestamp = options.timestamp;
  var duration = options.duration;

  return function (action, time, took) {
    var parts = ['action'];
    if (timestamp) {
      parts.push('@ ' + time);
    }
    parts.push(action.type);
    if (duration) {
      parts.push('(in ' + took.toFixed(2) + ' ms)');
    }
    return parts.join(' ');
  };
}

function printBuffer(buffer, options) {
  var logger = options.logger;
  var actionTransformer = options.actionTransformer;
  var _options$titleFormatt = options.titleFormatter;
  var titleFormatter = _options$titleFormatt === undefined ? defaultTitleFormatter(options) : _options$titleFormatt;
  var collapsed = options.collapsed;
  var colors = options.colors;
  var level = options.level;
  var diff = options.diff;

  buffer.forEach(function (logEntry, key) {
    var started = logEntry.started;
    var startedTime = logEntry.startedTime;
    var action = logEntry.action;
    var prevState = logEntry.prevState;
    var error = logEntry.error;
    var took = logEntry.took;
    var nextState = logEntry.nextState;

    var nextEntry = buffer[key + 1];

    if (nextEntry) {
      nextState = nextEntry.prevState;
      took = nextEntry.started - started;
    }

    // Message
    var formattedAction = actionTransformer(action);
    var isCollapsed = typeof collapsed === 'function' ? collapsed(function () {
      return nextState;
    }, action) : collapsed;

    var formattedTime = (0, _helpers.formatTime)(startedTime);
    var titleCSS = colors.title ? 'color: ' + colors.title(formattedAction) + ';' : null;
    var title = titleFormatter(formattedAction, formattedTime, took);

    // Render
    try {
      if (isCollapsed) {
        if (colors.title) logger.groupCollapsed('%c ' + title, titleCSS);else logger.groupCollapsed(title);
      } else {
        if (colors.title) logger.group('%c ' + title, titleCSS);else logger.group(title);
      }
    } catch (e) {
      logger.log(title);
    }

    var prevStateLevel = getLogLevel(level, formattedAction, [prevState], 'prevState');
    var actionLevel = getLogLevel(level, formattedAction, [formattedAction], 'action');
    var errorLevel = getLogLevel(level, formattedAction, [error, prevState], 'error');
    var nextStateLevel = getLogLevel(level, formattedAction, [nextState], 'nextState');

    if (prevStateLevel) {
      if (colors.prevState) logger[prevStateLevel]('%c prev state', 'color: ' + colors.prevState(prevState) + '; font-weight: bold', prevState);else logger[prevStateLevel]('prev state', prevState);
    }

    if (actionLevel) {
      if (colors.action) logger[actionLevel]('%c action', 'color: ' + colors.action(formattedAction) + '; font-weight: bold', formattedAction);else logger[actionLevel]('action', formattedAction);
    }

    if (error && errorLevel) {
      if (colors.error) logger[errorLevel]('%c error', 'color: ' + colors.error(error, prevState) + '; font-weight: bold', error);else logger[errorLevel]('error', error);
    }

    if (nextStateLevel) {
      if (colors.nextState) logger[nextStateLevel]('%c next state', 'color: ' + colors.nextState(nextState) + '; font-weight: bold', nextState);else logger[nextStateLevel]('next state', nextState);
    }

    if (diff) {
      (0, _diff2.default)(prevState, nextState, logger, isCollapsed);
    }

    try {
      logger.groupEnd();
    } catch (e) {
      logger.log('—— log end ——');
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUuanMiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJwcmludEJ1ZmZlciIsIl9oZWxwZXJzIiwicmVxdWlyZSIsIl9kaWZmIiwiX2RpZmYyIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX3RvQ29uc3VtYWJsZUFycmF5IiwiYXJyIiwiQXJyYXkiLCJpc0FycmF5IiwiaSIsImFycjIiLCJsZW5ndGgiLCJfdHlwZW9mIiwiY29uc3RydWN0b3IiLCJnZXRMb2dMZXZlbCIsImxldmVsIiwiYWN0aW9uIiwicGF5bG9hZCIsInR5cGUiLCJhcHBseSIsImRlZmF1bHRUaXRsZUZvcm1hdHRlciIsIm9wdGlvbnMiLCJ0aW1lc3RhbXAiLCJkdXJhdGlvbiIsInRpbWUiLCJ0b29rIiwicGFydHMiLCJwdXNoIiwidG9GaXhlZCIsImpvaW4iLCJidWZmZXIiLCJsb2dnZXIiLCJhY3Rpb25UcmFuc2Zvcm1lciIsIl9vcHRpb25zJHRpdGxlRm9ybWF0dCIsInRpdGxlRm9ybWF0dGVyIiwidW5kZWZpbmVkIiwiY29sbGFwc2VkIiwiY29sb3JzIiwiZGlmZiIsImZvckVhY2giLCJsb2dFbnRyeSIsImtleSIsInN0YXJ0ZWQiLCJzdGFydGVkVGltZSIsInByZXZTdGF0ZSIsImVycm9yIiwibmV4dFN0YXRlIiwibmV4dEVudHJ5IiwiZm9ybWF0dGVkQWN0aW9uIiwiaXNDb2xsYXBzZWQiLCJmb3JtYXR0ZWRUaW1lIiwiZm9ybWF0VGltZSIsInRpdGxlQ1NTIiwidGl0bGUiLCJncm91cENvbGxhcHNlZCIsImdyb3VwIiwiZSIsImxvZyIsInByZXZTdGF0ZUxldmVsIiwiYWN0aW9uTGV2ZWwiLCJlcnJvckxldmVsIiwibmV4dFN0YXRlTGV2ZWwiLCJncm91cEVuZCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQUEsT0FBT0MsY0FBUCxDQUFzQkMs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QUl0QixPQUFPckIsTUFBWCxFQUFtQmUsT0FBTzRCLFdBQVAsRUFBb0IsV0FBcEIsRUFBaUMsWUFBWXRCLE9BQU9yQixNQUFQLENBQWNnQyxlQUFkLENBQVosR0FBNkMscUJBQTlFLEVBQXFHQSxlQUFyRyxFQUFuQixLQUE4SWpCLE9BQU80QixXQUFQLEVBQW9CLFFBQXBCLEVBQThCWCxlQUE5QjtBQUMvSTs7QUFFRCxRQUFJSCxTQUFTZSxVQUFiLEVBQXlCO0FBQ3ZCLFVBQUl2QixPQUFPUSxLQUFYLEVBQWtCZCxPQUFPNkIsVUFBUCxFQUFtQixVQUFuQixFQUErQixZQUFZdkIsT0FBT1EsS0FBUCxDQUFhQSxLQUFiLEVBQW9CRCxTQUFwQixDQUFaLEdBQTZDLHFCQUE1RSxFQUFtR0MsS0FBbkcsRUFBbEIsS0FBaUlkLE9BQU82QixVQUFQLEVBQW1CLE9BQW5CLEVBQTRCZixLQUE1QjtBQUNsSTs7QUFFRCxRQUFJZ0IsY0FBSixFQUFvQjtBQUNsQixVQUFJeEIsT0FBT1MsU0FBWCxFQUFzQmYsT0FBTzhCLGNBQVAsRUFBdUIsZUFBdkIsRUFBd0MsWUFBWXhCLE9BQU9TLFNBQVAsQ0FBaUJBLFNBQWpCLENBQVosR0FBMEMscUJBQWxGLEVBQXlHQSxTQUF6RyxFQUF0QixLQUErSWYsT0FBTzhCLGNBQVAsRUFBdUIsWUFBdkIsRUFBcUNmLFNBQXJDO0FBQ2hKOztBQUVELFFBQUlSLElBQUosRUFBVTtBQUNSLE9BQUMsR0FBR3RDLE9BQU9JLE9BQVgsRUFBb0J3QyxTQUFwQixFQUErQkUsU0FBL0IsRUFBMENmLE1BQTFDLEVBQWtEa0IsV0FBbEQ7QUFDRDs7QUFFRCxRQUFJO0FBQ0ZsQixhQUFPK0IsUUFBUDtBQUNELEtBRkQsQ0FFRSxPQUFPTixDQUFQLEVBQVU7QUFDVnpCLGFBQU8wQixHQUFQLENBQVcsZUFBWDtBQUNEO0FBQ0YsR0FuRUQ7QUFvRUQiLCJmaWxlIjoidW5rbm93biIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucHJpbnRCdWZmZXIgPSBwcmludEJ1ZmZlcjtcblxudmFyIF9oZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG5cbnZhciBfZGlmZiA9IHJlcXVpcmUoJy4vZGlmZicpO1xuXG52YXIgX2RpZmYyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGlmZik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfVxuXG4vKipcbiAqIEdldCBsb2cgbGV2ZWwgc3RyaW5nIGJhc2VkIG9uIHN1cHBsaWVkIHBhcmFtc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgZnVuY3Rpb24gfCBvYmplY3R9IGxldmVsIC0gY29uc29sZVtsZXZlbF1cbiAqIEBwYXJhbSB7b2JqZWN0fSBhY3Rpb24gLSBzZWxlY3RlZCBhY3Rpb25cbiAqIEBwYXJhbSB7YXJyYXl9IHBheWxvYWQgLSBzZWxlY3RlZCBwYXlsb2FkXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIGxvZyBlbnRyeSB0eXBlXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gbGV2ZWxcbiAqL1xuZnVuY3Rpb24gZ2V0TG9nTGV2ZWwobGV2ZWwsIGFjdGlvbiwgcGF5bG9hZCwgdHlwZSkge1xuICBzd2l0Y2ggKHR5cGVvZiBsZXZlbCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YobGV2ZWwpKSB7XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIHJldHVybiB0eXBlb2YgbGV2ZWxbdHlwZV0gPT09ICdmdW5jdGlvbicgPyBsZXZlbFt0eXBlXS5hcHBseShsZXZlbCwgX3RvQ29uc3VtYWJsZUFycmF5KHBheWxvYWQpKSA6IGxldmVsW3R5cGVdO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHJldHVybiBsZXZlbChhY3Rpb24pO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbGV2ZWw7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVmYXVsdFRpdGxlRm9ybWF0dGVyKG9wdGlvbnMpIHtcbiAgdmFyIHRpbWVzdGFtcCA9IG9wdGlvbnMudGltZXN0YW1wO1xuICB2YXIgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uLCB0aW1lLCB0b29rKSB7XG4gICAgdmFyIHBhcnRzID0gWydhY3Rpb24nXTtcbiAgICBpZiAodGltZXN0YW1wKSB7XG4gICAgICBwYXJ0cy5wdXNoKCdAICcgKyB0aW1lKTtcbiAgICB9XG4gICAgcGFydHMucHVzaChhY3Rpb24udHlwZSk7XG4gICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICBwYXJ0cy5wdXNoKCcoaW4gJyArIHRvb2sudG9GaXhlZCgyKSArICcgbXMpJyk7XG4gICAgfVxuICAgIHJldHVybiBwYXJ0cy5qb2luKCcgJyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByaW50QnVmZmVyKGJ1ZmZlciwgb3B0aW9ucykge1xuICB2YXIgbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXI7XG4gIHZhciBhY3Rpb25UcmFuc2Zvcm1lciA9IG9wdGlvbnMuYWN0aW9uVHJhbnNmb3JtZXI7XG4gIHZhciBfb3B0aW9ucyR0aXRsZUZvcm1hdHQgPSBvcHRpb25zLnRpdGxlRm9ybWF0dGVyO1xuICB2YXIgdGl0bGVGb3JtYXR0ZXIgPSBfb3B0aW9ucyR0aXRsZUZvcm1hdHQgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRUaXRsZUZvcm1hdHRlcihvcHRpb25zKSA6IF9vcHRpb25zJHRpdGxlRm9ybWF0dDtcbiAgdmFyIGNvbGxhcHNlZCA9IG9wdGlvbnMuY29sbGFwc2VkO1xuICB2YXIgY29sb3JzID0gb3B0aW9ucy5jb2xvcnM7XG4gIHZhciBsZXZlbCA9IG9wdGlvbnMubGV2ZWw7XG4gIHZhciBkaWZmID0gb3B0aW9ucy5kaWZmO1xuXG4gIGJ1ZmZlci5mb3JFYWNoKGZ1bmN0aW9uIChsb2dFbnRyeSwga2V5KSB7XG4gICAgdmFyIHN0YXJ0ZWQgPSBsb2dFbnRyeS5zdGFydGVkO1xuICAgIHZhciBzdGFydGVkVGltZSA9IGxvZ0VudHJ5LnN0YXJ0ZWRUaW1lO1xuICAgIHZhciBhY3Rpb24gPSBsb2dFbnRyeS5hY3Rpb247XG4gICAgdmFyIHByZXZTdGF0ZSA9IGxvZ0VudHJ5LnByZXZTdGF0ZTtcbiAgICB2YXIgZXJyb3IgPSBsb2dFbnRyeS5lcnJvcjtcbiAgICB2YXIgdG9vayA9IGxvZ0VudHJ5LnRvb2s7XG4gICAgdmFyIG5leHRTdGF0ZSA9IGxvZ0VudHJ5Lm5leHRTdGF0ZTtcblxuICAgIHZhciBuZXh0RW50cnkgPSBidWZmZXJba2V5ICsgMV07XG5cbiAgICBpZiAobmV4dEVudHJ5KSB7XG4gICAgICBuZXh0U3RhdGUgPSBuZXh0RW50cnkucHJldlN0YXRlO1xuICAgICAgdG9vayA9IG5leHRFbnRyeS5zdGFydGVkIC0gc3RhcnRlZDtcbiAgICB9XG5cbiAgICAvLyBNZXNzYWdlXG4gICAgdmFyIGZvcm1hdHRlZEFjdGlvbiA9IGFjdGlvblRyYW5zZm9ybWVyKGFjdGlvbik7XG4gICAgdmFyIGlzQ29sbGFwc2VkID0gdHlwZW9mIGNvbGxhcHNlZCA9PT0gJ2Z1bmN0aW9uJyA/IGNvbGxhcHNlZChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgIH0sIGFjdGlvbikgOiBjb2xsYXBzZWQ7XG5cbiAgICB2YXIgZm9ybWF0dGVkVGltZSA9ICgwLCBfaGVscGVycy5mb3JtYXRUaW1lKShzdGFydGVkVGltZSk7XG4gICAgdmFyIHRpdGxlQ1NTID0gY29sb3JzLnRpdGxlID8gJ2NvbG9yOiAnICsgY29sb3JzLnRpdGxlKGZvcm1hdHRlZEFjdGlvbikgKyAnOycgOiBudWxsO1xuICAgIHZhciB0aXRsZSA9IHRpdGxlRm9ybWF0dGVyKGZvcm1hdHRlZEFjdGlvbiwgZm9ybWF0dGVkVGltZSwgdG9vayk7XG5cbiAgICAvLyBSZW5kZXJcbiAgICB0cnkge1xuICAgICAgaWYgKGlzQ29sbGFwc2VkKSB7XG4gICAgICAgIGlmIChjb2xvcnMudGl0bGUpIGxvZ2dlci5ncm91cENvbGxhcHNlZCgnJWMgJyArIHRpdGxlLCB0aXRsZUNTUyk7ZWxzZSBsb2dnZXIuZ3JvdXBDb2xsYXBzZWQodGl0bGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNvbG9ycy50aXRsZSkgbG9nZ2VyLmdyb3VwKCclYyAnICsgdGl0bGUsIHRpdGxlQ1NTKTtlbHNlIGxvZ2dlci5ncm91cCh0aXRsZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmxvZyh0aXRsZSk7XG4gICAgfVxuXG4gICAgdmFyIHByZXZTdGF0ZUxldmVsID0gZ2V0TG9nTGV2ZWwobGV2ZWwsIGZvcm1hdHRlZEFjdGlvbiwgW3ByZXZTdGF0ZV0sICdwcmV2U3RhdGUnKTtcbiAgICB2YXIgYWN0aW9uTGV2ZWwgPSBnZXRMb2dMZXZlbChsZXZlbCwgZm9ybWF0dGVkQWN0aW9uLCBbZm9ybWF0dGVkQWN0aW9uXSwgJ2FjdGlvbicpO1xuICAgIHZhciBlcnJvckxldmVsID0gZ2V0TG9nTGV2ZWwobGV2ZWwsIGZvcm1hdHRlZEFjdGlvbiwgW2Vycm9yLCBwcmV2U3RhdGVdLCAnZXJyb3InKTtcbiAgICB2YXIgbmV4dFN0YXRlTGV2ZWwgPSBnZXRMb2dMZXZlbChsZXZlbCwgZm9ybWF0dGVkQWN0aW9uLCBbbmV4dFN0YXRlXSwgJ25leHRTdGF0ZScpO1xuXG4gICAgaWYgKHByZXZTdGF0ZUxldmVsKSB7XG4gICAgICBpZiAoY29sb3JzLnByZXZTdGF0ZSkgbG9nZ2VyW3ByZXZTdGF0ZUxldmVsXSgnJWMgcHJldiBzdGF0ZScsICdjb2xvcjogJyArIGNvbG9ycy5wcmV2U3RhdGUocHJldlN0YXRlKSArICc7IGZvbnQtd2VpZ2h0OiBib2xkJywgcHJldlN0YXRlKTtlbHNlIGxvZ2dlcltwcmV2U3RhdGVMZXZlbF0oJ3ByZXYgc3RhdGUnLCBwcmV2U3RhdGUpO1xuICAgIH1cblxuICAgIGlmIChhY3Rpb25MZXZlbCkge1xuICAgICAgaWYgKGNvbG9ycy5hY3Rpb24pIGxvZ2dlclthY3Rpb25MZXZlbF0oJyVjIGFjdGlvbicsICdjb2xvcjogJyArIGNvbG9ycy5hY3Rpb24oZm9ybWF0dGVkQWN0aW9uKSArICc7IGZvbnQtd2VpZ2h0OiBib2xkJywgZm9ybWF0dGVkQWN0aW9uKTtlbHNlIGxvZ2dlclthY3Rpb25MZXZlbF0oJ2FjdGlvbicsIGZvcm1hdHRlZEFjdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKGVycm9yICYmIGVycm9yTGV2ZWwpIHtcbiAgICAgIGlmIChjb2xvcnMuZXJyb3IpIGxvZ2dlcltlcnJvckxldmVsXSgnJWMgZXJyb3InLCAnY29sb3I6ICcgKyBjb2xvcnMuZXJyb3IoZXJyb3IsIHByZXZTdGF0ZSkgKyAnOyBmb250LXdlaWdodDogYm9sZCcsIGVycm9yKTtlbHNlIGxvZ2dlcltlcnJvckxldmVsXSgnZXJyb3InLCBlcnJvcik7XG4gICAgfVxuXG4gICAgaWYgKG5leHRTdGF0ZUxldmVsKSB7XG4gICAgICBpZiAoY29sb3JzLm5leHRTdGF0ZSkgbG9nZ2VyW25leHRTdGF0ZUxldmVsXSgnJWMgbmV4dCBzdGF0ZScsICdjb2xvcjogJyArIGNvbG9ycy5uZXh0U3RhdGUobmV4dFN0YXRlKSArICc7IGZvbnQtd2VpZ2h0OiBib2xkJywgbmV4dFN0YXRlKTtlbHNlIGxvZ2dlcltuZXh0U3RhdGVMZXZlbF0oJ25leHQgc3RhdGUnLCBuZXh0U3RhdGUpO1xuICAgIH1cblxuICAgIGlmIChkaWZmKSB7XG4gICAgICAoMCwgX2RpZmYyLmRlZmF1bHQpKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCBsb2dnZXIsIGlzQ29sbGFwc2VkKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgbG9nZ2VyLmdyb3VwRW5kKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmxvZygn4oCU4oCUIGxvZyBlbmQg4oCU4oCUJyk7XG4gICAgfVxuICB9KTtcbn0iXX0=