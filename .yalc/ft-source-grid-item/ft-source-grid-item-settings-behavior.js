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
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { IronMeta } from '@polymer/iron-meta/iron-meta.js';

// Make sure the "FileThis" namespace exists
window.FileThis = window.FileThis || {};

/**
 * `<ft-source-grid-item-settings-behavior>`
 *
 * Mixin to get connection list item settings properties.
 *
 * @demo
 * @polymerBehavior FileThis.SourceGridItemSettingsBehavior
 */
FileThis.SourceGridItemSettingsBehavior = {

    observers:[
        '_onInternalSettingsChanged(ftSourceGridItemShowIdentifyButton)',
    ],

    properties: {

        /**
         * Whether to show the eye icon that users can click on to see a screenshot of a source website's landing page.
         *
         * Note that you can provide the strings "true" and "false" as attribute values.
         *
         * @type {boolean}
         */
        ftSourceGridItemShowIdentifyButton: {
            type: Object,
            value: false,
            notify: true,
        },

    },

    attached: function()
    {
        this.async(function()
        {
            this._applySettingToProperty("ft-source-grid-item-show-identify-button", "ftSourceGridItemShowIdentifyButton");
        });
    },

    _applySettingToProperty: function(settingName, propertyName)
    {
        var meta = new IronMeta({type: "setting", key: settingName});
        var value = meta.value;
        if (value !== undefined)
            this.set(propertyName, value);
    },

    _onInternalSettingsChanged: function(to)
    {
        this.fire("internal-settings-changed");
    },

    generateSettingsImport: function(indent)
    {
        if (!this.hasSettings())
            return "";

        var theImport = indent + "<link rel=\"import\" href=\"https://connect.filethis.com/{{RELEASE_VERSION}}/ft-source-grid-item/ft-source-grid-item.html\">\n";

        return theImport;
    },

    generateSettingsElement: function(indent)
    {
        if (!this.hasSettings())
            return "";

        var settings = indent + "<ft-source-grid-item-settings";

        // Keep alphabetized
        settings += this._buildSettingAttribute("ft-source-grid-item-show-identify-button", "false", indent);

        settings += ">\n" + indent + "</ft-source-grid-item-settings>\n";

        return settings;
    },

    // TODO: Factor out from here and copies in other classes
    _buildSettingAttribute: function(propertyName, propertyValue, indent)
    {
        return '\n' + indent + '    ' + propertyName + '="' + propertyValue + '"';
    },

    hasSettings: function()
    {
        if (this.ftSourceGridItemShowIdentifyButton !== true)
            return true;
        return false;
    },

    revertToDefaults: function()
    {
        this.ftSourceGridItemShowIdentifyButton = true;
    },
}
