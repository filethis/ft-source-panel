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
`<ft-source-grid-item>`

This element displays a single FileThis document source, suitable for use in grid of other sources.

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import 'ft-http-behavior/ft-http-behavior.js';

import './ft-source-grid-item-settings-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-label/iron-label.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
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
                position:relative;
                width: 182px;
                height: 115px;
                @apply --ft-source-grid-item;
            }
            #interior {
                position:absolute;
                z-index:1;
                padding-left: 15px;
                padding-top: 15px;
                padding-right: 15px;
                @apply --ft-source-grid-item-interior;
            }
            #logoBox {
                width: 150px;
                height: 65px;
                border: 1px solid #DEDEDE;
                justify-content:center;
                cursor:pointer;
                @apply --ft-source-grid-item-logo-box;
            }
            #name {
                font-family: Arial, Helvetica, sans-serif;
                color: #343434;
                width: 150px;
                height: 20px;
                padding-top: 8px;
                text-align:center;
                text-overflow:ellipsis;
                white-space:nowrap;
                overflow: hidden;
                cursor:pointer;
                @apply --ft-source-grid-item-name;
            }
            #identifyButton {
                position:absolute;
                z-index:2;
                right:21px; top:18px;
                width: 20px; height: 20px;
                display: none;
                cursor:pointer;
                @apply --ft-source-grid-item-identify-button;
            }
            .icon-normal
            {
                --iron-icon-fill-color:#DDD;
                @apply --ft-source-grid-item-icon-normal;
            }
            .icon-highlighted
            {
                --iron-icon-fill-color:black;
                @apply --ft-source-grid-item-icon-highlighted;
            }
        </style>

        <!-- Main content -->
        <div id="interior" class="layout vertical center" on-tap="_ignoreClick">
            <!-- Logo Box -->
            <div id="logoBox" class="layout vertical center" on-tap="_onSourceClicked">
                <!-- Logo -->
                <img style="width:auto; max-width:100%; " src="[[source.logoUrl]]">
                
            </div>

            <!-- Name -->
            <div id="name" on-tap="_onSourceClicked">
                [[source.name]]
            </div>
        </div>

        <!-- Identify button -->
        <iron-icon id="identifyButton" class="icon-normal" icon="visibility" hidden="true" on-tap="_onIdentifyButtonClicked" on-mouseover="_onMouseEnterIdentifyButton" on-mouseout="_onMouseLeaveIdentifyButton">
        </iron-icon>
        <!--<iron-icon-->
            <!--id="identifyButton"-->
            <!--class="icon-normal"-->
            <!--icon="visibility"-->
            <!--hidden="[[!ftSourceGridItemShowIdentifyButton]]"-->
            <!--on-tap="_onIdentifyButtonClicked"-->
            <!--on-mouseover="_onMouseEnterIdentifyButton"-->
            <!--on-mouseout="_onMouseLeaveIdentifyButton"-->
        <!--&gt;-->
        <!--</iron-icon>-->

        <paper-tooltip for="identifyButton" style="width:110px;">
            Identify website
        </paper-tooltip>
`,

  is: 'ft-source-grid-item',
  behaviors: [FileThis.SourceGridItemSettingsBehavior],

  listeners: {
      mouseenter: '_onMouseEnterHost',
      mouseleave: '_onMouseLeaveHost',
  },

  /**
   * Fired when a source is clicked to connect to it.
   *
   * @event connect
   * @param {Object} detail The selected source.
   */

  properties: {

      /** The source resource to be displayed. */
      source: {
          type: Object,
          notify: true,
          value:
              {
                  id: 1,
                  name: "Untitled",
                  type: "util",
                  state: "live",
                  homePageUrl: "https://filethis.com",
                  phone: "(800) 266-2278",
                  logoPath: "logos/Logo_FileThisHosted.png",
                  logo: "Logo_FileThisHosted.png",
                  logoUrl: "https://filethis.com/static/logos/72/Logo_FileThisHosted.png",
                  note: "",
                  info: "",
                  pattern: "",
                  isNew: false,
                  isPopular: true
              }
      },

      /** Whether the source item should appear selected, or not. */
      selected: {
          type: Boolean,
          notify: true,
          value: false,
          observer: "_onSelectedChanged"
      },

      /** True when the identify button is hidden. */
      _identifyButtonHidden: {
          type: Boolean,
          value: false
      },
  },

  _onMouseEnterHost: function(event)
  {
      this.$.identifyButton.style.display = "block";
  },

  _onMouseLeaveHost: function(event)
  {
      this.$.identifyButton.style.display = "none";
  },

  _onMouseEnterIdentifyButton: function(event)
  {
      var identifyButton = this.$.identifyButton;
      identifyButton.classList.remove("icon-normal");
      identifyButton.classList.add("icon-highlighted");
  },

  _onMouseLeaveIdentifyButton: function(event)
  {
      var identifyButton = this.$.identifyButton;
      identifyButton.classList.add("icon-normal");
      identifyButton.classList.remove("icon-highlighted");
  },

  _onSourceClicked: function(event, detail)
  {
      this.fire('connect-command', this.source);
  },

  _onIdentifyButtonClicked: function(event, detail)
  {
      this.fire('identify-source-command', this.source);

      event.stopPropagation(); // So that we don't toggle the item selection
  },

  _onSelectedChanged: function(to, from)
  {
      var interior = this.$.interior;
      if (this.selected)
          interior.style.backgroundColor = "#F6F6F6";
      else
          interior.style.backgroundColor = "#FFFFFF";
  },

  _ignoreClick: function(event, detail)
  {
      event.stopPropagation(); // So that we don't toggle the item selection
  }
});
