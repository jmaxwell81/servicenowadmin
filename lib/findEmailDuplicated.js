// findEmailDuplicated finds the emails that have same recipients and subject for a given incident
// 
// Example of use:
// gs.print('RESULTS:'+findEmailDuplicated('incident','3d81170ddba983002fd876231f961954').join('\n'));
function findEmailDuplicated(vtable, vsysid) { 
    var vmessage = [],
        listofsysids = [],
        vurl = gs.getProperty("glide.servlet.uri");

    // validate and find the target
    if (vtable && vsysid) {
        var b = new GlideRecord(vtable);
        b.get(vsysid)
    } else vmessage.push("ERROR: Provide targetable and targesysid");
    
	if (b.isValid()) {
	
			vmessage.push('Searching for duplicates on ' + vtable + 
"\n\n* " + b.getDisplayValue () + "- created " +b.sys_created_on + " by " + b.sys_created_by + 
"\n-- " + vurl + vtable + ".do?sys_id=" + b.sys_id );
	
	
	// Find emails duplicated
	var duplicates_found = getDuplicates("sys_email","subject,recipients","type=sent^target_table="+vtable+"^instance="+vsysid+"^sys_created_onONLast 3 months@javascript:gs.beginningOfLast3Months()@javascript:gs.endOfLast3Months()");

    // gs.print(duplicates_found[1].join('\n'));

	// Find notification, conditions + event
	var gr2 = new GlideRecord('sys_email_log');
	gr2.addEncodedQuery("sys_created_onONLast 90 days@javascript:gs.beginningOfLast90Days()@javascript:gs.endOfLast90Days()^emailIN"+duplicates_found[1].join(','));
	gr2.setLimit(100);
	for (q=1,gr2.query(); gr2.next();q++) {
			vmessage.push(
"\n\n* Email #"+ q + " "+ gr2.email.getDisplayValue () + " created " +gr2.email.sys_created_on + " by " + gr2.email.sys_created_by + 
"\n-- " + vurl + "sys_email.do?sys_id=" + gr2.email +

"\n\n* Trigger Event #"+ q + " "+ gr2.event.getDisplayValue() + " created " +gr2.event.sys_created_on + " by " + gr2.event.sys_created_by + 
"\n-- " + vurl + "sysevent.do?sys_id=" + gr2.event +

"\n\n* Email notification #"+ q + " "+ gr2.notification.getDisplayValue() + "' "+ (parseBool(gr2.notification.action_insert) ? "on Insert" : "" ) + (parseBool(gr2.notification.action_update) ? "on Update" : "") + ", on "+ gr2.notification.collection + ", updated "+gr2.notification.sys_updated_on+" by " + gr2.notification.sys_updated_by +
"\n-- " + vurl + "sysevent_email_action.do?sys_id=" + gr2.notification + 
"\n\nIt reads \n" + gr2.notification.generation_type.getDisplayValue() + " - event name: " + gr2.notification.event_name + 
"\nCondition:" + gr2.notification.condition + " - Advanced condition: " + gr2.notification.advanced_condition + 
"\n")


	}
	} else vmessage.push("ERROR: Provide valid targetable and targesysid");
	return vmessage;
	// Find conditions 
	
	function parseBool(a) {  
        return "boolean" == typeof a ? a : /^(true|1|yes|on)$/i.test(a)  
    }
}

// getDuplicates would return a list of duplicated records given a table, fields, and query
//    vtable is the table to search for duplicates
//    vfields is the key of one or more fields on which to group to match for duplicates
//    vencodequery is the query of records on which to find a duplicate
// 
// var duplicates_found = getDuplicates("sys_email","subject,recipients","type=sent^target_table=incident^instance=3d81170ddba983002fd876231f961954");
// gs.print("duplicates found: "+ duplicates_found[0].length + " \n" + duplicates_found[0].join("\n") );
function getDuplicates(vtable, vfields, vencodequery) {
    var b = [],
        vlistsysids = [];
    if (vfields && vtable) {
    	var a = new GlideAggregate(vtable);
        vfields = vfields.split(",");
        vencodequery && a.addEncodedQuery(vencodequery);
        a.addAggregate("COUNT", "sys_id");
        for (i = 0; i < vfields.length; i++) a.isValidField(vfields[i]) && a.groupBy(vfields[i]);
        a.addHaving("COUNT", ">", 1);
        for (a.query(); a.next();) {
            var vresult = [],
                gr = new GlideRecord(vtable);
            gr.addQuery(vencodequery);
            for (i = 0; i < vfields.length; i++) gr.addQuery(vfields[i], a.getValue(vfields[i])) &&
                vresult.push(vfields[i] + ": " + a.getValue(vfields[i]));
            for (gr.query(); gr.next();) vlistsysids.push(gr.getValue("sys_id")) && b.push("sys_id: " + gr.getValue("sys_id") + " - " + vresult.join(", "))
        }
    }
    return [b, vlistsysids]
};
