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
/* FileThis demo element */
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
import '@polymer/polymer/polymer-legacy.js';
import '../ft-source-panel.js';
import '../ft-source-panel-settings.js';
import '../ft-source-panel-settings-behavior.js';
import './ft-source-panel-settings-editor.js';
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
                width:500px;
                height:500px;
            }
        </style>

        <!-- Set a couple settings -->
        <!--<ft-source-panel-settings-->
            <!--ft-source-panel-heading="Please choose a site"-->
            <!--ft-source-panel-show-heading=false-->
        <!--&gt;-->
        <!--</ft-source-panel-settings>-->

        <ft-element-demo name="ft-source-panel" show-config="true" style="width:100%; height: 100%; ">
            <!-- Settings -->
            <ft-source-panel-settings-editor id="settings" slot="config" style="padding:20px; " ft-source-panel-filters="{{ftSourcePanelFilters}}" ft-source-panel-show-filters="{{ftSourcePanelShowFilters}}" ft-source-panel-heading="{{ftSourcePanelHeading}}" ft-source-panel-show-heading="{{ftSourcePanelShowHeading}}" ft-source-panel-show-search-field="{{ftSourcePanelShowSearchField}}">
            </ft-source-panel-settings-editor>

            <!-- Panel -->
            <ft-source-panel slot="instance" id="panel" style="width:100%; height: 100%; " ft-source-panel-filters="{{ftSourcePanelFilters}}" ft-source-panel-show-filters="{{ftSourcePanelShowFilters}}" ft-source-panel-heading="{{ftSourcePanelHeading}}" ft-source-panel-show-heading="{{ftSourcePanelShowHeading}}" ft-source-panel-show-search-field="{{ftSourcePanelShowSearchField}}">
           </ft-source-panel>

        </ft-element-demo>
`,

  is: 'demo-fixture',

  properties:
  {
      _base: {
          type: Object,
          value: window,
      },
  },

  ready: function()
  {
      var path = "fake-sources.json";

      var xmlHttpRequest = new XMLHttpRequest();
      xmlHttpRequest.overrideMimeType("application/json");
      xmlHttpRequest.open('GET', path, true);
      xmlHttpRequest.onreadystatechange = function()
      {
          if (xmlHttpRequest.readyState === 4 &&
              xmlHttpRequest.status === 200)
          {
              var sources = JSON.parse(xmlHttpRequest.responseText);
              this.$.panel.sources = sources;
          }
      }.bind(this);
      xmlHttpRequest.send();
  }
});
