liberator.plugins.sqliteReorg = (function(){
const ss = Cc["@mozilla.org/storage/service;1"].getService(Ci.mozIStorageService);
function getSQLiteFiles(){
  let profDir = services.get("directory").get("ProfD", Ci.nsIFile);
  let files = profDir.directoryEntries;
  let reg = new RegExp("\\.sqlite$");
  while (files.hasMoreElements()){
    let file = files.getNext().QueryInterface(Ci.nsIFile);
    if (file.isFile() && reg.test(file.leafName)){
      yield file;
    }
  }
}
let self = {
  start: function(){
    for (let file in getSQLiteFiles()){
      liberator.echomsg("Open " + file.leafName, 1);
      let dbc = ss.openDatabase(file);
      this.reorg(dbc);
      dbc.close();
      liberator.echomsg("Close", 1);
    }
  },
  reorg: function(dbConnection){
    try {
      dbConnection.executeSimpleSQL("VACUUM");
      dbConnection.executeSimpleSQL("REINDEX");
    } catch(e){
      alert("ERROR: "+　dbConnection.databaseFile.leafName　+　": "　+　e.message);
    }
  },
};
liberator.registerObserver("shutdown", self.start);
return self;
})();

