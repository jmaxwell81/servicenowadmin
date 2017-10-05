// findNotificationfromEmail (vsysid) 
//  vsysid is the id of the email provided
//  Returns - String with the finding notifications match with the email 
//
// example of usage: 
// gs.print(findNotificationfromEmail('5348ac9adbe507002fd876231f9619f7').join('\n'));
//
// TODO: Validate cmn_notif and subcribable, pUSH notifications,
// findNotificationFromRecord
// REtrieve all 
// example of usage:

gs.print(findNotificationfromEmail('5348ac9adbe507002fd876231f9619f7').join('\n'));
gs.print(findNotificationFromRecord("incident","6638ac9adbe507002fd876231f9619c8").join("\n"));

// gs.print(findNotificationfromEmail('c3a63a97dbc14bc0d975f1c41d9619b7').join('\n'));
function findNotificationfromEmail(vemailsysid, vid) {
    var vmessage = [];
    var vurl = gs.getProperty("glide.servlet.uri");
    var gr = new GlideRecord('sys_email');
    var vid = vid || 1;
    vmessage.push("findNotificationfromEmail ('"+vemailsysid+"');\n^^^^^^^ RESULTS ^^^^^^^\n");

    gr.get(vemailsysid);
    if (gr.isValid()) {

		// Easily find the event+email logs 
        var gr1 = new GlideRecord('sys_email_log');
        gr1.addQuery('email', gr.sys_id);
        gr1.addEncodedQuery(createEncodedDateRange(gr.sys_created_on, gr.sys_updated_on, 1));
        gr1.setLimit(20);
        gr1.orderByDesc("sys_created_on");
        vmessage.push("^^^^^^^**Emails Logs  Query:** " + vurl + 'sys_email_log_list.do?sysparm_query=' + escape(gr1.getEncodedQuery()) + "\n\n");

        for ( r = 1, gr1.query(); gr1.next(); r++ ) {
        
            var vtemplate =  "-" + vid + "- Reviewing\n**Email '%1' Content type: %12 type: %6 state: %7 (Updated by %2 %3, Created by %4 %5)**\n-- %8\n\n\n```\nMessage Id: %9\nrecipients: %10\nUser Name: %11 \nError: %13\n```\n\n";
            var vvalues = [gr.subject, gr.sys_updated_by, gr.sys_updated_on.getDisplayValue(), gr.sys_created_by, gr.sys_created_on.getDisplayValue(), gr.type, gr.state, vurl + "sys_email.do?sys_id=" + gr.sys_id, gr.message_id, gr.recipients, gr.user_id ? (gr.user_id.user_name.getDisplayValue() + "+" + gr.user_id.user_name +  "+"): "(empty)",gr.content_type, gr.error_string ];
            vmessage.push(formatstring(vtemplate, vvalues));
        
	  		// Find the associated Notification 
            var gr2 = new GlideRecord('sysevent_email_action');
            gr2.get(gr1.notification);
            if (gr2.isValid()) {
                var vtemplate = "-" + vid + "." + r + "- It was triggered by\n**Notification '%1' on %2 %3 (Updated by %4 %5, Created by %6 %7 active: %8 weight: %9 sys_version:%10)**\n-- %11\n\n\n```\nCondition: %12\nSend to event creator: %13\nExclude Delegates: %14\nUsers: %15\nUsers/Groups in fields: %15\nGroups: %17\nSubscribable: %18\n```\n\n\n";
                var vvalues = [gr2.name, gr2.collection, (gr2.generation_type == "engine") ? ("insert/update: " + gr2.action_insert + "/" + gr2.action_update) : (gr2.generation_type + ": " + gr2.event_name) , gr2.sys_updated_by, gr2.sys_updated_on.getDisplayValue(), gr2.sys_created_by, gr2.sys_created_on.getDisplayValue(), gr2.active, gr2.weight, gr2.sys_version, vurl + gr2.getTableName() + ".do?sys_id=" + gr2.sys_id, gr2.condition, gr2.send_self, gr2.exclude_delegates, gr2.recipient_users, gr2.recipient_fields, gr2.recipient_groups, gr2.subscribable];
                vmessage.push(formatstring(vtemplate, vvalues));
            } else vmessage.push("Notification " + gr1.notification + " no accessible or does not exist");

	  		// Find the associated cmn_notif_message disabled
	  		
	  		
            var gr4 = new GlideRecord('cmn_notif_message');
            gr4.addQuery('notification',gr1.notification);
            gr4.addEncodedQuery('notification_filterISNOTEMPTY^ORconditionISNOTEMPTY^ORscheduleISNOTEMPTY^ORdevice.active=false');
            gr4.setLimit(100);
            gr4.orderByDesc("sys_created_on");
            vmessage.push("^^^^^^^**cmn_notif_message Query:** " + vurl + 'cmn_notif_message_list.do?sysparm_query=' + escape(gr4.getEncodedQuery()) + "\n\n");
	        gr4.query();
            if (gr4.hasNext()) {
            	vmessage.push("Notification messages to validate:\n| Created | Notification Message | User | Device | Email |  Filter | Conditions | Scheduled |\n| ------- |:--------------------:|:----:|:-----:|:-------|:-------:|:----------:|:---------:|")
            	for (;gr4.next();) {
                	var vtemplate = "| %1 | %2  | %3 | %4 | %5 | %6 | %7 | %8 |";
                	var vvalues = [gr4.sys_created_on.getDisplayValue(), gr4.notification.getDisplayValue(), gr4.user.getDisplayValue(), "["+ gr4.device.getDisplayValue() + (!gr4.device.active ? " (disabled)":"") +"]("+vurl + "cmn_notif_device.do?sys_id=" + gr4.device.sys_id + ")", gr4.device.email_address, gr4.notification_filter.getDisplayValue(), gr4.condition, gr4.schedule];
                	vmessage.push(formatstring(vtemplate, vvalues));
           		} 
            }
            vmessage.push('\n\n'); 

	  		// Find the associated events 
            var gr3 = new GlideRecord('sysevent');
            gr3.get(gr1.event);
            if (gr3.isValid()) {
                var vtemplate =   "-" + vid + "." + r + "- It was triggered by\n**Event '%1' state: %2 (Updated by %3 %4, Created by %5 %6)**\n-- %7\n\n\n\n```\nclaimed_by: %8 \nprocess_on: %9 \nprocessed: %10 \nduration: %11\n---- \ntable: %12 \ninstance: %13 \nuri: %14\nparm1: %15 \nparm2: %16 \nqueue: %17\n```\n\n\n";
                var vvalues = [gr3.name, gr3.state, gr3.sys_updated_by, gr3.sys_updated_on.getDisplayValue(),
                    gr3.sys_created_by, gr3.sys_created_on.getDisplayValue(), vurl + gr3.getTableName() + ".do?sys_id=" + gr3.sys_id,
                    gr3.claimed_by,gr3.process_on.getDisplayValue() , gr3.processed.getDisplayValue(), gr3.processing_duration, gr3.table, gr3.instance, gr3.uri, gr3.parm1, gr3.parm2, gr3.queue
                ];
                vmessage.push(formatstring(vtemplate, vvalues));
            } else vmessage.push("-" + vid + "." + r + "- Event " + gr1.event + " no accessible or does not exist**");

	  		// Find the associated syslog_email logs 
            var gr4 = new GlideRecord('syslog_email');
            gr4.addQuery('email', gr.sys_id);
       		gr4.addEncodedQuery(createEncodedDateRange(gr.sys_created_on, gr.sys_updated_on, 1));
        	gr4.setLimit(20);
        	gr4.orderByDesc("sys_created_on");
        	 vmessage.push("^^^^^^^**Emails Logs Query:** " + vurl + "syslog_email_list.do?sysparm_query=" + escape(gr4.getEncodedQuery()) + "\n\n");
    		for (gr4.query(),vmessage.push('\n**Logs:**\n\n| Created       | Level         | Message |\n| ------------- |:-------------:| :-------|');gr4.next();) {
                var vtemplate = "| %1 | %2| %3 |\n";
                var vvalues = [ gr4.sys_created_on.getDisplayValue(), gr4.level.getDisplayValue(), gr4.message];
                vmessage.push(formatstring(vtemplate, vvalues));
            } 
        	vmessage.push('\n\n'); 
 
        }
     }
	 return vmessage;
}  



