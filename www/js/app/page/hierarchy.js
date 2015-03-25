$(function() {
  $(document).delegate('.tree', 'click', function() {
    ValidationHelper.validateHierarchyChange(this.id);
  });
});