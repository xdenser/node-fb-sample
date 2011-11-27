!function(){
    var viewModel = {
        msg: ko.observable("Works!"),
        connections:ko.observableArray(),
        currentConnection: ko.observable(),
        alert: function(){ alert("hi");},
        
        addConnection:function(){
            this.connSettings.showAddDialog();
        },
        editConnection:function(){
            this.connSettings.showEditDialog(this.currentConnection());
        },
        deleteConnection:function(){
           if(confirm("Delete "+this.currentConnection()+" ?"))
           {
             var self = this;
             $.post('/deleteconnection',{name: this.currentConnection()},function(data){
                 if(!data.err){
                   var z = self.connections.indexOf(self.currentConnection());
                   if(z>=0) self.connections.splice(z,1);
                 }
                 else alert(data.err);  
             },'json');   
           }  
        },
        connSettings: null
    };
    
    $.getJSON('/connections',function(data){
        viewModel.connections(data);
    });
    
    ko.createDialog('connectionSettings',function(m){
        viewModel.connSettings = m;
        m.navigation = viewModel;
    })
        
    ko.registerModel('navigation',viewModel);  
}();