// findNotificationFromRecord (vtable, vsysid)
// Retrieve all associated notification emails sent with vtable + vsysid record
//
// example of usage:
// gs.print(findNotificationFromRecord("incident","6638ac9adbe507002fd876231f9619c8").join("\n"));
function findNotificationFromRecord(vtable, vsysid) {
    var vmessage = [],
        f = gs.getProperty("glide.servlet.uri"),
        a = new GlideRecord(vtable);
        
    vmessage.push("#findNotificationFromRecord ('" + vtable + "','" + vsysid + "'); \n^^^^^^^RESULTS^^^^^^^\n");
    a.get(vsysid);
    if (a.isValid()) {
        vmessage.push("From record\n");
        var b = [a.getDisplayValue(), a.sys_updated_by, a.sys_updated_on.getDisplayValue(), a.sys_created_by, a.sys_created_on.getDisplayValue(), f + vtable + ".do?sys_id=" + a.sys_id, a.sys_class_name];
        vmessage.push(formatstring("**%7 %1 (Updated by %2 %3, Created by %4 %5)**\n-- %6\n\n",b));
        
        
        // Search for the related events 
        b = new GlideRecord("sysevent");
        b.addEncodedQuery(createEncodedDateRange(a.sys_created_on, a.sys_updated_on, 1));
        b.addEncodedQuery("name!=user.view^name!=text_index^name!=metric.update^name!=attachment.deleted^name!=attachment.read^name!=attachment.uploaded^name!=event.transfer^name!=glide.heartbeat^name!=email.read^ORname=NULL^name!=import.error^ORname=NULL");
        b.addQuery("instance", vsysid);
        b.addQuery("table", vtable);
        b.orderByDesc("sys_created_on");
        b.setLimit(100);
        vmessage.push("^^^^^^^**Events Query:** " + f + "sysevent_list.do?sysparm_query=" + escape(b.getEncodedQuery()) + "\n\n_Please export to XML and attach to the case as they get deleted_\n\n");
        b.query();
        if (b.hasNext()) {
			vmessage.push("|  o  | Event | State | Updated by | Updated | Created by | Created | Claimed by | Updated-Created(s) | Sys_id | Search email logs|\n|:---:|:-----:|:-----:|:----------:|:-------:|:----------:|:-------:|:----------:|:-------------------:|:------:|:----------------:|")
        	for ( q = 1; b.next(); q++) {
        	   var vtemplate = "| %1 | %2 | %3 | %4 | %5 | %6 | %7 | %8 | %9 | %10 | %11 |"
        	   var vvalues = [q,  b.name, b.state, b.sys_updated_by, b.sys_updated_on.getDisplayValue(),
                    b.sys_created_by, b.sys_created_on.getDisplayValue(b.sys_created_on,b.sys_updated_on), 
                    b.claimed_by.split(":").pop(),  getDurationofDates(b.sys_created_on,b.sys_updated_on), 
                    "[" + b.sys_id + "]("+ f + b.getTableName() + ".do?sys_id=" + b.sys_id +")", 
                    "[Found " + getcount("sys_email_log", "event="+b.sys_id+"^"+createEncodedDateRange(b.sys_created_on, b.sys_updated_on, 1)) + "]("+ f + "sys_email_log_list.do?sysparm_query=" + escape("event="+b.sys_id+"^"+createEncodedDateRange(b.sys_created_on, b.sys_updated_on, 1)) +")" ];
        	        vmessage.push(formatstring(vtemplate,vvalues));
			}
			vmessage.push('\n\n');
	 	}
	 		
      
 		// Search for the related emails       
        b = new GlideRecord("sys_email");
        // limit the search for 1 day before and after
        b.addEncodedQuery(createEncodedDateRange(a.sys_created_on, a.sys_updated_on, 1));
        b.addEncodedQuery("typeINsend-failed,send-ignored,send-ready,sent");
        b.addQuery("instance", vsysid);
        b.orderByDesc("sys_created_on");
        b.setLimit(100);
        vmessage.push("^^^^^^^**Emails Query:** " + f + "sys_email_list.do?sysparm_query=" + escape(b.getEncodedQuery()) + "\n\n");
        // Search duplicates
        vmessage.push(getDuplicates(vtable, "subject,recipients", b.getEncodedQuery()).join('\n'));

        for ( q = 1, b.query(); b.next(); q++) vmessage.push("-" + q + "-" + findNotificationfromEmail(b.sys_id, q).join("\n"))
    } else vmessage.push("Record not found");
    return vmessage
};

