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
/* Imports */
/**

This element defines a source grid example that allows experimentation with configuration.

@demo
 */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

import 'juicy-ace-editor/juicy-ace-editor.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/polymer/polymer-legacy.js';
import '@polymer/polymer/lib/elements/custom-style.js';
import '../ft-source-panel-settings-behavior.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer
({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                @apply --layout-vertical;
                @apply --ft-source-panel-settings-editor;
            }
        </style>

        <custom-style>
            <style>
                paper-checkbox {
                    width: 165px;
                    margin-bottom: 16px;
                }
            </style>
        </custom-style>

        <!-- Settings -->
        <paper-checkbox checked="{{ftSourcePanelShowHeading}}">
            Show Heading
        </paper-checkbox>

        <paper-input id="headingField" value="{{ftSourcePanelHeading}}" label="Heading" style="width:200px;">
        </paper-input>

        <!-- Filters -->
        <div class="layout horizontal center" style="margin-top: 14px; ">

            <div class="flex" style="
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12pt;
            ">
                Filters:
            </div>
            <paper-button id="applyFiltersButton" raised="" on-tap="_onApplyFiltersButtonTapped" style="width: 65px; height: 16px; font-size: 9pt; ">
                Apply --&gt;
            </paper-button>

        </div>

        <juicy-ace-editor id="filtersField" class="scroll" style="width: 370px; height: 165px; border:1px solid #DDD; margin-top: 5px; " theme="ace/theme/chrome" mode="ace/mode/json" fontsize="14px" softtabs="" value="[[ftSourcePanelFilters]]" tabsize="4">
        </juicy-ace-editor>

        <div style="height:20px"></div>

        <paper-checkbox checked="{{ftSourcePanelShowFilters}}">
            Show Filters
        </paper-checkbox>

        <paper-checkbox checked="{{ftSourcePanelShowSearchField}}">
            Show Search Field
        </paper-checkbox>
`,

  is: 'ft-source-panel-settings-editor',
  behaviors: [FileThis.SourcePanelSettingsBehavior],

  _onApplyFiltersButtonTapped: function(event)
  {
      var editor = this.$.filtersField;
      this.ftSourcePanelFilters = editor.value;
  }
});
