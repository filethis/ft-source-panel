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

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/marked-element/marked-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/polymer/polymer-legacy.js';
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
                @apply --ft-source-identifier;
            }
            #dialog {
                width: 600px;
                height: 520px;
                @apply --ft-source-identifier-dialog;
            }
            #content {
                margin: 0;
                padding: 0;
                background-color: white;
                width: 100%;
                height: 100%;
                @apply --ft-source-identifier-dialog;
            }
            #heading {
                margin-top: 12px;
                font-family:Arial, Helvetica, sans-serif;
                font-size: 12pt;
                white-space:nowrap;
                @apply --ft-source-identifier-heading;
            }
            #thumbnail {
                width: 512px;
                border: 1px solid black;
                box-shadow:5px 5px 4px #BBB;
                margin:10px;
                padding:10px;
                @apply --ft-source-identifier-thumbnail;
            }
            #button {
                @apply --ft-source-identifier-button;
            }
            #footer {
                margin-top: 10px;
                @apply --ft-source-identifier-footer;
            }
        </style>

        <paper-dialog
            modal
            id="dialog"
        >
            <!-- Content -->
            <!-- The paper-dialog parent is evil, injecting a margin into its children. -->
            <div
                id="content"
                class="layout vertical center">

                <!-- Heading -->
                <iron-label id="heading">
                    The home page of [[_sourceName]] looks like this:
                </iron-label>

                <!-- Thumbnail -->
                <img
                    id="thumbnail"
                    src="[[_thumbnailUrl]]"
                >

                <!-- Footer -->
                <div
                    id="footer"
                    class="layout horizontal center">

                    <!-- Done button-->
                    <paper-button
                        id="button"
                        dialog-confirm
                        raised
                        autofocus
                    >
                        OK
                    </paper-button>
                </div>
            </div>

        </paper-dialog>
`,

        is: 'ft-source-identifier',

        properties: {

            _thumbnailUrl:
            {
                type: String,
            },

            _sourceName:
            {
                type: String,
            },
        },

        pose: function (server, source) {
            // Override dumb default that disables Escape keyboard equivalent for cancel
            this.$.dialog.noCancelOnEscKey = false;

            this._sourceName = source.name;

            // Build thumbnail URL
            var sourceName = this._getSourceName(source);
            var fingerprint = source.homeFingerprint;
            var url = server +
                "/static/sources" +
                "/" + sourceName +
                "/" + sourceName + "-large-" + fingerprint + ".png";
            // url =  "https://staging.filethis.com/static/sources/WellsFargoMortgage/WellsFargoMortgage-large-05ba088eac06a16ff72c91215e723fe6.png";
            this._thumbnailUrl = url;

            return new Promise(function (resolve, reject) {
                this.$.dialog.open();

                this.doneListener = function doneListener(event) {
                    this.$.dialog.removeEventListener("iron-overlay-closed", this.doneListener);
                    resolve("cancel");
                }.bind(this);

                this.$.dialog.addEventListener("iron-overlay-closed", this.doneListener)
            }.bind(this))
        },

        _getSourceName: function (source) {
            var logoPath = source.logoPath;
            logoPath = logoPath.replace(" ", "");  // Some logo filenames have spaces...
            var pattern = /^logos\/Logo_([_\'a-zA-Z0-9&-]+)\./;
            var groups = pattern.exec(logoPath);
            var name = groups[1];
            return name;
        }
    });