//
// var duplicates_found1 = getDuplicates("sys_email", "subject,recipients", "type=sent^sys_created_onONLast 7 days@javascript:gs.beginningOfLast7Days()@javascript:gs.endOfLast7Days()");
// gs.print("duplicates found: " + duplicates_found1.length + " \n" + duplicates_found1.join("\n"));
function getDuplicates(vtable, vfield, vencodedquery) {
    var vresults = [],
        b = new GlideAggregate(vtable),
        g = gs.getProperty("glide.servlet.uri");
    vfield = vfield.split(",");
    b.addEncodedQuery(vencodedquery);
    b.addAggregate("COUNT", vfield[0]);
    for (q = 0; q < vfield.length; q++) b.groupBy(vfield[q]);
    b.addHaving("COUNT", ">", 1);

    for (r=1,b.query(); b.next();r++) {
        var c = new GlideRecord(vtable);
        c.addEncodedQuery(vencodedquery);
        for (q = 0; q < vfield.length; q++) c.addQuery(vfield[q], b.getValue(vfield[q]));
       
        vresults.push("[" + b.getAggregate("COUNT", vfield[0]) + " duplicate found. Group " + r + "](" + g + vtable + "_list.do?sysparm_query=" + escape(c.getEncodedQuery()) + "&)")
    }
    return vresults
};

