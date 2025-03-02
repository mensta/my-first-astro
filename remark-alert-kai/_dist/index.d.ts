import { Properties } from 'hast';
import { Root } from 'mdast';
import { Plugin } from 'unified';
import { ReadonlyDeep } from 'type-fest';

/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

declare const remarkAdmonition: Plugin<[
    (ReadonlyDeep<RemarkAdmonitionOptions> | null | undefined)?
], Root, Root>;
type RemarkAdmonitionOptions = {
    defaultElement?: string;
    defaultProperties?: Properties;
    types?: Map<string, Admonition>;
};
type Admonition = {
    defaultLabel?: string;
    element?: string;
    properties?: Properties;
};
declare const DEFAULT_ADMONITION_TYPES: ReadonlyDeep<Map<string, Admonition>>;
declare module 'mdast' {
    interface Data {
        directiveLabel?: boolean;
    }
}

export { type Admonition, DEFAULT_ADMONITION_TYPES, type RemarkAdmonitionOptions, remarkAdmonition };
