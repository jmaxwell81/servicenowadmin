// findInboundActionTraces (vsysid) 
//  vsysid is the id of the email provided
//  Returns - String with the finding on the email 
//
// example of usage: 
// gs.print(findInboundActionTraces("0538641adb294b00c9e490b6db9619c1").join("\n"));
//
// findEmailActionTracesFromRecord
// REtrieve all 
// example of usage:
gs.print(findInboundActionTraces("0538641adb294b00c9e490b6db9619c1").join("\n"));
gs.print(findEmailActionTracesFromRecord("incident","6638ac9adbe507002fd876231f9619c8").join("\n"));

function findInboundActionTraces(vsysid,vid) {
  var a, vmessage = [], b = new GlideRecord("sys_email"), g = gs.getProperty("glide.servlet.uri"),
  vid= (vid || 1);
  vmessage.push("findInboundActionTraces ('"+vsysid+"'); \n^^^^^^^ RESULTS ^^^^^^^\n");
  b.get(vsysid);
  // Check email
  if (b.isValid()) {

     var vtemplate = "-" + vid + "- Reviewing\n**Email '%1' Content type: %12 type: %6 state: %7 (Updated by %2 %3, Created by %4 %5)**\n-- %8\n\n\n```\nMessage Id: %9\nrecipients: %10\nUser Name: %11 \nError: %13\n```\n\n\n";
     var vvalues = [b.subject, b.sys_updated_by, b.sys_updated_on.getDisplayValue(), b.sys_created_by, b.sys_created_on.getDisplayValue(), b.type, b.state, g + "sys_email.do?sys_id=" + b.sys_id, b.message_id, b.recipients, b.user_id ? (b.user_id.getDisplayValue() + "(" + b.user_id.user_name +  ")"): "(empty)",b.content_type, b.error_string ];
     vmessage.push(formatstring(vtemplate, vvalues));

    // Find events
    a = new GlideRecord("sysevent");
    a.addEncodedQuery(createEncodedDateRange(b.sys_created_on,b.sys_updated_on,1));
    a.addQuery("name", "email.read");
    a.addQuery("parm1", b.sys_id);
    a.setLimit(3);
    a.orderByDesc("sys_created_on");
    for (a.query(); a.next();) {
      var f = [a.getDisplayValue(), a.sys_updated_by, a.sys_updated_on.getDisplayValue(), a.sys_created_by, a.sys_created_on.getDisplayValue(), g + a.getTableName() + ".do?sys_id=" + a.sys_id, a.state.getDisplayValue()];
      vmessage.push(formatstring("-" + vid + "- **Event matched %1 state:%7 (Updated by %2 %3, Created by %4 %5)**\n-- %6\n\n", f));
    }
	// Find target table
    b.target_table && (a = new GlideRecord(b.target_table), a.get(b.instance), a.isValid() && (a = [a.getDisplayValue(), a.sys_updated_by, a.sys_updated_on.getDisplayValue(), a.sys_created_by, a.sys_created_on.getDisplayValue(), g + b.target_table + ".do?sys_id=" + a.sys_id, b.target_table], vmessage.push(formatstring("-" + vid + "- Email target %7\n**%1 (Updated by %2 %3, Created by %4 %5)**\n-- %6", a))), vmessage.push(validateaccess(b.target_table, b.instance, b.user_id.user_name) + "\n\n\n"));

	// Find Email logs 
    a = new GlideRecord("syslog_email");
    a.addQuery("email", b.sys_id);
    a.addEncodedQuery(createEncodedDateRange(b.sys_created_on,b.sys_updated_on,1));
    a.addEncodedQuery("messageLIKEdid not create or update^ORmessageSTARTSWITHProcessed '");
    a.setLimit(100);
    a.orderByDesc("sys_created_on");
    vmessage.push("**Email log query:** "+ g + 'syslog_email_list.do?sysparm_query=' + escape(a.getEncodedQuery()) + "\n\n");
    for ( q = 1, a.query(); a.next(); q++) {
      vmessage.push("-" + vid + "." + q + "- Reviewing email log: " + a.message);
      f = findInboundActionFromLogLine(a.message + "");

	  // Find inbound actions 
      var d = new GlideRecord("sysevent_in_email_action");
      d.setLimit(20);
      d.addQuery("name", f.inbound);
      d.orderByDesc("sys_created_on");
      for (r=1,d.query(); d.next();r++) {
        if (vmessage.push(formatstring("-" + vid + "." + q + "." + r + "- Inbound action triggered\n**%1 - on table %2 type: %3, action: %4 - stop_processing: %5 - order: %6**\n-- %7\n", [d.name, d.table, d.type, d.action, d.stop_processing, d.order, g + "sysevent_in_email_action.do?sys_id=" + d.sys_id])), f.number) {
		  // Find task created if the number is found
          var e = new GlideRecord("task");
          e.get("number", f.number);
          e.isValid() ? (e = [e.getDisplayValue(), e.sys_updated_by, e.sys_updated_on.getDisplayValue(), e.sys_created_by, e.sys_created_on.getDisplayValue(), g + b.target_table + ".do?sys_id=" + e.sys_id, e.sys_class_name], 
            vmessage.push(formatstring("-" + q + "." + r + "- **%7 %1 (Updated by %2 %3, Created by %4 %5)**\n-- %6\n\n", e))) : vmessage.push("It created " + f.number + " but it was not found or accesible\n\n");
        }
      }
    }
  }
  return vmessage;
}
;