// Get the time in seconds 
// gs.print(getDurationofDates('2017-10-03 11:30:06','2017-10-03 11:30:25'));
function getDurationofDates(date1, date2) {
    var a1 = new GlideDateTime(date2);
    var b1 = new GlideDateTime(date1);
    return (date1 == date2 ) ? 0 : ((a1.getNumericValue() - b1.getNumericValue())/1000) ;
}

function getcount(vtable, vencodedquery) {
    try {
        var showcustomerupdateonly = new GlideAggregate(vtable);
        return showcustomerupdateonly.isValid() ? (vencodedquery && showcustomerupdateonly.addEncodedQuery(vencodedquery), showcustomerupdateonly.addAggregate("COUNT"), showcustomerupdateonly.query(), showcustomerupdateonly.next() ? c = showcustomerupdateonly.getAggregate("COUNT") : 0) : 0
    } catch (vmaxtablesize) {
        return 0
    }
};


function createEncodedDateRange(vdatestart,vdateend,datestoadd) {
		var start_date = new GlideDateTime(vdatestart);
		var end_date = new GlideDateTime(vdateend);

		if (datestoadd) {
			start_date.addDaysUTC(-datestoadd);
			end_date.addDaysUTC(datestoadd)			
		}		
		return 'sys_created_onBETWEEN'+ start_date.getValue() +'@'+ end_date.getValue();
}

// var myText = 'Hello %1. How are you %2?';
// var values = ['John','today'];
// gs.print(format(myText,values));
function formatstring(str, arr) {
  return str.replace(/%(\d+)/g, function(_,m) {
    return arr[--m];
  });
}