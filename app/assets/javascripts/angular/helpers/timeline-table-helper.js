openprojectApp.factory('TimelineTableHelper', [function() {
  TimelineTableHelper = {
    flattenTimelineTree: function(root, processNodeCallback){
      var nodes = [];

      angular.forEach(root.childNodes, function(node){
        if (processNodeCallback) processNodeCallback(node, root);

        nodes.push(node);
        nodes = nodes.concat(TimelineTableHelper.flattenTimelineTree(node, processNodeCallback));
      });

      return nodes;
    },

    addRowDataToNode: function(node, parent) {
      // ancestors
      if (parent) {
        node.ancestors = [parent];
        if(parent.ancestors) node.ancestors = parent.ancestors.concat(node.ancestors);

      }

      // first level group
      isNested = node.level >= 2;
      if (node.payload.objectType === 'Project' && !isNested) {
        node.firstLevelGroup        = node.payload.getFirstLevelGrouping();
        node.firstLevelGroupingName = node.payload.getFirstLevelGroupingName();
      } else {
        // inherit group from parent
        node.firstLevelGroup = parent.firstLevelGroup;
      }
    },

    getTableRowsFromTimelineTree: function(tree) {
      TimelineTableHelper.addRowDataToNode(tree);

      rows = TimelineTableHelper.flattenTimelineTree(tree, TimelineTableHelper.addRowDataToNode);
      rows.unshift(tree);

      return rows;
    }
  };

  return TimelineTableHelper;
}]);
