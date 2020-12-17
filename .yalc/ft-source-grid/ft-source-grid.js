/*
Copyright 2018 FileThis, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/**
`<ft-source-grid>`

This element displays a grid layout of FileThis source resources.

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import 'ft-source-grid-item/ft-source-grid-item.js';

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/polymer/polymer-legacy.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                @apply --layout-vertical;
                @apply --ft-source-grid;
            }
            .sourceGrid {
                background-color: white;
                @apply --ft-source-grid-grid;
            }
        </style>

        <iron-list grid="" id="sourceGrid" selection-enabled="" class="flex" items="[[sources]]" selected-item="{{selectedSource}}" as="source">

            <!-- Source item template -->
            <template>
                <ft-source-grid-item source="[[source]]" selected="[[selected]]">
                </ft-source-grid-item>
            </template>
        </iron-list>
`,

  is: 'ft-source-grid',

  listeners:
  {
      'tap': '_onTap'
  },

  properties: {

      /** The list of source resources to be be displayed. */
      sources:
      {
          type: Array,
          notify: true,
          value: []
      },

      /** The currently-selected source, if any. */
      selectedSource:
      {
          type: Object,
          notify: true,
          value: null
      }
  },

  _onTap: function()
  {
      // if (event.ftComponentName === undefined)
      //     event.ftComponentName = "ft-source-grid";
  },

  clearSelection: function()
  {
      this.$.sourceGrid.clearSelection();
  }
});
