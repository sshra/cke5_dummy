/**
 * @file
 * Defines the Editing plugin.
 */

/**
 * @module dummy/DummyEditing
 */

import {Plugin} from 'ckeditor5/src/core';

/**
 * The editing feature.
 *
 * @extends module:core/plugin~Plugin
 */
export default class DummyEditing extends Plugin {
  /**
   * @inheritDoc
   */
  init() {
    const editor = this.editor;

    const htmlSupport = editor.plugins.get('DataFilter');
    if (!htmlSupport) {
      console.warn('DataFilter plugin is not available!');
    } else {
      const textFormatSettings = editor.config.get('dummy');

      this._addClassSupport('span', textFormatSettings.classes);
      this._addClassSupport('div', textFormatSettings.classes_div);
      this._addClassSupport('ol', textFormatSettings.classes_ol);
      this._addClassSupport('ul', textFormatSettings.classes_ul);
    }

  }

  _addClassSupport(tag, classes) {
    const htmlSupport = this.editor.plugins.get('DataFilter');

    const classesList = classes.split(/[\s,]+/);
    if (classesList[0] == '') return;

    htmlSupport.allowAttributes({
      name: tag,
      classes: RegExp('^(' + classesList.join('|') + ')$'),
    });
  }

}
