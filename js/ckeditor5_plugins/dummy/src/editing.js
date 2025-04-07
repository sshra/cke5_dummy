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

    this._defineSchema();
    this._defineConverters();

    const htmlSupport = editor.plugins.get('DataFilter');
    if (!htmlSupport) {
      console.warn('DataFilter plugin is not available!');
    } else {
      const textFormatSettings = editor.config.get('dummy');

///      this._addClassSupport('span', textFormatSettings.classes);
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

  /**
    * Registers schema.
    *
    * @private
    */
  _defineSchema() {
    const schema = this.editor.model.schema;

    // dummy element.
    schema.register('dummy', {
      allowIn: [ 'paragraph' ],
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

          var attrs = {
            modelClass: classes,
            modelStyle: viewElement.getAttribute('style'),
          };

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
            'class': classes.join(' '),
            'style': modelElement.getAttribute('modelStyle')
          };
          return writer.createContainerElement('span', htmlAttrs );
        }
      });

    }
  }

}
