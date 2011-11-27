!function($){
    
  var models  = [];
  ko.registerModel = function(name, model){
      models.push({
          name: name,
          model: model
      });
  };
  
  function get(name)
  {
    for(var i=0; i<models.length; i++)
    {
        if(models[i].name == name) return models[i];  
    }  
    return null;
  }
  
  ko.getModel = function(name){
      var m = get(name);
      if(m) return m.model;
      return null;
  };
  
  ko.loadTemplate = function(name,cb){
      var m = get(name);
      if(m){
        $.get("templates/" + name + ".tmpl", function(template) {
            $("body").append("<script id='" + name + "' type='text/html'>" + template + "<\/script>");
            cb();
        });  
      }
  };
  
  ko.loadModel = function(name,cb){
      require(['models/'+name],function(){
          ko.loadTemplate(name,function(){
              cb(ko.getModel(name));
          });
      })
  };
  
  ko.createDialog = function(name,cb){
      ko.loadModel(name,function(model){
          var d = $('<div id="'+model+'-dialog" class="dialog"></div>').appendTo("body");
          d.html($('script#'+name).html());
          ko.applyBindings(model,d[0]);
          model.init(d);
          cb(model);
      });
  }
  
  
}(jQuery);
