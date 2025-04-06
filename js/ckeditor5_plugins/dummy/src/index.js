/**
 * @file
 * Defines the Dummy plugin.
 */

/**
 * @module dummy/Dummy
 */

import { Plugin } from 'ckeditor5/src/core';
import DummyEditing from './editing';

/**
 * The Dummy plugin.
 *
 * This is a "glue" plugin that loads
 *
 * @extends module:core/plugin~Plugin
 */
class Dummy extends Plugin {

  /**
   * @inheritdoc
   */
  static get requires() {
    return [DummyEditing];
  }

  /**
   * @inheritdoc
   */
  static get pluginName() {
    return 'plugDummy';
  }

}

export default {
  Dummy,
};
