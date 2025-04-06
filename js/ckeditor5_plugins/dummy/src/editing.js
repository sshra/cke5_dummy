/**
 * @file
 * Defines the Editing plugin.
 */

/**
 * @module dummy/DummyEditing
 */

import {Plugin} from 'ckeditor5/src/core';
import DummyCommand from "./command";

/**
 * The editing feature.
 *
 * It introduces the 'dummy' element in the model.
 *
 * @extends module:core/plugin~Plugin
 */
export default class DummyEditing extends Plugin {

  /**
   * @inheritDoc
   */
  init() {
    this._defineSchema();
    this._defineConverters();

    const editor = this.editor;

    // Attaching the command to the editor.
    editor.commands.add(
      'dummyCommand',
      new DummyCommand(this.editor),
    );

  }

  /**
   * Registers schema.
   *
   * @private
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    // parent element.
    schema.register('dummy', {
      allowIn: [ 'paragraph' ],
      inheritAllFrom: '$inline',

      isInline: true,
      isObject: false,
      isSelectable: true,

      allowAttributes: [
        'modelClass',
      ],
      allowChildren: [
        '$inline',
        '$text',
      ],
    });

  }

  /**
   * Defines converters.
   */
  _defineConverters() {
    const {conversion} = this.editor;
    const textFormatSettings = this.editor.config.get('dummy');
    const classesList = textFormatSettings.classes.split(/[\s,]+/);

    for (const className of classesList) {

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
            'class': classes.join(' ')
          };
          return writer.createContainerElement('span', htmlAttrs );
        }
      });

    }

  }
}
