

liberator.plugins.reorgSQLite = (function(){
 
const obs = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
const ss = Cc["@mozilla.org/storage/service;1"].getService(Ci.mozIStorageService);
 
let sqliteFiles = [];
 
function getSQLiteFiles(){
  if (sqliteFiles.length > 0){
    return sqliteFiles;
  }
  let profDir = services.get("directory").get("ProfD", Ci.nsIFile);
  let files = profDir.directoryEntries;
  let reg = new RegExp("\\.sqlite$");
  while (files.hasMoreElements()){
    let file = files.getNext().QueryInterface(Ci.nsIFile);
    if (file.isFile() && reg.test(file.leafName)){
      sqliteFiles.push(file);
    }
  }
  return sqliteFiles;
}
 
/**
* @param {mozIStorageConnection} dbc
*/
function reorg(dbc){
  let fileName = dbc.databaseFile.leafName;
  try {
    dump(fileName + ": VACUUM");
    dbConnection.executeSimpleSQL("VACUUM");
    dump(fileName + ": REINDEX");
    dbConnection.executeSimpleSQL("REINDEX");
  } catch(e){
    dump("ERROR: " + fileName + ": " + e.message);
  }
}
/**
* @param {nsIFile} file
* @return {Object} returns {pageSize, pageCount, freeCount}
*/
function analyzeDatabase(file){
  let dbc = ss.openDatabase(file);
  let pageSize = getPragmaInfo(dbc, "page_size");
  let result = {
    pageSize: pageSize,
    pageCount: getPragmaInfo(dbc, "page_count") || file.fileSize / pageSize,
    freeCount: getPragmaInfo(dbc, "freelist_count"),
  };
  liberator.log(file.leafName, 0);
  liberator.log(result, 0);
  return result;
}
/**
* @param {mozIStorageConnection} dbc
* @param {String} name pragma-name
*/
function getPragmaInfo(dbc, name){
  let fileName = dbc.databaseFile.leafName;
  let sql = "PRAGMA " + name;
  let st = dbc.createStatement(sql);
  let result;
  try {
    while(st.executeStep()){
      result = st.getInt32(0);
      dump(fileName + ": " + sql + ": " + result);
    }
  } catch(e){
    dump("ERROR: " + fileName + ": " + e.message);
  } finally {
    st.reset();
    st.finalize();
  }
  return result;
}
 
function dump(str){
  window.dump((new Date).toString() + ": " + str + "\n");
}
 
let observer = {
  register: function(){
    obs.addObserver(this, "profile-before-change", false);
  },
  unregister: function(){
    obs.removeObserver(this, "profile-before-change");
  },
  observe: function(aSubject, aTopic, aData){
    self.reorganize();
    this.unregister();
  }
}
 
// ---------------------------------------
// Global Section
// ---------------------------------------
let self = {
  reorganize: function(){
    for (let [i,file] in Iterator(getSQLiteFiles())){
      let result = analyzeDatabase(file);
      let dbc;
      if (result.freeCount> 10){
        try {
          dbc = ss.openDatabase(file);
          reorg(dbc);
        } catch(e){
          dump(file.leafName + ": " + e.message);
        } finally {
          dbc.close();
        }
      }
    }
    return result;
  },
  analyze: function(){
    let result = [];
    for (let [i,file] in Iterator(getSQLiteFiles())){
      let res = analyzeDatabase(file);
      result.push([
        file.leafName,
        res.pageSize,
        res.pageCount,
        res.freeCount
      ]);
    }
    let xml = template.tabular(
      ["SQLite File","PageSize(Byte)","PageCount","FreelistCount"], [], result
    );
    liberator.echo(xml, true);
  },
};
observer.register();
//liberator.registerObserver("shutdown", self.reorganize);
return self;
})();
 
// vim:sw=2 ts=2 et:
 