// findEmailActionTracesFromRecord (vtable, vsysid)
// Retrieve all associated inbound emails actions with vtable + vsysid record
//
// example of usage:
// gs.print(findEmailActionTracesFromRecord("incident","6638ac9adbe507002fd876231f9619c8").join("\n"));
function findEmailActionTracesFromRecord(vtable, vsysid) {
    var vmessage = [],
        f = gs.getProperty("glide.servlet.uri"),
        a = new GlideRecord(vtable);
        
    vmessage.push("findEmailActionTracesFromRecord ('" + vtable + "','" + vsysid + "'); \n^^^^^^^ RESULTS ^^^^^^^\n");
    a.get(vsysid);
    if (a.isValid()) {
        vmessage.push("From record\n");
        var b = [a.getDisplayValue(), a.sys_updated_by, a.sys_updated_on.getDisplayValue(), a.sys_created_by, a.sys_created_on.getDisplayValue(), f + vtable + ".do?sys_id=" + a.sys_id, a.sys_class_name];
        vmessage.push(formatstring("**%7 %1 (Updated by %2 %3, Created by %4 %5)**\n-- %6\n\n",
            b));
        b = new GlideRecord("sys_email");
        // limit the search for 1 day before and after
        b.addEncodedQuery(createEncodedDateRange(a.sys_created_on, a.sys_updated_on, 1));
        b.addEncodedQuery("typeINreceived,received-ignored");
        b.addQuery("instance", vsysid);
        b.orderByDesc("sys_created_on");
        b.setLimit(100);
        vmessage.push("**Emails Query:** " + f + "sys_email_list.do?sysparm_query=" + escape(b.getEncodedQuery()) + "\n\n");
        q = 1;
        for (b.query(); b.next(); q++) vmessage.push("**" + q + "** " + findInboundActionTraces(b.sys_id, q).join("\n"))
    } else vmessage.push("Record not found");
    return vmessage
};

// gs.print("test 1\n" + findInboundActionFromLogLine("Processed 'Create Incident', created incident :INC0010015").inbound);
// gs.print("test 2\n" + findInboundActionFromLogLine("Skipping 'inbound test', did not create or update incident").inbound);
function findInboundActionFromLogLine(vstring) {
  var b, c;
  if (vstring = /'(.+)'(.+:(.+)|,)/ig(vstring)) {
    1 < vstring.length && (c = vstring[3]), 0 < vstring.length && (b = vstring[1]);
  }
  return {inbound:b, number:c};
}

// var myText = 'Hello %1. How are you %2?';
// var values = ['John','today'];
// gs.print(format(myText,values));
function formatstring(str, arr) {
  return str.replace(/%(\d+)/g, function(_,m) {
    return arr[--m];
  });
}


// gs.print("*******Result: "+ validateaccess("sys_email", "46c0ae9cdb1a3600632ef1041d961901", "support@xxx.com"));
// gs.print("*******Result: "+ validateaccess("sys_email", "f75f55a4db927600632ef1041d96195a", "vendor.support@xxx.com"));
//
// validateaccess (table, sys_id, user_id)
function validateaccess(vtable, vsysid, vuserid) {
    var e = new GlideRecord("sys_user");
    if (e.get("user_name", vuserid)) {
        e = gs.getSession()
            .impersonate(e.sys_id);
        var d = new GlideRecordSecure(vtable);
        
        vtable = d.get(vsysid) ? "User " + vuserid + " has access to record on table " + vtable +  " (" + d.getDisplayValue() + " - sys_id= " + vsysid + ")" + " - canWrite: " + d.canWrite() +  " - canRead: " +d.canRead() + " - canCreate: " +d.canCreate() + " - canDelete: " +d.canDelete(): 
                    "User " + vuserid + " has NO access to record on table " + vtable +  " (sys_id= " + vsysid + ")" ;
         gs.getSession()
            .impersonate(e)
    } else vtable = "User Not Found on sys_user table " + vuserid;
    return vtable
};


// var vmessage = [];
// var gr = new GlideRecord ('incident');
// gr.get('6638ac9adbe507002fd876231f9619c8');
// 
// vmessage.push('Encoded query: ' + createEncodedDateRange(gr.sys_created_on,gr.sys_updated_on,1) );
// 
// gs.print('ANSWER: '+vmessage.join('\n'));
function createEncodedDateRange(vdatestart,vdateend,datestoadd) {
		var start_date = new GlideDateTime(vdatestart);
		var end_date = new GlideDateTime(vdateend);

		if (datestoadd) {
			start_date.addDaysUTC(-datestoadd);
			end_date.addDaysUTC(datestoadd)			
		}		
		return 'sys_created_onBETWEEN'+ start_date.getValue() +'@'+ end_date.getValue();
}
