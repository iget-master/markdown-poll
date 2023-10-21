import type { NextRequest } from 'next/server';

import validateColor from 'validate-color';
import { validateHTMLColorHex } from 'validate-color';

// Represents the parameters for the `getPropertyByAlias` function.
export type GetPropertyByAliasParams = {
  /**
   * The NextJs request object.
   */
  request: NextRequest;

  /**
   * Possible values for the specified property.
   */
  alias: string[];

  /**
   * The default value if no match is found in the alias list.
   */
  defaultValue: string;

  /**
   * A function to validate the property value.
   * If the validator returns undefined, the value is considered invalid, and the defaultValue is used.
   */
  validator?: (value: string) => string | undefined;
};

export function getPollImageProperties(request: NextRequest) {
  const background = getPropertyByAlias({
    request,
    defaultValue: '#EEEEEE',
    validator: isColor,
    alias: ['bg', 'background', 'backgroundColor', 'background_color'],
  });

  const backgroundFilled = getPropertyByAlias({
    request,
    defaultValue: '#9999CC',
    validator: isColor,
    alias: [
      'bgFilled',
      'bg_filled',
      'backgroundFilled',
      'background_filled',
      'backgroundColorFilled',
      'background_color_filled',
    ],
  });

  const color = getPropertyByAlias({
    request,
    defaultValue: 'black',
    alias: ['color', 'textColor', 'text_color'],
    validator: isColor,
  });

  const fontSize = getPropertyByAlias({
    request,
    defaultValue: '16',
    alias: ['font_size', 'fontSize'],
    validator: isNumber,
  });

  return { background, backgroundFilled, fontSize, color };
}

export function getPropertyByAlias({
  request,
  alias,
  defaultValue,
  validator,
}: GetPropertyByAliasParams) {
  const itemFound = alias
    .map((alias) => request.nextUrl.searchParams.get(alias))
    .find(Boolean);

  const value = itemFound && validator ? validator(itemFound) : itemFound;

  return value || defaultValue;
}

function isColor(value: string) {
  const hexColor = `#${value}`;

  if (validateHTMLColorHex(hexColor)) {
    return hexColor;
  }

  return validateColor(value) ? value : undefined;
}

function isNumber(value: string) {
  if (isNaN(Number(value))) {
    return undefined;
  }

  return value;
}
