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
/* ft-styler element demo */
/* Imports */
/**

An element that lets designers apply CSS style to FileThis elements.

@demo
 */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/polymer/polymer-legacy.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '../ft-styler.js';
import './ft-styleable.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer
({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>

            /* Styling for this component itself */
            :host {
                display: block;
                overflow: hidden;
                @apply --layout-horizontal;
            }

        </style>

        <ft-styler target="{{target}}" style="border-right:1px solid black; ">
        </ft-styler>

        <!-- Use a polymer class as a parent instead of a "div" so that it has a shadow root, which is needed by the styler target code -->
        <paper-listbox id="parent">

            <ft-styleable id="first">
            </ft-styleable>

            <ft-styleable id="second">
            </ft-styleable>
        </paper-listbox>
`,

  is: 'demo-fixture',

  properties:
      {
          target: {
              type: Object,
              notify: true
          },
      },

  ready: function()
  {
      this.async(function()
      {
          // this.target = this.$.first;
          this.target = this.$.parent;
          // this.target = this;
      });
  }
});
