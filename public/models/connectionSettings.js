!function(){

   var dialog;     
    var viewModel = {
        
        Name: ko.observable(""),
        database: ko.observable(""),
        user: ko.observable(""),
        password: ko.observable(""),
        role: ko.observable(""),
        
        Status:ko.observable("none"),
        StatusMessage:ko.observable(""),
         
       getConnSetts: function(){
         return JSON.stringify({
            Name: this.Name(),
            database: this.database(),
            user: this.user(),
            password: this.password(),
            role: this.role() 
         });  
       },
       
       addConnection:function()
       {
           var self = this;
           this.Status('busy');
           var z = this.getConnSetts();
           if(!this.Name()) {
               this.Status('error');
               this.StatusMessage('Enter name for connection');
               return;
           }
           
           $.post('/addconnection',{connection: z},function(data){
               if(data.err){
                  self.Status('error');
                  self.StatusMessage('Error: '+data.err);
               }
               else
               {
                   self.navigation.connections.push(self.Name());
                   dialog.dialog('close');
               }
           },'json');
       }, 
       checkConnection: function()
       {
           var self = this;
           this.Status('busy');
           $.post('/checkconnection',{check: this.getConnSetts()},function(data){
               $('#busy').hide();
               if(data.err){
                  self.Status('error');
                  self.StatusMessage('Error: '+data.err);
               }
               if(data.connected)
               {
                   self.Status('success');
                   self.StatusMessage('Successfully connected');
               }
               
           },'json')
       },
       applyConnection: function()
       {
           
       },
        
       showAddDialog:function(){
         dialog.dialog({
             title:"New Connection Settings",
             buttons:{
                 'Add':this.addConnection.bind(this),
                 'Check Connection': this.checkConnection.bind(this),
                 'Cancel': function(){
                     $(this).dialog('close');
                 }
             }
         });
         
         dialog.dialog("open");
       }, 
       showEditDialog:function(name){
         var self = this;  
         $.post('/getconnection',{name: name},function(data){
            self.Name(data.Name);
            self.database(data.database);
            self.user(data.user);
            self.password(data.password);
            self.role(data.role);
            
            dialog.dialog({
             title:"Edit Connection Settings",
             buttons:{
                 'Apply':self.applyConnection.bind(self),
                 'Check Connection': self.checkConnection.bind(self),
                 'Cancel': function(){
                     $(this).dialog('close');
                 }
             }
            });
         
            dialog.dialog("open");             
         },'json');  
       },
       navigation: null,
       init: function(d)
       {
         dialog = d;
         var self = this;
         d.dialog({
             title:"Connection Settings",
             autoOpen: false,
             width: 430,
             open: function(){
                 self.Status('none');
             },
             buttons:{
                 'OK': function(){},
                 'Cancel': function(){}
             }
         });
       }
    };
    
    ko.registerModel('connectionSettings',viewModel);
    
}();
