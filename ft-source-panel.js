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
/* TODO: Retrofit this to use iron-list instead of a dom-repeat template. */
/**
`<ft-source-panel>`

This element displays a list of FileThis source resources. Above the list is a header area that can display a heading, a popup menu of filtering options, and a textual search field. Which header elements are displayed is configurable.

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@filethis/array-filter/array-filter.js';

import '@filethis/ft-create-connection-dialog/ft-create-connection-dialog.js';
import '@filethis/ft-source-grid/ft-source-grid.js';
import '@filethis/ft-source-grid-item/ft-source-grid-item-settings-behavior.js';
import './ft-source-panel-settings-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-label/iron-label.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/polymer/polymer-legacy.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning iron-flex-factors"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                @apply --layout-vertical;
                --paper-button-raised-keyboard-focus: {
                    font-weight: normal;
                };
                --paper-button-flat-keyboard-focus: {
                    font-weight: normal;
                };
                @apply --ft-source-panel;
            }
            #header {
                height: 60px;
                padding-left: 16px;
                padding-right: 16px;
                border-bottom: 1px solid #DDD;
                @apply --ft-source-panel-header;
            }
            #heading {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 14pt;
                @apply --ft-source-panel-heading;
            }
            #filterButton {
                width: 150px;
                height: 32px;
                font-size: 14px;
                background-color: white;
                text-transform: none;
                border: 1px solid #DDD;
                @apply --ft-source-panel-filter-button;
            }
            #searchField {
                margin-left: 8px;
                @apply --ft-source-panel-search-field;
            }
        </style>

        <!-- Search and sort bar -->
        <div id="header" class="layout horizontal center" hidden\$="[[!_showHeader]]">
            <!-- Heading -->
            <iron-label id="heading" hidden\$="[[!ftSourcePanelShowHeading]]">
                [[ftSourcePanelHeading]]
            </iron-label>

            <div class="flex"></div>

            <!-- Filter -->
            <paper-menu-button hidden\$="[[!ftSourcePanelShowFilters]]" no-animations="true">

                <!-- Button -->
                <paper-button id="filterButton" slot="dropdown-trigger">
                    <div class="layout horizontal center" style="width:100%">
                        <iron-icon icon="arrow-drop-down"></iron-icon>
                        <span>[[selectedFilter.name]]</span>
                    </div>
                </paper-button>

                <!-- Dropdown -->
                <paper-listbox slot="dropdown-content" attr-for-selected="id" selected="{{selectedFilterId}}">
                    <template is="dom-repeat" items="[[_filters]]" as="filter">
                        <paper-item id="[[filter.id]]" style="font-size:14px; ">
                            [[filter.name]]
                        </paper-item>
                    </template>
                </paper-listbox>

            </paper-menu-button>

            <!-- Search -->
            <paper-input id="searchField" autofocus="" label="Search" hidden\$="[[!ftSourcePanelShowSearchField]]" value="{{_searchPattern}}">
                <!--<iron-icon icon="search" slot="prefix"></iron-icon>-->
                <!--<div slot="prefix" style="width:5px; "></div>-->
                <paper-icon-button slot="suffix" on-tap="_clearSearchPattern" hidden\$="[[!_haveSearchPattern]]" icon="clear" alt="clear" title="clear">
                </paper-icon-button>
            </paper-input>

        </div>

        <!-- Source Grid -->
        <ft-source-grid id="sourceGrid" class="flex" sources="[[_sourcesFilteredAndSorted]]" selected-source="{{selectedSource}}" ft-source-grid-item-show-identify-button="{{ftSourceGridItemShowIdentifyButton}}">
        </ft-source-grid>

        <!-- Connect Dialog -->
        <ft-create-connection-dialog id="createConnectionDialog" on-cancel="_onCreateConnectionDialogClosed" on-commit="_onCreateConnectionDialogClosed">
        </ft-create-connection-dialog>

        <!-- Filtered source list -->
        <array-filter id="arrayFilter" items="{{sources}}" filtered="{{_sourcesFilteredAndSorted}}" filter="_filter" sort="_sorter">
        </array-filter>
`,

  is: 'ft-source-panel',

  behaviors: [
      FileThis.SourcePanelSettingsBehavior,
      FileThis.SourceGridItemSettingsBehavior,
  ],

  listeners:
  {
      'connect-command': '_onConnectCommand',
      'tap': '_onTap',
      'ft-source-panel-filters-changed-in-behavior': '_onFtSourcePanelFiltersChangedInBehavior',
  },

  observers:
  [
      "_onSettingsPropertyChanged(ftSourcePanelFilters, ftSourcePanelShowFilters, ftSourcePanelHeading, ftSourcePanelShowHeading, ftSourcePanelShowSearchField)",
  ],

  properties: {

      /** The list of all source resources. */
      sources: {
          type: Array,
          notify: true,
          value: [],
          observer: "_onSourcesChanged"
      },

      /** The currently-selected source. */
      selectedSource:
      {
          type: Object,
          notify: true,
          value: null
      },

      _filters: {
          type: Array,
          value: [
          ],
          observer: "_onFiltersChanged"
      },

      /** The id of the currently-selected filter. */
      selectedFilterId: {
          type: String,
          notify: true,
          observer: "_onSelectedFilterIdChanged"
      },
      
      /** The currently-selected filter. */
      selectedFilter: {
          type: Object,
          notify: true,
          readonly: true
      },

      /** True when at least one of the header widgets is displayed. When false, the header is hidden. */
      _showHeader:
      {
          type: Boolean,
          value: true
      },

      /** The search string entered by the user. */
      _searchPattern: {
          type: String,
          value: "",
          observer: "_searchPatternChanged"
      },

      /** True when there is a search pattern. */
      _haveSearchPattern:
      {
          type: Boolean,
          value: false
      },

      /** The output of the <array-filter> used to filter and sort the _sources_ list. */
      _sourcesFilteredAndSorted: {
          type: Array,
          value: []
      },

  },

  _onFiltersChanged: function(to, from)
  {
      if (this._filters.length === 0)
      {
          this.selectedFilterId = null;
          return;
      }

      var firstFilter = this._filters[0];
      this.selectedFilterId = firstFilter.id;
  },

  _onSelectedFilterIdChanged: function(to, from)
  {
      var selectedFilterId = to;

      if (!selectedFilterId)
      {
          this.selectedFilter = null;
          return;
      }

      this._filters.forEach(function(filter)
      {
          if (filter.id === selectedFilterId)
              this.selectedFilter = filter;
      }.bind(this))
  },

  _onFtSourcePanelFiltersChangedInBehavior: function()
  {
      var filters = JSON.parse(this.ftSourcePanelFilters);
      if (!filters)
          filters = [];
      this._filters = filters;
  },

  _clearSearchPattern: function()
  {
      this._searchPattern = "";
  },

  _onSourcesChanged: function()
  {
      // TODO: Is this still necessary?
      // Hack so that contents always get clipped, initially.
      setTimeout(function()
      {
          this.$.sourceGrid.fire('resize')
      }.bind(this), 1)
  },

  _onTap: function(event)
  {
      // if (event.ftComponentName === undefined)
      //     event.ftComponentName = "ft-source-panel";
  },

  _filter: function(source)
  {
      var searchString = this._searchPattern.toLowerCase();

      // If we have no search string, let everything through
      if (searchString === "")
          return true;

      // If the search string matches any part of the source name, let it through
      var sourceName = source.name.toLowerCase();
      var index = sourceName.indexOf(searchString);
      var containsSearchString = (index >= 0);
      if (containsSearchString)
          return true;

      // No match
      return false;
  },

  _sorter: function(first, second)
  {
      // Sort alphabetically by the source name
      return (first.name > second.name ? 1 : -1);
  },

  _searchPatternChanged: function(to, from)
  {
      this._haveSearchPattern = !!this._searchPattern;

      var arrayFilter = this.$.arrayFilter;
      arrayFilter.update();
  },

  _onConnectCommand: function(event, detail)
  {
      var source = detail;
      var createConnectionDialog = this.$.createConnectionDialog;
      createConnectionDialog.source = source;

      createConnectionDialog.open();
  },

  _showButtonChanged: function(to, from)
  {
      this._showHeader = this._canShowHeader();

      if (!this.ftSourcePanelShowSearchField)
          this._clearSearchPattern();
  },

  _canShowHeader: function()
  {
      if (this.ftSourcePanelShowHeading)
          return true;
      if (this.ftSourcePanelShowFilters)
          return true;
      if (this.ftSourcePanelShowSearchField)
          return true;
      return false;
  },

  _onCreateConnectionDialogClosed: function()
  {
      // Deselect the selected source item
//                this.selectedSource = null;  // This should work!!!
      this.$.sourceGrid.clearSelection();
  },

  _onSettingsPropertyChanged: function()
  {
      this._showButtonChanged();

      this.fire("settings-property-changed");
  }
});
