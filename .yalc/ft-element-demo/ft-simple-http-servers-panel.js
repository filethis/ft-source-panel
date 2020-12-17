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
`<ft-simple-http-servers-panel>`
\
@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import 'ft-clipboard-behavior/ft-clipboard-behavior.js';

import 'ft-labeled-icon-button/ft-labeled-icon-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'juicy-ace-editor/juicy-ace-editor.js';
import '@polymer/marked-element/marked-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
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
                @apply --layout-vertical;
                @apply --ft-simple-http-servers-panel;
            }

            .section
            {
                margin-top: 30px;
            }

            .section-label
            {
                font-family:Arial;
                font-size: 12pt;
            }
        </style>

        <!-- Instructions -->
        <iron-label style="font-family:Arial; font-size: 12pt; ">
            You can test your configured page code on your development machine against the FileThis service. After copying and saving the code to an "index.html" file, you can use one of the following command-line tools to serve it:
        </iron-label>

        <!-- Choose -->
        <div class="layout vertical section">
            <!-- Label -->
            <iron-label class="section-label">
                Choose Server
            </iron-label>

            <div class="layout horizontal center">
                <!-- Server Menu -->
                <paper-dropdown-menu label="Server" style="width:250px; " no-animations="true">
                    <paper-listbox class="dropdown-content" slot="dropdown-content" attr-for-selected="name" selected="{{_selectedServerName}}">
                        <template is="dom-repeat" items="[[_servers]]" as="server">
                            <paper-item name="[[server.name]]">[[server.label]]</paper-item>
                        </template>
                    </paper-listbox>
                </paper-dropdown-menu>

                <!-- Port number field -->
                <paper-input id="portField" value="{{_port}}" label="Port" style="margin-left: 25px; width: 110px; " auto-validate="" pattern="[0-9]+" error-message="Must be an integer">
                </paper-input>
            </div>
        </div>

        <!-- Install -->
        <div class="layout vertical section" hidden="[[!_hasInstall]]">
            <!-- Label -->
            <iron-label class="section-label">
                Install Server
            </iron-label>

            <div class="layout horizontal center" style="margin-top: 10px; ">
                <!-- Install -->
                <juicy-ace-editor id="installEditor" class="flex scroll" style="height: 50px; border: 1px solid #DDD; " readonly="" theme="ace/theme/chrome" mode="ace/mode/text" fontsize="14px" softtabs="" value="[[_install]]" tabsize="4">
                </juicy-ace-editor>

                <!-- Copy install button -->
                <ft-labeled-icon-button id="copyInstallButton" icon="content-copy" label="Copy" style="margin-left: 15px; " on-click="_onCopyInstallButtonClicked">
                </ft-labeled-icon-button>
            </div>
        </div>

        <!-- Serve -->
        <div class="layout vertical section">
            <!-- Label -->
            <iron-label class="section-label">
                Serve Page
            </iron-label>

            <div class="layout horizontal center" style="margin-top: 10px; ">
                <!-- Code -->
                <juicy-ace-editor id="codeEditor" class="flex scroll" style="height: 50px; border: 1px solid #DDD; " readonly="" theme="ace/theme/chrome" mode="ace/mode/text" fontsize="14px" softtabs="" value="[[_code]]" tabsize="4">
                </juicy-ace-editor>

                <!-- Copy code button -->
                <ft-labeled-icon-button id="copyCodeButton" icon="content-copy" label="Copy" style="margin-left: 15px; " on-click="_onCopyCodeButtonClicked">
                </ft-labeled-icon-button>
            </div>
        </div>

        <!-- Browse -->
        <div class="layout vertical section">
            <!-- Label -->
            <iron-label class="section-label">
                Open Page in Browser
            </iron-label>

            <div class="layout horizontal center" style="margin-top: 3px; ">
                <!-- URL -->
                <div class="flex" style="padding: 5px 10px 5px 10px ; border: 1px solid #DDD; ">
                    [[_url]]
                </div>

                <!-- Open URL button -->
                <ft-labeled-icon-button id="openUrlButton" icon="open-in-browser" label="Open" style="margin-left: 15px; " on-click="_onOpenUrlButtonClicked">
                </ft-labeled-icon-button>

                <!-- Copy URL button -->
                <ft-labeled-icon-button id="copyUrlButton" icon="content-copy" label="Copy" style="margin-left: 15px; " on-click="_onCopyUrlButtonClicked">
                </ft-labeled-icon-button>
            </div>
        </div>

        <app-localstorage-document key="ftSimpleHttpServersPanel-selectedServerName" data="{{_selectedServerName}}">
        </app-localstorage-document>

        <app-localstorage-document key="ftSimpleHttpServersPanel-port" data="{{_port}}">
        </app-localstorage-document>
