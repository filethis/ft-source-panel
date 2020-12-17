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
`<ft-css-declaration-editor>`

aaaaaaaaa

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import 'ft-labeled-icon-button/ft-labeled-icon-button.js';

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-label/iron-label.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                @apply --layout-horizontal;
                @apply --layout-end;
            }
        </style>

        <!-- Name -->
        <paper-input id="nameField" class="flex" value="{{declaration.name}}" label="Property">
        </paper-input>

        <div style="width:16px; "></div>

        <!-- Value -->
        <paper-input id="valueField" class="flex" value="{{declaration.value}}" label="Value">
        </paper-input>

        <!-- Delete button -->
        <ft-labeled-icon-button id="deleteButton" icon="remove" label="Delete" on-tap="_onDeleteButtonClicked">
        </ft-labeled-icon-button>
`,

  is: 'ft-css-declaration-editor',

  observers: [
      '_onDeclarationChanged(declaration.*)'
  ],

  properties: {
      declaration:
      {
          type: Object,
          notify: true
      }
  },

  _onDeclarationChanged: function()
  {
      this.fire('declaration-changed', this.declaration);
  },

  _onDeleteButtonClicked: function(event, detail)
  {
      this.fire('delete-declaration-command', this.declaration);
  }
});
