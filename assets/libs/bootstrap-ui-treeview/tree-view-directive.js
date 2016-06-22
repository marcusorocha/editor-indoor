﻿angular.module('ui.bootstrap.treeview').directive('treeView', ['$compile', '$templateCache', function ($compile, $templateCache) {
    return {
        restrict: 'E',
        scope: {},
        bindToController: {
            treeService: '='
        },
        controller: function () {

            var that = this;

            this.isCollapsed = function(node) {
                return that.treeService.collapsed.indexOf(node) > -1;
            };

            // toggle when icon clicked
            this.toggleNode = function (node) {

                if (!node.children) return;

                // collapse / expand
                if (node.children && node.children.length > 0) {
                    // add the node to our collapsed array
                    var index = that.treeService.collapsed.indexOf(node);

                    if (index == -1)
                        that.treeService.collapsed.push(node);
                    else
                        that.treeService.collapsed.splice(index, 1);
                }
            };

            // select when name clicked
            this.selectNode = function (e, node) {
                that.treeService.selectedNode = node;

                e.stopPropagation();
                e.preventDefault();
            };
        },
        controllerAs: 'ctrl',
        link: function (scope, element, attrs, ctrl) {
            var isRoot = (!attrs.treeRoot ? true : false);
            var nodeLabel = attrs.nodeLabel || 'label';
            var itemClass = attrs.itemClass || '';
            var itemInclude = attrs.itemNgInclude || '';
            var itemIncludeHtml = '';
            var emptyTreeMessage = attrs.emptyTreeMessage || 'No items to display';
            var emptyTreeClass = attrs.emptyTreeClass || 'alert alert-info';

            if (itemInclude && itemInclude.length > 0) {
                itemIncludeHtml = $templateCache.get(attrs.itemNgInclude);
            }

            // remove attributes
            element.removeAttr('node-label');
            element.removeAttr('item-class');
            element.removeAttr('item-ng-include');
            element.removeAttr('tree-root');

            // template
            var template = '';

            if (!isRoot)
                template =  '<ul>';
            else
                template = '<ul ng-if="ctrl.treeService.nodes.length">';

            template += '<li ng-repeat="node in [REPLACENODES]">' +
                '<div ng-click="ctrl.selectNode($event, node)" class="node" ng-class="{\'selected\' : node == ctrl.treeService.selectedNode}">' +
                '<div ' + (itemClass != '' ? ' class="' + itemClass + '"' : '') + '>' +
                '<i ng-click="ctrl.toggleNode(node)" ng-show="node.children && node.children.length > 0" ng-class="!ctrl.isCollapsed(node) ? \'has-child\' : \'has-child-open\'"></i>' +
                '<i ng-click="ctrl.toggleNode(node)" class="no-child" ng-show="!node.children || node.children.length == 0"></i>' +
                '<span ng-bind="node.' + nodeLabel + '" ng-class="{\'selected\' : node == ctrl.treeService.selectedNode}"></span>' +
                '</div>' +
                itemIncludeHtml +
                '</div>' +
                '<tree-view uib-collapse="!ctrl.isCollapsed(node)" tree-service="ctrl.treeService" node-children="node.children" tree-root="false" node-label="' + nodeLabel + '" item-ng-include="' + itemInclude + '" item-class="' + itemClass + '"></tree-view>' +
                '</li>' +
                '</ul>';

            if (!isRoot) {
                template = template.replace('[REPLACENODES]', '$parent.node.children');
            } else {
                template = template.replace('[REPLACENODES]', 'ctrl.treeService.nodes');
                template += '<div class="' + emptyTreeClass + '" ng-show="ctrl.treeService.nodes.length == 0">' + emptyTreeMessage + '</div>';
            }

            var compiledHtml = $compile(template)(scope);

            element.append(compiledHtml);
        }
    };
}]);