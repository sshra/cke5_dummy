!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.CKEditor5=n():(e.CKEditor5=e.CKEditor5||{},e.CKEditor5.dummy=n())}(self,(()=>(()=>{var __webpack_modules__={"./js/ckeditor5_plugins/dummy/src/editing.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DummyEditing)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/**\n * @file\n * Defines the Editing plugin.\n */\n\n/**\n * @module dummy/DummyEditing\n */\n\n\n\n/**\n * The editing feature.\n *\n * @extends module:core/plugin~Plugin\n */\nclass DummyEditing extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n  /**\n   * @inheritDoc\n   */\n  init() {\n    const editor = this.editor;\n\n    this._defineSchema();\n    this._defineConverters();\n\n    const htmlSupport = editor.plugins.get('DataFilter');\n    if (!htmlSupport) {\n      console.warn('DataFilter plugin is not available!');\n    } else {\n      const textFormatSettings = editor.config.get('dummy');\n\n///      this._addClassSupport('span', textFormatSettings.classes);\n      this._addClassSupport('div', textFormatSettings.classes_div);\n      this._addClassSupport('ol', textFormatSettings.classes_ol);\n      this._addClassSupport('ul', textFormatSettings.classes_ul);\n\n      // enable all styles* for div (class is not required case)\n      htmlSupport.allowAttributes({\n        name: 'div',\n        styles: [\n          {\n            key: /^(?!\\s*(color|background-color)\\b).*/, // Match any style excluding color/background-color\n            value: true        // Match any value.\n          }\n        ],\n      });\n\n    }\n\n    // editor.model.document.on('change:data', () => {\n    //   const { model } = editor;\n\n    //   model.change((writer) => {\n    //     const modelRoot = model.document.getRoot();\n    //     const firstElement = modelRoot.getChild(0); // ← первый элемент\n\n    //     console.log(firstElement); //\n    //   })\n    // });\n\n  }\n\n  _addClassSupport(tag, classes) {\n    const htmlSupport = this.editor.plugins.get('DataFilter');\n\n    const classesList = classes.split(/[\\s,]+/);\n    if (classesList[0] == '') return;\n\n    htmlSupport.allowAttributes({\n      name: tag,\n      classes: RegExp('^(' + classesList.join('|') + ')$'),\n      styles: [\n        {\n          key: /^(?!\\s*(color|background-color)\\b).*/, // Match any style excluding color/background-color\n          value: true        // Match any value.\n        }\n      ],\n    });\n  }\n\n  /**\n    * Registers schema.\n    *\n    * @private\n    */\n  _defineSchema() {\n    const schema = this.editor.model.schema;\n\n    // dummy element.\n    schema.register('dummy', {\n      allowIn: [ 'paragraph', '$container', 'htmlDivParagraph' ],\n      inheritAllFrom: '$inline',\n      isInline: true,\n      isObject: false,\n      isSelectable: true,\n      allowAttributes: [\n        'modelClass',\n        'modelStyle',\n      ],\n      allowChildren: [\n        '$inline',\n        '$text',\n        'dummy',\n      ],\n    });\n\n  }\n\n  _defineConverters() {\n    const {conversion} = this.editor;\n    const textFormatSettings = this.editor.config.get('dummy');\n    const classesList = textFormatSettings.classes.split(/[\\s,]+/);\n\n    for (const className of classesList) {\n      if (className.length == 0) continue;\n\n      // Dummy. View -> Model.\n      conversion.for('upcast').elementToElement({\n        view: {\n          name: 'span',\n          classes: [ className ],\n        },\n        converterPriority: 'highest',\n        model: (viewElement, conversionApi ) => {\n\n          let classes = viewElement.getAttribute('class');\n          if (!classes) {\n            return null;\n          }\n\n          const attrs = {\n            modelClass: classes,\n            modelStyle: viewElement.getAttribute('style') || '',\n          };\n\n          attrs.modelStyle = attrs.modelStyle\n            .split( ';' )\n            .map( s => s.trim() )\n            .filter( s => !/^\\s*(color|background-color)\\b/.test( s ) )\n            .join( '; ' );\n\n          return conversionApi.writer.createElement( 'dummy', attrs );\n        },\n      });\n\n      // Dummy. Model -> View.\n      conversion.for('downcast').elementToElement({\n        model: 'dummy',\n        view: (modelElement, { writer }) => {\n          const classes = [];\n          if (modelElement.getAttribute('modelClass')) {\n            classes.push(modelElement.getAttribute('modelClass'));\n          }\n          let htmlAttrs = {\n            'class': classes.join(' '),\n            'style': modelElement.getAttribute('modelStyle')\n          };\n          return writer.createContainerElement('span', htmlAttrs );\n        }\n      });\n\n    }\n  }\n\n}\n\n\n//# sourceURL=webpack://CKEditor5.dummy/./js/ckeditor5_plugins/dummy/src/editing.js?")},"./js/ckeditor5_plugins/dummy/src/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ "ckeditor5/src/core.js");\n/* harmony import */ var _editing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./editing */ "./js/ckeditor5_plugins/dummy/src/editing.js");\n/**\n * @file\n * Defines the Dummy plugin.\n */\n\n/**\n * @module dummy/Dummy\n */\n\n\n\n\n/**\n * The Dummy plugin.\n *\n * This is a "glue" plugin that loads\n *\n * @extends module:core/plugin~Plugin\n */\nclass Dummy extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n\n  /**\n   * @inheritdoc\n   */\n  static get requires() {\n    return [_editing__WEBPACK_IMPORTED_MODULE_1__["default"]];\n  }\n\n  /**\n   * @inheritdoc\n   */\n  static get pluginName() {\n    return \'plugDummy\';\n  }\n\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  Dummy,\n});\n\n\n//# sourceURL=webpack://CKEditor5.dummy/./js/ckeditor5_plugins/dummy/src/index.js?')},"ckeditor5/src/core.js":(module,__unused_webpack_exports,__webpack_require__)=>{eval('module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ "dll-reference CKEditor5.dll"))("./src/core.js");\n\n//# sourceURL=webpack://CKEditor5.dummy/delegated_./core.js_from_dll-reference_CKEditor5.dll?')},"dll-reference CKEditor5.dll":e=>{"use strict";e.exports=CKEditor5.dll}},__webpack_module_cache__={};function __webpack_require__(e){var n=__webpack_module_cache__[e];if(void 0!==n)return n.exports;var t=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](t,t.exports,__webpack_require__),t.exports}__webpack_require__.d=(e,n)=>{for(var t in n)__webpack_require__.o(n,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},__webpack_require__.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var __webpack_exports__=__webpack_require__("./js/ckeditor5_plugins/dummy/src/index.js");return __webpack_exports__=__webpack_exports__.default,__webpack_exports__})()));