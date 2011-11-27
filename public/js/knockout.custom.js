ko.bindingHandlers.splitter = {
  init: function(element, valueAccessor, allBindingsAccessor, viewModel){
    $(element).splitter();
    var binding = valueAccessor();
    if(binding.position) $(element).trigger("resize", [ binding.position ]);
  }
 };
 

ko.bindingHandlers.dataTable = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel){
        var binding = valueAccessor();
        var s = binding.source();
        
        if(s){ 
        var options = binding.options||{}; 
        options = $.extend({
              "aaData": s.data,
              "aoColumns": s.columns, 
              "bDestroy": true
         },options);
       
         $(element).dataTable(options);
        }
    }
}
