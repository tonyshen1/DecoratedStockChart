angular.module("decorated-stock-chart").run(["$templateCache", function($templateCache) {$templateCache.put("DecoratedStockChart.html","<div class=\"root\" style=\"position: relative\">\r\n    <i ng-show=\"isProcessing\" class=\"fa fa-spinner fa-spin fa-3x spinner\"></i>\r\n\r\n    <div class=\"control flex-container\"\r\n         ng-init=\"showSecurityControl = false; showIndicatorControl = false; showBenchmarkControl = false;\">\r\n        <span style=\"left:0;\">\r\n            <!-- security & attributes selection -->\r\n            <span>\r\n                    <input type=\"text\" ng-model=\"defaultSecurityAttribute\" class=\"form-control\"\r\n                           style=\"width: 12em; display: inline; height:25px;\"\r\n                           typeahead=\"attr as attr.label for attr in availableSecurityAttributes | filter:$viewValue:$emptyOrMatch | limitTo:8\"\r\n                           typeahead-editable=\"false\"\r\n                           typeahead-focus />\r\n                <a><i ng-click=\"toggleSlide(!showSecurityControl, \'security-control\'); showSecurityControl = !showSecurityControl\"\r\n                      class=\"fa clickable\"\r\n                      ng-class=\"{\'fa-chevron-up\': showSecurityControl, \'fa-chevron-down\': !showSecurityControl}\"></i></a>\r\n            </span>\r\n            <!-- TODO implement these date functionalities -->\r\n            <span>\r\n                <span class=\"flex-container\" style=\"margin-top:10px;margin-bottom:-10px;\">\r\n                    <span class=\"menu-container\">\r\n                        <a class=\"clickable\"\r\n                           ng-click=\"toggleSlide(!showIndicatorControl,\'indicator-control\'); showIndicatorControl = !showIndicatorControl\">\r\n                            <i class=\"fa fa-plus\"></i>&nbsp;Macro/Market Indicators\r\n                        </a>\r\n                        <div class=\"indicator-control floating-form\" style=\"display: none;\">\r\n                            <label>\r\n                                Search&nbsp;\r\n                                <input type=\"text\" placeholder=\"ex: S&P 500, Financial CDS ...\" class=\"form-control\"\r\n                                       style=\"width: 26em;\"\r\n                                       ng-model=\"selected\"\r\n                                       typeahead=\"attr.label for attr in marketIndexTypeahead({userInput: $viewValue}) | filter:$viewValue:$emptyOrMatch | limitTo:8\"\r\n                                       typeahead-on-select=\"apiHandle.api.addMarketIndicator($item); selected = \'\';showIndicatorControl = false;\"\r\n                                       typeahead-editable=\"false\"\r\n                                       typeahead-focus/>\r\n                            </label>\r\n                            <a class=\"clickable\" ng-if=\"showMoreMarketInfo\" ng-click=\"moreMarketInfoCallback()\"\r\n                                style=\"right: 10px;position: absolute;\">Show All</a>\r\n                        </div>\r\n                    </span>\r\n                    <span class=\"menu-container\" style=\"padding-left:15px;\">\r\n                        <a class=\"clickable\" style=\"padding-left:5px;\"\r\n                           ng-click=\"toggleSlide(!showBenchmarkControl, \'benchmark-control\'); showBenchmarkControl = !showBenchmarkControl\">\r\n                            <i class=\"fa fa-plus\"></i>&nbsp;Custom Benchmark\r\n                        </a>\r\n                        <div class=\"benchmark-control floating-form\" style=\"display: none;\"\r\n                             ng-init=\"customBenchmark = {sector: \'Corporates\', wal: \'All\', rating: \'All\', analytic: {tag: \'oas\', label:\'OAS\' }}\">\r\n                            <alert ng-show=\"alerts.customBenchmark.active\" close=\"alerts.customBenchmark.active = false\" type=\"danger\">{{alerts.customBenchmark.message}}</alert>\r\n                            <label>\r\n                                Sector&nbsp;\r\n                                <input type=\"text\" class=\"form-control\" style=\"width: initial;\"\r\n                                       ng-model=\"customBenchmark.sector\"\r\n                                       typeahead=\"sector for sector in customBenchmarkOptions.sectors | filter:$viewValue:$emptyOrMatch | limitTo:8\"\r\n                                       typeahead-editable=\"false\"\r\n                                       typeahead-focus/>\r\n                            </label>\r\n                            <label>\r\n                                Rating&nbsp;\r\n                                <input type=\"text\" class=\"form-control\" style=\"width: initial;\"\r\n                                       ng-model=\"customBenchmark.rating\"\r\n                                       typeahead=\"rating for rating in customBenchmarkOptions.ratings | filter:$viewValue:$emptyOrMatch | limitTo:8\"\r\n                                       typeahead-editable=\"false\"\r\n                                       typeahead-focus/>\r\n                            </label>\r\n                            <label>\r\n                                WAL&nbsp;\r\n                                <input type=\"text\" class=\"form-control\" style=\"width: initial;\"\r\n                                       ng-model=\"customBenchmark.wal\"\r\n                                       typeahead=\"wal for wal in customBenchmarkOptions.wal | filter:$viewValue:$emptyOrMatch | limitTo:8\"\r\n                                       typeahead-editable=\"false\"\r\n                                       typeahead-focus/>\r\n                            </label>\r\n                            <label>\r\n                                Analytic&nbsp;\r\n                                <input type=\"text\" class=\"form-control\" style=\"width: initial;\"\r\n                                       ng-model=\"customBenchmark.analytic\"\r\n                                       typeahead=\"attr.label for attr in customBenchmarkOptions.analytics | filter:$viewValue:$emptyOrMatch | limitTo:8\"\r\n                                       typeahead-editable=\"false\"\r\n                                       typeahead-focus/>\r\n                            </label>\r\n                            <button class=\"btn btn-success\" ng-click=\"showBenchmarkControl = !apiHandle.api.addCustomBenchmark(customBenchmark)\"><i\r\n                                    class=\"fa fa-play\"></i></button>\r\n                        </div>\r\n                    </span>\r\n                </span>\r\n            </span>\r\n        </span>\r\n        <span style=\"right:0;\">\r\n            <span style=\"padding-right:25px;\">\r\n                <span class=\"clickable dsc-padding-right\" ng-repeat=\"period in customDefaultTimePeriods\" ng-click=\"selectTimePeriod(period)\"\r\n                      style=\"padding-right:5px;color:#005da0;\">\r\n                    {{period}}\r\n                </span>\r\n                <span class=\"clickable\" style=\"color:#005da0;\"\r\n                      ng-click=\"toggleSlide(!showDateControl, \'date-control\');\r\n                             showDateControl = !showDateControl;\r\n                             dateChangeError = false;\r\n                             start = states.dateRange.start;\r\n                             end = states.dateRange.end\">\r\n                    <i class=\"fa fa-calendar\"></i>\r\n                </span>\r\n                <div class=\"date-control floating-form\" style=\"display: none;\">\r\n                    <label>From&nbsp;<input type=\"date\" class=\"form-control\"\r\n                                            style=\"display: inline; width: 12em;\" ng-model=\"start\"/></label>\r\n                    <label>To&nbsp;<input type=\"date\" class=\"form-control\"\r\n                                          style=\"display: inline; width: 12em;\" ng-model=\"end\"/></label>\r\n                    <button class=\"btn btn-success\"\r\n                            ng-click=\"dateChangeError = apiHandle.api.changeDateRange(start, end);\r\n                                      dateChangeError ? null : showDateControl = !showDateControl;\">\r\n                        <i class=\"fa fa-play\"></i>\r\n                    </button>\r\n                </div>\r\n            </span>\r\n            <span>\r\n                <span class=\"clickable\" style=\"padding-right:5px;color:#005da0;\" ng-click=\"exportXLS()\"><i class=\"fa fa-share-square-o\"></i></span>\r\n                <span class=\"clickable\" style=\"padding-right:5px;color:#005da0;\" ng-repeat=\"customButton in customButtons\" ng-click=\"customButton.callback()\">\r\n                    <i class=\"fa\" ng-class=\"customButton.faClass\"></i>\r\n                </span>\r\n            </span>\r\n        </span>\r\n    </div>\r\n    <div class=\"security-control floating-form\" style=\"display: none;top:35px;\">\r\n        <div ng-show=\"states.securityAttrMap.length === 0\">\r\n            <h5>No Security Selected</h5>\r\n        </div>\r\n        <div class=\"flex-container\">\r\n            <div class=\"wrappable-flex-item\" ng-repeat=\"securityAttrPair in states.securityAttrMap\">\r\n                <!-- selected attributes display -->\r\n                    <span class=\"label label-success\">{{securityAttrPair[0].label}} | <i class=\"fa fa-remove clickable\"\r\n                                                                                         ng-click=\"apiHandle.api.removeSecurity(securityAttrPair[0].id)\"></i></span>\r\n                    <span class=\"label label-primary\" ng-repeat=\"attr in securityAttrPair[1]\">\r\n                            {{attr.label}} | <i class=\"fa fa-remove clickable\"\r\n                                                ng-click=\"removeAttr(attr, securityAttrPair)\"></i>\r\n                    </span>\r\n                <!-- input to select more attributes-->\r\n                &nbsp;\r\n                <input type=\"text\"\r\n                       placeholder=\"+ Attribute\"\r\n                       ng-disabled=\"securityAttrPair[1].length >= 2\"\r\n                       ng-model=\"selected\"\r\n                       typeahead=\"attr.label for attr in availableSecurityAttributes | filter:$viewValue | limitTo:8\"\r\n                       class=\"form-control\"\r\n                       style=\"width: 8em; display: inline;\"\r\n                       typeahead-on-select=\"addAttr($item, securityAttrPair); selected = \'\'\">\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <hr/>\r\n    <div ng-attr-id=\"{{\'enriched-highstock-\'+id}}\" style=\"width:100%;height:100%;\">\r\n        <!-- this is where the stock chart goes -->\r\n    </div>\r\n    <alert ng-show=\"alerts.generalWarning.active\" style=\"position:absolute;bottom:0;right:0;\"\r\n           close=\"alerts.generalWarning.active = false\" type=\"danger\">\r\n        {{alerts.generalWarning.message}}\r\n    </alert>\r\n</div>\r\n");}]);