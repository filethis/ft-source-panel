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
`<ft-element-demo>`

An element that can be used for the demo fixture for FileThis elements. Has a slot for the element to be demoed and a side bar for configuration options.

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';

import 'ft-accordion-item/ft-accordion-item.js';
import 'ft-accordion-item/ft-accordion-item.js';
import 'ft-clipboard-behavior/ft-clipboard-behavior.js';
import 'ft-confirmation-dialog/ft-confirmation-dialog.js';
import './ft-element-demo-header.js';
import './ft-simple-http-servers-window.js';
import 'ft-error-behavior/ft-error-behavior.js';
import 'ft-http-behavior/ft-http-behavior.js';
import 'ft-labeled-icon-button/ft-labeled-icon-button.js';
import 'ft-styler/ft-styler.js';
import 'ft-url-param-behavior/ft-url-param-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-meta/iron-meta.js';
import '@polymer/iron-pages/iron-pages.js';
import 'juicy-ace-editor/juicy-ace-editor.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/polymer/polymer-legacy.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                @apply --layout-vertical;
                @apply --ft-element-demo;
            }
        </style>

        <app-localstorage-document key="ftElementDemo-configPanelIsOpen" data="{{_configPanelIsOpen}}">
        </app-localstorage-document>

        <app-localstorage-document key="ftElementDemo-selectedMode" data="{{_selectedMode}}">
        </app-localstorage-document>

        <app-localstorage-document key="ftElementDemo-selectedDeploymentIndex" data="{{_selectedDeploymentIndex}}">
        </app-localstorage-document>

        <ft-element-demo-header name="[[name]]" hidden="[[!showHeader]]">
        </ft-element-demo-header>

        <div id="instancePanel" class="flex layout vertical">
            <!-- Instance header -->
            <div class="layout vertical" style="border-bottom:1px solid #DDD; ">
                <!-- Instance header -->
                <div id="instanceHeader" class="layout horizontal center" style="height:60px; padding-left: 16px; padding-right: 16px; ">

                    <!-- Heading -->
                    <iron-label style="font-family:Arial; font-size: 16pt; white-space:nowrap; ">
                        Instance
                    </iron-label>

                    <!-- Divider -->
                    <div hidden="[[!_instanceProvidesCode]]" style="width:23px; height: 70%; border-left: 1px solid #DDD; margin-left: 25px; ">
                    </div>

                    <!-- View code button -->
                    <ft-labeled-icon-button id="viewCodeButton" icon="code" label="Code" hidden="[[!_instanceProvidesCode]]" on-tap="_onViewCodeButtonClicked">
                    </ft-labeled-icon-button>

                    <!-- "or" -->
                    <iron-label hidden="[[!_instanceProvidesCode]]" style="font-family:Arial; font-size: 12pt; white-space:nowrap; margin-left: 8px; ">
                        or
                    </iron-label>

                    <!-- View rendered button -->
                    <ft-labeled-icon-button id="viewRenderedButton" icon="dashboard" label="Render" hidden="[[!_instanceProvidesCode]]" style="padding-left:8px; " on-tap="_onViewRenderedButtonClicked">
                    </ft-labeled-icon-button>

                    <!-- Divider -->
                    <!--<div-->
                        <!--hidden="[[!_instanceProvidesCode]]"-->
                        <!--style="width:23px; height: 70%; border-left: 1px solid #DDD; margin-left: 22px; "-->
                    <!--&gt;-->
                    <!--</div>-->
                    <div hidden="true" style="width:23px; height: 70%; border-left: 1px solid #DDD; margin-left: 22px; ">
                    </div>

                    <!-- Deployment menu -->
                    <!--<paper-dropdown-menu-->
                        <!--hidden="[[!_showCode]]"-->
                        <!--id="deploymentMenu"-->
                        <!--label="Deployment"-->
                        <!--style="width:120px; "-->
                    <!--no-animations="true"-->
                    <!--&gt;-->
                    <paper-dropdown-menu hidden="true" id="deploymentMenu" label="Deployment" style="width:120px; " no-animations="true">
                        <paper-listbox class="dropdown-content" slot="dropdown-content" selected="{{_selectedDeploymentIndex}}">
                            <template is="dom-repeat" items="[[_deployments]]" as="deployment">
                                <paper-item>[[deployment]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>

                    <!-- Viewport size menu -->
                    <paper-dropdown-menu hidden="" id="viewportSizeMenu" label="Viewport Size" style="width:130px; padding-left:16px; " no-animations="true">
                        <!--<paper-dropdown-menu-->
                        <!--hidden="[[!_showRendered]]"-->
                        <!--id="viewportSizeMenu"-->
                        <!--label="Viewport Size"-->
                        <!--style="width:130px; "-->
                        <!--no-animations="true"-->
                        <!--&gt;-->
                        <paper-listbox class="dropdown-content" slot="dropdown-content" selected="{{_selectedViewportSizeIndex}}">
                            <template is="dom-repeat" items="[[_viewportSizes]]" as="viewportSize">
                                <paper-item>[[viewportSize.name]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>

                    <div style="width:10px; min-width:20px; "></div>

                    <!-- Size display -->
                    <div id="sizeDisplay" hidden="true">
                        <!--<div-->
                        <!--id="sizeDisplay"-->
                        <!--hidden="[[!_showRendered]]"-->
                        <!--&gt;-->
                        ([[_viewportWidth]] x [[_viewportHeight]])
                    </div>

                    <!-- Spacer -->
                    <div class="flex" style="min-width:30px; "></div>

                </div>
            </div>

            <!-- Configuration and instance panels -->
            <div class="flex layout horizontal">
                <!-- Config slot -->
                <slot id="configSlot" name="config">
                </slot>

                <!-- Rendered or code -->
                <iron-pages id="renderedOrCode" class="flex layout vertical" attr-for-selected="name" selected="[[_selectedMode]]">
                    <!-- Rendered -->
                    <div id="rendered" name="rendered" class="flex scroll">
                        <!-- Fake viewport -->
                        <div id="fakeViewport">

                            <!-- Instance slot -->
                            <slot id="instanceSlot" name="instance">
                            </slot>
                        </div>
                    </div>

                    <!-- Code -->
                    <div name="code" class="flex layout vertical" style="padding:8px 20px 20px 20px; ">
                        <!-- Page code header -->
                        <div class="layout horizontal center">
                            <!-- Heading -->
                            <iron-label style="font-family:Arial; font-size: 14pt; white-space:nowrap; ">
                                Page Code
                            </iron-label>

                            <div class="flex"></div>

                            <!-- Test button -->
                            <ft-labeled-icon-button icon="http" label="Testing" style="margin-left:16px; " on-click="_onTestButtonClicked">
                            </ft-labeled-icon-button>

                            <!-- Copy code button -->
                            <ft-labeled-icon-button icon="content-copy" label="Copy" style="margin-left:16px; " on-click="_onCopyPageCodeButtonClicked">
                            </ft-labeled-icon-button>
                        </div>

                        <!-- Page code -->
                        <juicy-ace-editor id="pageCodeEditor" class="flex scroll" style="border:1px solid #DDD; margin-top: 5px; " readonly="" theme="ace/theme/chrome" mode="ace/mode/html" fontsize="14px" softtabs="" value="[[pageCode]]" tabsize="4">
                        </juicy-ace-editor>
                    </div>
                </iron-pages>
            </div>

        </div>

        <!-- Confirmation dialog -->
        <ft-confirmation-dialog id="confirmationDialog"></ft-confirmation-dialog>

        <!-- Serve window -->
        <ft-simple-http-servers-window id="serversWindow">
        </ft-simple-http-servers-window>
`,

  is: 'ft-element-demo',

  behaviors: [
      FileThis.ErrorBehavior,
      FileThis.HttpBehavior,
      IronResizableBehavior,
      FileThis.ClipboardBehavior,
      FileThis.UrlParamBehavior
  ],

  listeners:
  {
      'iron-resize': '_onIronResizeThis',
      'internal-settings-changed': '_onInternalSettingsChanged',
  },

  observers:
  [
      "_onCodeDependencyChanged(accountId, token, _selectedDeploymentIndex)"
  ],

  properties: {

      name: {
          type: String,
          notify: true,
          value: "ft-thing"
      },

      latestDropinVersion: {
          type: String,
          notify: true,
          value: "2.0.1"
      },

      latestReleaseVersion: {
          type: String,
          notify: true,
          value: "2.0.8"
      },

      showHeader: {
          type: Object,
          notify: true,
          value: true
      },
      
      accountId: {
          type: String
      },

      token: {
          type: String
      },

      css: {
          type: String,
          notify: true
      },

      pageCode:
      {
          type: String,
          value: "",
          observer: "_onPageCodeChanged"
      },

      /**
       * Show the configuration sidebar on the left.
       *
       * Note that you can provide the strings "true" and "false" as attribute values.
       *
       * @type {boolean}
       */
      showConfig:
      {
          type: Object,
          value: false
      },

      configurations:{
          type: Array,
      },

      _selectedMode: {
          type: String,
          value: "rendered",
          observer: "_selectedModeChanged"
      },

      _viewportWidth:
          {
              type: Number
          },

      _viewportHeight:
          {
              type: Number
          },

      _isFullSize:
          {
              type: Boolean,
              value: true
          },

      _instanceProvidesCode:
          {
              type: Boolean,
              value: false
          },

      // Viewport sizes ----------------------------

      _viewportSizes:
          {
              type: Array,
              notify: true,
              value: [
                  {
                      name: "Full",
                      width: 800,
                      height: 500
                  },
                  // {
                  //     name: "Full",
                  //     width: 0,
                  //     height: 0
                  // },
                  {
                      name: "Galaxy S5",
                      width: 360,
                      height: 640
                  },
                  {
                      name: "Nexus",
                      width: 412,
                      height: 732
                  },
                  {
                      name: "iPhone 5",
                      width: 320,
                      height: 568
                  },
                  {
                      name: "iPhone 6",
                      width: 375,
                      height: 667
                  },
                  {
                      name: "iPhone 6 Plus",
                      width: 414,
                      height: 736
                  },
                  {
                      name: "iPad",
                      width: 768,
                      height: 1024
                  },
                  {
                      name: "iPad Pro",
                      width: 1024,
                      height: 1366
                  }
              ]
          },

      _selectedViewportSizeIndex:
          {
              type: Number,
              notify: true,
              value: 0,
              observer: "_onSelectedViewportSizeIndexChanged"
          },

      // Deployments ----------------------------

      _deployments:
          {
              type: Array,
              notify: true,
              value: [ "Drop-In", "Custom" ]
          },

      _selectedDeploymentIndex:
          {
              type: Number,
              notify: true,
              value: 0,
              observer: "_onSelectedDeploymentIndexChanged"
          },

      _showCode: {
          type: Boolean
      },

      _showRendered: {
          type: Boolean,
          value: false
      },

      _configPanelIsOpen:
      {
          type: Boolean,
          value: true,
      },
  },

  ready: function()
  {
      //                var instanceSlot = this.$.instanceSlot;
//                var elementSlotAssignedNodes = instanceSlot.assignedNodes();
//                var target = elementSlotAssignedNodes[0];
//                this.$.styler.target = target;
  },

  _configureEditor: function(editor)
  {
      // If already configured this editor
      if (editor._didConfigure)
          return false;

      // If editor's internal editor does not yet exist
      var editorInternal = editor.editor;
      if (!editorInternal)
          return false;

      // Suppress deprecation warning
      editorInternal.$blockScrolling = Infinity;

      // Disable syntax checking
      var session = editorInternal.getSession();
      session.setUseWorker(false);

      editor._didConfigure = true;

      return true;
  },

  //            ready: function()
  //            {
  //                var instance = this._findElementWithId("panel");
  //                this.$.styler.target = instance;
  //            },

  _script: "script",

  _onSelectedDeploymentIndexChanged: function()
  {
      this._updateCode();
  },

  _onInternalSettingsChanged: function(event)
  {
      this._updateCode();
  },

  _onCodeDependencyChanged: function()
  {
      this._updateCode();
  },

  _updateCode: function()
  {
      this._updateCodeDebouncer = Debouncer.debounce
      (
          this._updateCodeDebouncer,
          timeOut.after(60),
          this._updateCodeDebounced.bind(this)
      );
  },

  _updateCodeDebounced: function()
  {
      var isDropIn = (this._selectedDeploymentIndex === 0);

      // Given the target, ask for template
      var instance = this._getInstance();
      if (!instance)
          return;
      var hasTemplateFunction = !!instance.getPageCodeTemplate;
      if (!hasTemplateFunction)
          return;

      var settingsImports = this._buildSettingsImports();
      var hasSettingsImports = !!settingsImports;

      var settingsElements = this._buildSettingsElements();
      var hasSettingsElements = !!settingsElements;

      // TODO:
      var styling = "                    /* None*/\n";
      var hasStyling = !!styling;

      var pageCodeTemplate = instance.getPageCodeTemplate(isDropIn, hasStyling, hasSettingsImports, hasSettingsElements);

      this.pageCode = this._makeSubstitutionsInto(pageCodeTemplate, styling, settingsImports, settingsElements);

      setTimeout(function()
      {
          var editor = this.$.pageCodeEditor.editor;
          if (editor !== undefined)
              editor.selection.selectFileStart();
      }.bind(this), 1);
  },

  _buildSettingsImports: function()
  {
      // NOTE: For now, everything is included in the ft-connect-wizard import
      return "\n";

      // if (!this.configurations)
      //     return "";
      //
      // var settingsImports = "";
      // var configurations = this.configurations;
      // var count = configurations.length;
      // var indent = "    ";
      // for (var index = 0;
      //      index < count;
      //      index++)
      // {
      //     var configuration = configurations[index];
      //     var settingsEditor = configuration.settingsEditor;
      //     if (!settingsEditor)
      //         continue;
      //     var settingsImport = settingsEditor.generateSettingsImport(indent);
      //     if (settingsImport)
      //         settingsImports += settingsImport;
      // }
      // settingsImports += indent + "\n";
      //
      // return settingsImports;
  },

  _buildSettingsElements: function()
  {
      if (!this.configurations)
          return "";

      var settingsElements = "";
      var configurations = this.configurations;
      var count = configurations.length;
      var indent = "            ";
      for (var index = 0;
           index < count;
           index++)
      {
          var configuration = configurations[index];
          var settingsEditor = configuration.settingsEditor;
          if (!settingsEditor)
              continue;
          var settingsElement = settingsEditor.generateSettingsElement(indent);
          if (settingsElement)
              settingsElements += settingsElement;
      }
      if (!settingsElements)
          settingsElements = indent + "<!-- None -->\n";

      return settingsElements;
  },

  _makeSubstitutionsInto: function(template, styling, settingsImports, settingsElements)
  {
      var code = template;
      code = code.replace(/{{NAME}}/g, this.name);
      code = code.replace(/{{LATEST_DROPIN_VERSION}}/g, this.latestDropinVersion);
      code = code.replace(/{{ACCOUNT_ID}}/g, this.accountId);
      code = code.replace(/{{TOKEN}}/g, this.token);
      code = code.replace(/{{SETTINGS_IMPORTS}}/g, settingsImports);
      if (settingsImports)
          code += "\n";
      code = code.replace(/{{SETTINGS_ELEMENTS}}/g, settingsElements);
      if (settingsElements)
          code += "\n";
      code = code.replace(/{{STYLING}}/g, styling);
      code = code.replace(/{{RELEASE_VERSION}}/g, this.latestReleaseVersion);
      if (styling)
          code += "\n";
      return code;
  },

  _findElementWithId: function(id)
  {
      // TODO: There must be a better way to do this...
      var fakeViewport = this.$.fakeViewport;
      var children = dom(fakeViewport).getEffectiveChildNodes();
      var count = children.length;
      for (var index = 0;
           index < count;
           index++)
      {
          var child = children[index];
          if (child.id === id)
              return child;
      }
      return null;
  },

  _onCopyPageCodeButtonClicked: function(event, detail)
  {
      this._copyPageCode();
  },

  _copyPageCode: function()
  {
      this.copyTextToClipboard(this.pageCode);
  },

  _onTestButtonClicked: function(event, detail)
  {
      return this.$.serversWindow.pose().then(function()
      {
      }.bind(this))
  },

  _onPageCodeChanged:function()
  {
      // This seems to be the best place to do this.
      // Can't do in ready() because the internal editor is not yet defined there.
      if (!this._configureEditor(this.$.pageCodeEditor))
          return;

      var haveCode = !!this.pageCode;
      this._instanceProvidesCode = haveCode;

      // Deselect text
      var editor = this.$.pageCodeEditor.editor;
      if (editor !== undefined)
          editor.selection.selectFileStart();
  },

  _getInstance: function()
  {
      var fakeViewport = this.$.fakeViewport;
      var children = dom(fakeViewport).getEffectiveChildNodes();
      var instance = children[3];  // TODO: Find a better way...
      return instance;
  },

  _onIronResizeThis: function(event)
  {
      var viewport = this.$.fakeViewport;
      var width = viewport.offsetWidth;
      var height = viewport.offsetHeight;
      if (!!width)
         this._viewportWidth = width;
      if (!!height)
         this._viewportHeight = height;
  },

  _onSelectedViewportSizeIndexChanged: function(to, from)
  {
      var index = this._selectedViewportSizeIndex;

      if (index === null)
          return;

      // Full size?
      var isFullSize = (index === 0);
      this._isFullSize = isFullSize;

      var viewport = this.$.fakeViewport;
      var rendered = this.$.rendered;


      rendered.style.boxSizing = "border-box";

      // Set fixed size
      var viewportSize = this._viewportSizes[index];
      viewport.style.width = viewportSize.width + "px";
      viewport.style.height = viewportSize.height + "px";

      // Border
      viewport.style.border = "1px solid black";
      viewport.style.boxShadow = "5px 5px 4px #BBB";
      rendered.style.removeProperty("border");

      // Margin (center within parent)
      viewport.style.margin = "auto";
      viewport.style.marginTop = "16px";
      viewport.style.marginBottom = "16px";


      // if (isFullSize)
      // {
      //     // Set full size
      //     viewport.style.width = "100%";
      //     viewport.style.height = "100%";
      //
      //     // Border
      //     viewport.style.removeProperty("border");
      //     viewport.style.removeProperty("box-shadow");
      //     rendered.style.border = "1px solid black";
      //
      //     // Margin
      //     viewport.style.removeProperty("margin");
      // }
      // else // fixed size
      // {
      //     // Set fixed size
      //     var viewportSize = this._viewportSizes[index];
      //     viewport.style.width = viewportSize.width + "px";
      //     viewport.style.height = viewportSize.height + "px";
      //
      //     // Border
      //     viewport.style.border = "1px solid black";
      //     viewport.style.boxShadow = "5px 5px 4px #BBB";
      //     rendered.style.removeProperty("border");
      //
      //     // Margin (center within parent)
      //     viewport.style.margin = "auto";
      //     viewport.style.marginTop = "16px";
      //     viewport.style.marginBottom = "16px";
      // }

      // Tell the iron-list to reconstrain itself
      this.notifyResize();
  },

  _selectedModeChanged: function(to, from)
  {
      this._showCode = (to === "code");

      this._showRendered = (to === "rendered") && this.getUrlParam("devel");
  },

  _onViewCodeButtonClicked: function(event, detail)
  {
      this._selectedMode = "code";
  },

  _onViewRenderedButtonClicked: function(event, detail)
  {
      this._selectedMode = "rendered";
  }
});
