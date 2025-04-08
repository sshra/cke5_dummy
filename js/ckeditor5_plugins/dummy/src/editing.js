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

    // editor.model.document.on('change:data', () => {
    //   const { model } = editor;

    //   model.change((writer) => {
    //     const modelRoot = model.document.getRoot();
    //     const firstElement = modelRoot.getChild(0); // ← первый элемент

    //     console.log(firstElement); //
    //   })
    // });

  }

  _addClassSupport(tag, classes) {
    const htmlSupport = this.editor.plugins.get('DataFilter');

    const classesList = classes.split(/[\s,]+/);
    if (classesList[0] == '') return;

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

          attrs.modelStyle = attrs.modelStyle
            .split( ';' )
            .map( s => s.trim() )
            .filter( s => !/^\s*(color|background-color)\b/.test( s ) )
            .join( '; ' );

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
