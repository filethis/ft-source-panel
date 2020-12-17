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
/* ft-source-list-item element demo */
/* Imports */
/**

An element that renders information about a FileThis source in a parent grid

@demo
 */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/polymer/polymer-legacy.js';
import '../ft-source-grid-item.js';
import '../ft-source-grid-item-settings.js';
import './ft-source-grid-item-settings-editor.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="demo-fixture">

    <style include="iron-flex iron-flex-alignment iron-positioning"></style>

    <template>

        <style>
            :host {
                display: block;
                overflow: hidden;
            }
        </style>

        <!-- Set a couple settings -->
        <ft-source-grid-item-settings ft-source-grid-item-show-identify-button="true">
        </ft-source-grid-item-settings>

        <ft-element-demo name="ft-source-grid-item" show-config="true" style="width:100%; height: 100%; ">
            <!-- Settings -->
            <ft-source-grid-item-settings-editor id="settings" slot="config" style="padding:20px; " ft-source-grid-item-show-identify-button="{{ftSourceGridItemShowIdentifyButton}}">
            </ft-source-grid-item-settings-editor>

            <div slot="instance" class="layout vertical center">
                <!-- Normal -->
                <ft-source-grid-item id="normal" ft-source-grid-item-show-identify-button="{{ftSourceGridItemShowIdentifyButton}}">
                </ft-source-grid-item>

                <div style="height:25px;"></div>

                <!-- Selected -->
                <ft-source-grid-item id="selected" ft-source-grid-item-show-identify-button="{{ftSourceGridItemShowIdentifyButton}}">
                </ft-source-grid-item>

            </div>

        </ft-element-demo>

    </template>

    

</dom-module>`;

document.head.appendChild($_documentContainer.content);

Polymer
({
    is: 'demo-fixture',

    properties:
    {
    },

    ready: function()
    {
        this._loadFakeSource();
    },

    _loadFakeSource: function()
    {
        var path = "fake-source.json";

        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.overrideMimeType("application/json");
        xmlHttpRequest.open('GET', path, true);
        xmlHttpRequest.onreadystatechange = function()
        {
            if (xmlHttpRequest.readyState === 4 &&
                xmlHttpRequest.status === 200)
            {
                var source = JSON.parse(xmlHttpRequest.responseText);

                // Normal
                var sourceNormal = Object.assign({}, source);
                this.$.normal.source = sourceNormal;

                // Selected
                var sourceSelected = Object.assign({}, source);
                this.$.selected.source = sourceSelected;
                this.$.selected.selected = true;
            }
        }.bind(this);
        xmlHttpRequest.send();
    }

});
