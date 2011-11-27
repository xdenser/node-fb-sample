

!function(){
       var viewModel = {
           navigation: null,
           navigationTmpl: ko.observable("empty"),
           mainContent: null,
           mainContentTmpl: ko.observable("empty")
       };

       function SetReferences(){
           viewModel.mainContent.navigation(viewModel.navigation);
       } 
       
       ko.loadModel('navigation',function(m){
           viewModel.navigation = m;
           viewModel.navigationTmpl('navigation');
           if(viewModel.mainContent) SetReferences();
       });
       
       ko.loadModel('query',function(m){
           viewModel.mainContent = m;
           viewModel.mainContentTmpl('query');
           if(viewModel.navigation) SetReferences();
       })
      
      /* 
       viewModel.mainStep = ko.dependentObservable(function(){
       //    return ( + viewModel.navWidth().replace(/^(\d+)px/,'$1') + 10)+"px";
       });
       */
       
       ko.registerModel('main',viewModel);  
}();

