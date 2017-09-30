/* Function findmatch is use on transformation maps to find a match with multiple coalesce fields

vlist: list of fields to compare, Array = [[ "source_field","target_field"],...]  Target field allows dot walk. 
vsource: source record,  
vtarget: target record,  
nomatchcreate: true will create record if there is no match)  
debugon: true will log the information about the matching results 
 
Returns sys_id of the target record, or null if error or if nomatchcreate = false and no match is found. 
 
Coalesce empty fields need to be OFF, so null answer (e.g on error), insert is cancelled 
*/  
function findmatch(vlist, vsource, vtarget, nomatchcreate, debugon) {
try {
    vtarget = new GlideRecord(vtarget + "");
    // Check the source fields coalesce has a value to add to the query 
    for (var h = vlist.length, c = 0; c < h; c++) 
    	vsource[vlist[c][0]].hasValue() && 
    	vsource.isValidField(vlist[c][0]) && 
    	vtarget.addQuery(vlist[c][1], "=", vsource[vlist[c][0]].getDisplayValue());

    vtarget.setLimit(1);
    vtarget.query();
    var d;
    vtarget.next() ? 
    	 // if we find a match, we return the sys_id, otherwise, if nomatchcreate = false returns null 
    	(d = vtarget.sys_id, debugon && (log.info("source: " + vsource.sys_id + " - record match: " + d), vsource.sys_import_state_comment = "record match: " + d)) : 
		// If no match is found it validates whether a new sys_id is required
    	nomatchcreate ? 
    		d = gs.generateGUID() :
        	(d = null, debugon && (log.info("source: " + vsource.sys_id + " - record match: None"), vsource.sys_import_state_comment = "record match: None"));
    return d
} catch (f) {
    return log.error("script error: " + f), vsource.sys_import_state_comment = "ERROR: " + f, null
}};
   
// Example of use
//     answer = function(a) {  
//         var list_to_compare=[["u_stockroom","stockroom.display_name"],  
//              ["u_parent_stockroom","parent_stockroom.display_name"],  
//              ["u_restocking_option","restocking_option"],  
//              ["u_model","model.display_name"]];  
//         return findmatch(list_to_compare, source, map.target_table,false,true);  
//     }(source);  
        
    
     
    