`,

  is: 'ft-simple-http-servers-panel',

  behaviors: [
      FileThis.ClipboardBehavior
  ],

  observers:
      [
          "_onSettingsChanged(_selectedServer, _port)",
      ],

  properties: {

      // Server

      _selectedServerName: {
          type: String,
          observer: "_selectedServerNameChanged",
      },

      _selectedServer: {
          type: Object,
      },

      _servers:
          {
              type: Array,
              value: [
                  {
                      label: 'BrowserSync',
                      name: 'browser-sync',
                      install: "npm install -g browser-sync",
                      codeTemplate: "browser-sync start --server --port {{PORT}}",
                  },
                  {
                      label: 'Node http-server',
                      name: 'static-http-server',
                      install: "npm install -g http-server",
                      codeTemplate: "http-server -p {{PORT}}",
                  },
                  {
                      label: 'Node static-server',
                      name: 'static-server',
                      install: "npm install -g static-server",
                      codeTemplate: "static-server --port {{PORT}}",
                  },
                  {
                      label: 'Perl HTTP::Server::Brick',
                      name: 'perl-brick',
                      install: "cpan HTTP::Server::Brick",
                      codeTemplate: "perl -MHTTP::Server::Brick -e '$s=HTTP::Server::Brick->new(port=>{{PORT}}); $s->mount(\"/\"=>{path=>\".\"}); $s->start'",
                  },
                  {
                      label: 'Perl Plack',
                      name: 'perl-plack',
                      install: "cpan Plack",
                      codeTemplate: "plackup -MPlack::App::Directory -e 'Plack::App::Directory->new(root=>\".\");' -p {{PORT}}",
                  },
                  {
                      label: 'PHP',
                      name: 'php',
                      install: "",
                      codeTemplate: "php -S localhost:{{PORT}}",
                  },
                  {
                      label: 'Python 2.x SimpleHTTPServer',
                      name: 'python2',
                      install: "",
                      codeTemplate: "python -m SimpleHTTPServer {{PORT}}",
                  },
                  {
                      label: 'Python 3.x http.server',
                      name: 'python3',
                      install: "",
                      codeTemplate: "python -m http.server {{PORT}}",
                  },
                  {
                      label: 'Ruby adsf',
                      name: 'ruby-adsf',
                      install: "gem install adsf",
                      codeTemplate: "adsf --port {{PORT}}",
                  },
                  {
                      label: 'Ruby httpd',
                      name: 'ruby-httpd',
                      install: "",
                      codeTemplate: "ruby -run -ehttpd . --port {{PORT}}",
                  },
                  {
                      label: 'Ruby Sinatra',
                      name: 'ruby-sinatra',
                      install: "gem install sinatra",
                      codeTemplate: "ruby -rsinatra -e'set :public_folder, \".\"; set :port, {{PORT}}'",
                  },
                  {
                      label: 'Ruby WEBrick',
                      name: 'ruby-webrick',
                      install: "",
                      codeTemplate: "ruby -rwebrick -e'WEBrick::HTTPServer.new(:Port => {{PORT}}, :DocumentRoot => Dir.pwd).start'",
                  },
              ]
          },

      _port: {
          type: Number,
          value: "5555",
      },

      _code: {
          type: String,
          value: "",
          observer: "_onCodeChanged"
      },

      _install: {
          type: String,
          value: "",
          observer: "_onInstallChanged"
      },

      _hasInstall: {
          type: Boolean,
          value: false,
      },

      _url: {
          type: String,
          value: "",
      },
  },

  ready: function()
  {
      setTimeout(function()
      {
          if (!this._selectedServerName)
              this._selectedServerName = "browser-sync";
      }.bind(this), 1000);
  },

  _onCodeChanged:function(to, from)
  {
      this._deselectText(this.$.codeEditor);
  },

  _onInstallChanged:function(to, from)
  {
      this._deselectText(this.$.installEditor);
  },

  _deselectText:function(editorElement)
  {
      var editor = editorElement.editor;
      if (editor !== undefined)
          editor.selection.selectFileStart();
  },

  _selectedServerNameChanged: function(to, from)
  {
      this._selectedServer = this._findServerNamed(this._selectedServerName);
  },

  _onSettingsChanged: function()
  {
      if (!this._selectedServer || !this._servers)
          return;

      // Update code
      var codeTemplate = this._selectedServer.codeTemplate;
      var port;
      if (this._port)
          port = this._port;
      else
          port = "PORT";
      this._code = codeTemplate.replace(/{{PORT}}/g, port);

      this._install = this._selectedServer.install;
      this._hasInstall = (!!this._install);
      this._url = "http://localhost:" + port + "/index.html";
  },

  _findServerNamed: function(name)
  {
      var servers = this._servers;
      var count = servers.length;
      for (var index = 0; index < count; index++)
      {
          var server = servers[index];
          if (server.name === name)
              return server;
      }
      return null;
  },

  _onCopyCodeButtonClicked: function(event, detail)
  {
      this.copyTextToClipboard(this._code);
  },

  _onCopyInstallButtonClicked: function(event, detail)
  {
      this.copyTextToClipboard(this._install);
  },

  _onCopyUrlButtonClicked: function(event, detail)
  {
      this.copyTextToClipboard(this._url);
  },

  _onOpenUrlButtonClicked: function(event, detail)
  {
      this._openUrl(this._url);
  },

  _openUrl: function(url)
  {
      var win = window.open(url, '_blank');
      if (win)
          win.focus();
      else
          this.$.confirmationDialog.alert("Please allow popups for this domain");
  }
});
