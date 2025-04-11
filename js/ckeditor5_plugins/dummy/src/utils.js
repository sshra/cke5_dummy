/**
 * @file
 * Defines a helper class and functions.
 */

export function refineStyles(stylesStr, excludeStyleList) {
  if (!excludeStyleList.length) return stylesStr;

  const styleFilter = new RegExp('^\\s*(' + excludeStyleList.join('|') + ')\\b');

  return stylesStr
  .split( ';' )
  .map( s => s.trim() )
  .filter( s => !styleFilter.test( s ) )
  .join( '; ' );
}
