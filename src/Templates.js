angular.module("decorated-stock-chart").run(["$templateCache", function($templateCache) {$templateCache.put("DecoratedStockChart.html","<div class=\"root\" style=\"position: relative\">\r\n    <i ng-show=\"isProcessing\" class=\"fa fa-spinner fa-spin fa-3x spinner\"></i>\r\n\r\n    <div class=\"control flex-container\"\r\n         ng-init=\"showSecurityControl = false; showIndicatorControl = false; showBenchmarkControl = false;\">\r\n        <!-- security & attributes selection -->\r\n        <span>\r\n                <input type=\"text\" ng-model=\"defaultSecurityAttribute\" class=\"form-control\"\r\n                       style=\"width: 8em; display: inline;\"\r\n                       typeahead=\"attr as attr.label for attr in availableSecurityAttributes | filter:$viewValue | limitTo:8\"/>\r\n            <a><i ng-click=\"toggleSlide(!showSecurityControl, \'security-control\'); showSecurityControl = !showSecurityControl\"\r\n                  class=\"fa clickable\"\r\n                  ng-class=\"{\'fa-chevron-up\': showSecurityControl, \'fa-chevron-down\': !showSecurityControl}\"></i></a>\r\n        </span>\r\n        <!-- TODO implement these date functionalities -->\r\n        <span>\r\n            <a class=\"clickable\">1M</a>\r\n            &nbsp;\r\n            <a class=\"clickable\">3M</a>\r\n            &nbsp;\r\n            <a class=\"clickable\">6M</a>\r\n            &nbsp;\r\n            <a class=\"clickable\">1Y</a>\r\n            &nbsp;\r\n            <a class=\"clickable\">2Y</a>\r\n            &nbsp;\r\n            <span ng-init=\"showDateControl = false\">\r\n                <a class=\"clickable\"\r\n                   ng-click=\"toggleSlide(!showDateControl, \'date-control\');\r\n                             showDateControl = !showDateControl;\r\n                             dateChangeError = false;\r\n                             start = states.dateRange.start;\r\n                             end = states.dateRange.end\">\r\n                    <i class=\"fa fa-calendar\"></i>\r\n                </a>\r\n                <div class=\"date-control floating-form\" style=\"display: none;\">\r\n                    <label>From&nbsp;<input type=\"date\" class=\"form-control\"\r\n                                            style=\"display: inline; width: 12em;\" ng-model=\"start\"/></label>\r\n                    <label>To&nbsp;<input type=\"date\" class=\"form-control\"\r\n                                          style=\"display: inline; width: 12em;\" ng-model=\"end\"/></label>\r\n                    <button class=\"btn btn-success\"\r\n                            ng-click=\"dateChangeError = apiHandle.api.changeDateRange(start, end)\">\r\n                        <i class=\"fa fa-play\"></i>\r\n                    </button>\r\n                </div>\r\n            </span>\r\n        </span>\r\n        <span>\r\n            <span class=\"flex-container\">\r\n                <span class=\"menu-container\">\r\n                    <a class=\"clickable\"\r\n                       ng-click=\"toggleSlide(!showIndicatorControl,\'indicator-control\'); showIndicatorControl = !showIndicatorControl\">\r\n                        <i class=\"fa fa-plus\"></i>&nbsp;Macro Indicator &amp; Market Index\r\n                    </a>\r\n                    <div class=\"indicator-control floating-form\" style=\"display: none;\">\r\n                        <label>\r\n                            Search&nbsp;\r\n                            <input type=\"text\" placeholder=\"ex: S&P 500, Financial CDS ...\" class=\"form-control\"\r\n                                   style=\"width: 26em;\"\r\n                                   ng-model=\"selected\"\r\n                                   typeahead=\"attr.label for attr in marketIndexTypeahead({userInput: $viewValue}) | limitTo:8\"\r\n                                   typeahead-on-select=\"addMarketIndicator($item); selected = \'\'\"/>\r\n                        </label>\r\n                    </div>\r\n                </span>\r\n                <span> &nbsp; </span>\r\n                <span class=\"menu-container\">\r\n                    <a class=\"clickable\"\r\n                       ng-click=\"toggleSlide(!showBenchmarkControl, \'benchmark-control\'); showBenchmarkControl = !showBenchmarkControl\">\r\n                        <i class=\"fa fa-plus\"></i>&nbsp;Custom Benchmark\r\n                    </a>\r\n                    <div class=\"benchmark-control floating-form\" style=\"display: none;\"\r\n                         ng-init=\"customBenchmark = {sector: \'Corporates\', wal: \'All\', rating: \'All\', analytic: {tag: \'oas\', label:\'OAS\' }}\">\r\n                        <alert ng-show=\"alerts.customBenchmark.active\" close=\"alerts.customBenchmark.active = false\" type=\"danger\">{{alerts.customBenchmark.message}}</alert>\r\n                        <label>\r\n                            Sector&nbsp;\r\n                            <input type=\"text\" class=\"form-control\" style=\"width: initial;\"\r\n                                   ng-model=\"customBenchmark.sector\"\r\n                                   typeahead-editable=\"false\"\r\n                                   typeahead=\"sector for sector in customBenchmarkOptions.sectors | filter:$viewValue | limitTo:8\"/>\r\n                        </label>\r\n                        <label>\r\n                            Rating&nbsp;\r\n                            <input type=\"text\" class=\"form-control\" style=\"width: initial;\"\r\n                                   ng-model=\"customBenchmark.rating\"\r\n                                   typeahead-editable=\"false\"\r\n                                   typeahead=\"rating for rating in customBenchmarkOptions.ratings | filter:$viewValue | limitTo:8\"/>\r\n                        </label>\r\n                        <label>\r\n                            WAL&nbsp;\r\n                            <input type=\"text\" class=\"form-control\" style=\"width: initial;\"\r\n                                   ng-model=\"customBenchmark.wal\"\r\n                                   typeahead-editable=\"false\"\r\n                                   typeahead=\"wal for wal in customBenchmarkOptions.wal | filter:$viewValue | limitTo:8\"/>\r\n                        </label>\r\n                        <label>\r\n                            Analytic&nbsp;\r\n                            <input type=\"text\" class=\"form-control\" style=\"width: initial;\"\r\n                                   ng-model=\"customBenchmark.analytic\"\r\n                                   typeahead-editable=\"false\"\r\n                                   typeahead=\"attr.label for attr in customBenchmarkOptions.analytics | filter:$viewValue | limitTo:8\"/>\r\n                        </label>\r\n                        <button class=\"btn btn-success\" ng-click=\"addCustomBenchmark(customBenchmark)\"><i\r\n                                class=\"fa fa-play\"></i></button>\r\n                    </div>\r\n                </span>\r\n            </span>\r\n        </span>\r\n        <span><a class=\"clickable\" ng-click=\"exportXLS()\"><i class=\"fa fa-share-square-o\"></i></a></span>\r\n    </div>\r\n    <div class=\"security-control floating-form\" style=\"display: none;\">\r\n        <div ng-show=\"states.securityAttrMap.length === 0\">\r\n            <h5>No Security Selected</h5>\r\n        </div>\r\n        <div class=\"flex-container\">\r\n            <div class=\"wrappable-flex-item\" ng-repeat=\"securityAttrPair in states.securityAttrMap\">\r\n                <!-- selected attributes display -->\r\n                    <span class=\"label label-success\">{{securityAttrPair[0].label}} | <i class=\"fa fa-remove clickable\"\r\n                                                                                         ng-click=\"apiHandle.api.removeSecurity(securityAttrPair[0].id)\"></i></span>\r\n                    <span class=\"label label-primary\" ng-repeat=\"attr in securityAttrPair[1]\">\r\n                            {{attr.label}} | <i class=\"fa fa-remove clickable\"\r\n                                                ng-click=\"removeAttr(attr, securityAttrPair)\"></i>\r\n                    </span>\r\n                <!-- input to select more attributes-->\r\n                &nbsp;\r\n                <input type=\"text\"\r\n                       placeholder=\"+ Attribute\"\r\n                       ng-disabled=\"securityAttrPair[1].length >= 2\"\r\n                       ng-model=\"selected\"\r\n                       typeahead=\"attr.label for attr in availableSecurityAttributes | filter:$viewValue | limitTo:8\"\r\n                       class=\"form-control\"\r\n                       style=\"width: 8em; display: inline;\"\r\n                       typeahead-on-select=\"addAttr($item, securityAttrPair); selected = \'\'\">\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <hr/>\r\n    <div ng-attr-id=\"{{\'enriched-highstock-\'+id}}\" class=\"row\">\r\n        <!-- this is where the stock chart goes -->\r\n    </div>\r\n</div>\r\n");}]);