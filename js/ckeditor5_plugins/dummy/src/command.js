/**
 * @file
 * Defines the Command plugin.
 */

import { Command } from 'ckeditor5/src/core';

/**
 * The dummy command.
 *
 * @extends module:core/command~Command
 */
export default class DummyCommand extends Command {

  elemName = 'dummy';

  /**
   * @inheritDoc
   */
  refresh() {}

  /**
   * @inheritDoc
   */
  execute(options = {}) { }
}
