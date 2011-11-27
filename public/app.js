require(['models/main'],function(){
   $.get("templates/main.tmpl", function(template) {
            $("body").append( template  );
            ko.applyBindings(ko.getModel('main'));         
   });  
})




