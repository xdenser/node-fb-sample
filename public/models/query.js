!function(){
    var emptyCols = [{ "sTitle": " " }] 
    var viewModel = {
        sql: ko.observable(),
        navigation: ko.observable(null),
        runQuery: function(){
            /*
            $.post('/runQuery',{
                connection: this.navigation().currentConnection(),
                sql: this.sql()
            },function(data){
               if(data.err) alert(data.err);
               else {
                 alert(data.data); 
               };                
            },'text json');
            */
           var self = this;
           $.ajax({
               type: 'POST',
               url: '/runQuery',
               data: {
                connection: this.navigation().currentConnection(),
                sql: this.sql()
               },
               success: function(data){
               if(data.err) alert(data.err);
               else {
                 //alert(data.data);
                 if(data.fields.length){
                     var cols = [];
                     data.fields.forEach(function(el){
                         cols.push({sTitle:el});
                     });
                     self.tableSource({
                         columns: cols,
                         data: data.data
                     });
                 } 
               };                
              },
              dataType: 'text json',
              error: function(jqXHR, textStatus, errorThrown){
                  alert(textStatus);
              }
           });    
        },
        tableSource:ko.observable(null), 
        data: ko.observable([]),
        columns: ko.observable(emptyCols)
    };    
    
    ko.registerModel('query',viewModel);
}(); 