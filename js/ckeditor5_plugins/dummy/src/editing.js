/**
 * @file
 * Defines the Editing plugin.
 */

/**
 * @module dummy/DummyEditing
 */

import {Plugin} from 'ckeditor5/src/core';
import { refineStyles } from './utils.js';

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

    this._defineSchema();
    this._defineConverters();
    this._NBPSfix();

    const htmlSupport = editor.plugins.get('DataFilter');
    if (!htmlSupport) {
      console.warn('DataFilter plugin is not available!');
    } else {
      const textFormatSettings = editor.config.get('dummy');

//      this._addClassSupport('span', textFormatSettings.classes);
      this._addClassSupport('div', textFormatSettings.classes_div);
      this._addClassSupport('ol', textFormatSettings.classes_ol);
      this._addClassSupport('ul', textFormatSettings.classes_ul);

      // enable all styles* for div (class is not required case)
      htmlSupport.allowAttributes({
        name: 'div',
        styles: [
          {
            key: /^(?!\s*(color|background-color)\b).*/, // Match any style excluding color/background-color
            value: true        // Match any value.
          }
        ],
      });

    }
  }

  _addClassSupport(tag, classes) {
    const htmlSupport = this.editor.plugins.get('DataFilter');

    const classesList = classes.split(/[\s,]+/);
    if (classesList.length == 1 && classesList[0] == '') return;

    // just classes alone
    htmlSupport.allowAttributes({
      name: tag,
      classes: RegExp('^(' + classesList.join('|') + ')$'),
    });

    // just classes + styles
    htmlSupport.allowAttributes({
      name: tag,
      classes: RegExp('^(' + classesList.join('|') + ')$'),
      styles: [
        {
          key: /^(?!\s*(color|background-color)\b).*/, // Match any style excluding color/background-color
          value: true        // Match any value.
        }
      ],
    });
  }

  /**
    * Registers schema.
    *
    * @private
    */
  _defineSchema() {
    const schema = this.editor.model.schema;

    // dummy element.
    schema.register('dummy', {
      allowIn: [ 'paragraph', '$container', 'htmlDivParagraph' ],
      inheritAllFrom: '$inline',
      isInline: true,
      isObject: false,
      isSelectable: true,
      allowAttributes: [
        'modelClass',
        'modelStyle',
      ],
      allowChildren: [
        '$inline',
        '$text',
        'dummy',
      ],
    });

  }

  _defineConverters() {
    const {conversion} = this.editor;
    const textFormatSettings = this.editor.config.get('dummy');
    const classesList = textFormatSettings.classes.split(/[\s,]+/);

    for (const className of classesList) {
      if (className.length == 0) continue;

      // Dummy. View -> Model.
      conversion.for('upcast').elementToElement({
        view: {
          name: 'span',
          classes: [ className ],
        },
        converterPriority: 'highest',
        model: (viewElement, conversionApi ) => {

          let classes = viewElement.getAttribute('class');
          if (!classes) {
            return null;
          }

          const attrs = {
            modelClass: classes,
            modelStyle: viewElement.getAttribute('style') || '',
          };

          attrs.modelStyle = refineStyles(attrs.modelStyle, ['color', 'background-color'])
          return conversionApi.writer.createElement( 'dummy', attrs );
        },
      });

      // Dummy. Model -> View.
      conversion.for('downcast').elementToElement({
        model: 'dummy',
        view: (modelElement, { writer }) => {
          const classes = [];
          if (modelElement.getAttribute('modelClass')) {
            classes.push(modelElement.getAttribute('modelClass'));
          }

          let htmlAttrs = {
            'class': classes.length ? classes.join(' ') : null,
            'style': modelElement.getAttribute('modelStyle')
          };
          return writer.createContainerElement('span', htmlAttrs );
        }
      });

    }
  }

  _NBPSfix() {
    const {conversion} = this.editor;

    conversion.for('downcast').elementToElement({
      model: 'htmlDivParagraph',
      converterPriority: 'high',
      view: (modelElement, { writer }) => {
        let htmlAttrs = {
          class: modelElement.getAttribute('class') || null,
          style: modelElement.getAttribute('style') || null,
        }

        const div = writer.createContainerElement('div', htmlAttrs );
        const text = writer.createText('');
        writer.insert(writer.createPositionAt(div, 0), [text]);
        return div
      }
    });
  }

}
