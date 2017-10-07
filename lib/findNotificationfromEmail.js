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

//gs.print(findNotificationfromEmail('5348ac9adbe507002fd876231f9619f7').join('\n'));
gs.print(findNotificationFromRecord("incident","6638ac9adbe507002fd876231f9619c8").join("\n"));

// gs.print(findNotificationfromEmail('c3a63a97dbc14bc0d975f1c41d9619b7').join('\n'));
function findNotificationfromEmail(vemailsysid, vid, vnotificationsysid) {
    var vmessage = [];
    var vurl = gs.getProperty("glide.servlet.uri");
    var gr = new GlideRecord('sys_email');
    var vid = vid || 1;
    vmessage.push("Email ('"+vemailsysid+"');\n^^^^^^^ RESULTS ^^^^^^^\n");
    
    // validating vnotificationsysid
    if (vnotificationsysid) {
	    var gno = new GlideRecord('sysevent_email_action');
    	gno.get(vnotificationsysid);
    	
        // If the emails are not sent, then this is useful
        if (gno.isValid()) {
	  		// Find the associated Notification 
           		var vtemplate = "-" + vid + "." + 0 + "- Reviewing \n**Notification '%1' on %2 %3 (Updated by %4 %5, Created by %6 %7 active: %8 weight: %9 sys_version:%10)**\n-- %11\n\n\n```\nCondition: %12\nSend to event creator: %13\nExclude Delegates: %14\nUsers: %15\nUsers/Groups in fields: %16\nGroups: %17\nSubscribable: %18\n```\n\n\n";
            	var vvalues = [gno.name, gno.collection, (gno.generation_type == "engine") ? ("insert/update: " + gno.action_insert + "/" + gno.action_update) : (gno.generation_type + ": " + gno.event_name) , gno.sys_updated_by, gno.sys_updated_on.getDisplayValue(), gno.sys_created_by, gno.sys_created_on.getDisplayValue(), gno.active, gno.weight, gno.sys_version, vurl + gno.getTableName() + ".do?sys_id=" + gno.sys_id, gno.condition, gno.send_self, gno.exclude_delegates, gno.recipient_users, gno.recipient_fields, gno.recipient_groups, gno.subscribable];
            	vmessage.push(formatstring(vtemplate, vvalues));
        	} else vmessage.push("Notification " + gr1.notification + " no accessible or does not exist"),(vnotificationsysid="");

	  	// Find the associated cmn_notif_message disabled
        var gr4 = new GlideRecord('cmn_notif_message');
        gr4.addQuery('notification',vnotificationsysid);
        gr4.addEncodedQuery('notification_filterISNOTEMPTY^ORconditionISNOTEMPTY^ORscheduleISNOTEMPTY^ORdevice.active=false^ORdevice.email_addressISEMPTY^ORdevice.email_addressNOT LIKE@');
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
    }
    gr.get(vemailsysid);
    if (gr.isValid()) {

		// Easily find the event+email logs 
        var gr1 = new GlideRecord('sys_email_log');
        gr1.addQuery('email', gr.sys_id);
		vnotificationsysid && gr1.addQuery('notification', vnotificationsysid);

        gr1.addEncodedQuery(createEncodedDateRange(gr.sys_created_on, gr.sys_updated_on, 1));
        gr1.setLimit(20);
        gr1.orderByDesc("sys_created_on");
        vmessage.push("^^^^^^^**Emails Logs  Query:** " + vurl + 'sys_email_log_list.do?sysparm_query=' + escape(gr1.getEncodedQuery()) + "\n\n");

		// If the email were sent, this would search them
		gr1.query(); gr1.hasNext() ? vmessage.push("Found " + gr1.getRowCount() + " emails") : vmessage.push("No email found");
        for ( r = 1; gr1.next(); r++ ) {
        
            var vtemplate =  "-" + vid + "- Reviewing\n**Email '%1' Content type: %12 type: %6 state: %7 (Updated by %2 %3, Created by %4 %5)**\n-- %8\n\n\n```\nMessage Id: %9\nrecipients: %10\nUser Name: %11 \nError: %13\n```\n\n";
            var vvalues = [gr.subject, gr.sys_updated_by, gr.sys_updated_on.getDisplayValue(), gr.sys_created_by, gr.sys_created_on.getDisplayValue(), gr.type, gr.state, vurl + "sys_email.do?sys_id=" + gr.sys_id, gr.message_id, gr.recipients, gr.user_id ? (gr.user_id.user_name.getDisplayValue() + "+" + gr.user_id.user_name +  "+"): "(empty)",gr.content_type, gr.error_string ];
            vmessage.push(formatstring(vtemplate, vvalues));
        
	  		// Find the associated Notification 
            var gr2 = new GlideRecord('sysevent_email_action');
            gr2.get(gr1.notification);
            if (gr2.isValid()) {
                var vtemplate = "-" + vid + "." + r + "- It was triggered by\n**Notification '%1' on %2 %3 (Updated by %4 %5, Created by %6 %7 active: %8 weight: %9 sys_version:%10)**\n-- %11\n\n\n```\nCondition: %12\nSend to event creator: %13\nExclude Delegates: %14\nUsers: %15\nUsers/Groups in fields: %16\nGroups: %17\nSubscribable: %18\n```\n\n\n";
                var vvalues = [gr2.name, gr2.collection, (gr2.generation_type == "engine") ? ("insert/update: " + gr2.action_insert + "/" + gr2.action_update) : (gr2.generation_type + ": " + gr2.event_name) , gr2.sys_updated_by, gr2.sys_updated_on.getDisplayValue(), gr2.sys_created_by, gr2.sys_created_on.getDisplayValue(), gr2.active, gr2.weight, gr2.sys_version, vurl + gr2.getTableName() + ".do?sys_id=" + gr2.sys_id, gr2.condition, gr2.send_self, gr2.exclude_delegates, gr2.recipient_users, gr2.recipient_fields, gr2.recipient_groups, gr2.subscribable];
                vmessage.push(formatstring(vtemplate, vvalues));
            } else vmessage.push("Notification " + gr1.notification + " no accessible or does not exist");

	  		// Find the associated cmn_notif_message disabled
            var gr4 = new GlideRecord('cmn_notif_message');
            gr4.addQuery('notification',gr1.notification);
            gr4.addEncodedQuery('notification_filterISNOTEMPTY^ORconditionISNOTEMPTY^ORscheduleISNOTEMPTY^ORdevice.active=false^ORdevice.email_addressISEMPTY^ORdevice.email_addressNOT LIKE@');
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
function findNotificationFromRecord(vtable, vsysid, vnotificationsysid) {
    var vmessage = [],
        f = gs.getProperty("glide.servlet.uri"),
        a = new GlideRecord(vtable);
        
    vmessage.push("#findNotificationFromRecord ('" + vtable + "','" + vsysid + "'); \n^^^^^^^RESULTS^^^^^^^\n");
    a.get(vsysid);
    if (a.isValid()) {
        vmessage.push("From record\n");
        var b = [a.getTableName(), a.sys_updated_by, a.sys_updated_on.getDisplayValue(), a.sys_created_by, a.sys_created_on.getDisplayValue(), f + vtable + ".do?sys_id=" + a.sys_id, a.sys_class_name];
        vmessage.push(formatstring("**%7 %1 (Updated by %2 %3, Created by %4 %5)**\n-- %6\n\n",b));
        
        
        // Search for the related events 
		var encodedaterange = [];
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
          	   encodedaterange.push(createEncodedDateRange(b.sys_created_on, b.sys_updated_on, 0)+"");
        	   var vtemplate = "| %1 | %2 | %3 | %4 | %5 | %6 | %7 | %8 | %9 | %10 | %11 |"
        	   var vvalues = [q,  b.name, b.state, b.sys_updated_by, b.sys_updated_on.getDisplayValue(),
                    b.sys_created_by, b.sys_created_on.getDisplayValue(b.sys_created_on,b.sys_updated_on), 
                    b.claimed_by.split(":").pop(),  getDurationofDates(b.sys_created_on,b.sys_updated_on), 
                    "[" + b.sys_id + "]("+ f + b.getTableName() + ".do?sys_id=" + b.sys_id +")", 
                    "[Found " + getcount("sys_email_log", "event="+b.sys_id+"^"+createEncodedDateRange(b.sys_created_on, b.sys_updated_on, 1)) + "]("+ f + "sys_email_log_list.do?sysparm_query=" + escape("event="+b.sys_id+"^"+createEncodedDateRange(b.sys_created_on, b.sys_updated_on, 1)) +")" ];
        	        vmessage.push(formatstring(vtemplate,vvalues));
			}
			vmessage.push('\n\n');
		 	vmessage.push(printLogs(encodedaterange.join('^OR')).join('\n'));
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

        for ( q = 1, b.query(); b.next(); q++) vmessage.push("-" + q + "-" + findNotificationfromEmail(b.sys_id, q, vnotificationsysid).join("\n"))
    } else vmessage.push("Record not found");
    return vmessage
};

//gs.print(printLogs("sys_created_onONLast 7 days@javascript:gs.beginningOfLast7Days()@javascript:gs.endOfLast7Days()").join('\n'));

function printLogs(vencodedquery) {
    var vmessage = [],
        vurl = gs.getProperty("glide.servlet.uri"),
        // Find the associated syslog 
        gr4 = new GlideRecord('syslog');

    if (vencodedquery) {
        gr4.addEncodedQuery(vencodedquery);
        gr4.addEncodedQuery('level!=0^ORsourceLIKEScript^ORmessageLIKEexception^ORmessageLIKEerror^source!=Cleanup^source!=TableCleaner^messageNOT LIKEBackground Script run by^messageNOT LIKENo subscription marked as auto sync, skipping');
        gr4.setLimit(100);
        gr4.orderByDesc("sys_created_on");
        vmessage.push("^^^^^^^**syslog Query:** " + vurl + 'syslog_list.do?sysparm_query=' + escape(gr4.getEncodedQuery()) + "\n\n");
        gr4.query();
        if (gr4.hasNext()) {
            vmessage.push("syslog messages to validate:\n| Created | Level | Message | Source |\n| ------- |:-----:|:-------:|:------:|")
            for (; gr4.next();) {
                var vtemplate = "| %1 | %2  | %3 | %4 |";
                var vvalues = [gr4.sys_created_on.getDisplayValue(), gr4.level.getDisplayValue(), gr4.message.replace(/\r?\n|\r/g, "").substring(0, 100), "[" + gr4.source + "](" + vurl + "syslog.do?sys_id=" + gr4.sys_id + ")"];
                vmessage.push(formatstring(vtemplate, vvalues));
            }
        }
        vmessage.push('\n\n');
    } else vmessage.push('no query')
    return vmessage;
}


// 
// var duplicates_found1 = getDuplicates("sys_email", "xxx,yyyy,subject,recipients", "type=sent^sys_created_onONLast 7 days@javascript:gs.beginningOfLast7Days()@javascript:gs.endOfLast7Days()");
// gs.print("duplicates found: " + duplicates_found1.length + " \n" + duplicates_found1.join("\n"));
// 
function getDuplicates(vtable, vfield, vencodedquery) {
    var vresult = [],
        vcount = new GlideAggregate(vtable),
        vurl = gs.getProperty("glide.servlet.uri");
    gr = new GlideRecord(vtable);

	// Validate the table
    if (gr.isValid()) {
        // Remove invalid fields
        vfield = vfield.split(",");
        vfield = vfield.filter(function(vfield) {
            return gr.isValidField(vfield)
        })
        
        if (0 < vfield.length) {
            // Validate the encodedquery
            vencodedquery && vcount.addEncodedQuery(vencodedquery);
            
            vcount.addAggregate("COUNT", vfield[0]);
            for (q = 0; q < vfield.length; q++) vcount.groupBy(vfield[q]);
            vcount.addHaving("COUNT", ">", 1);
            
            r = 1;
            for (vcount.query(); vcount.next(); r++) {
                var d = [];
               
                gr = new GlideRecord(vtable);
                gr.addEncodedQuery(vencodedquery);
                for (q = 0; q < vfield.length; q++) gr.addQuery(vfield[q], vcount.getValue(vfield[q]));
                for (gr.query(); gr.next();)  d.push(gr.sys_id + "");
               
                vresult.push("[" + vcount.getAggregate("COUNT", vfield[0]) + " duplicate found. Group " + r + "](" + vurl + vtable + "_list.do?sysparm_query=sys_idIN" + d.join(",") + "&)")
            }
        }
    }
    return vresult
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