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

gs.getSession().setStrictQuery(true);

gs.print('RESULT: \n' + findNotificationfromEmail('5348ac9adbe507002fd876231f9619f7').join('\n'));
gs.print('RESULT: \n' + findNotificationFromRecord("incident", "6638ac9adbe507002fd876231f9619c8").join("\n"));


// gs.print(findNotificationfromEmail('c3a63a97dbc14bc0d975f1c41d9619b7').join('\n'));
function findNotificationfromEmail(vemailsysid, vid, vnotificationsysid) {
    var vmessage = [];
    var vurl = gs.getProperty("glide.servlet.uri");
    var gr = new GlideRecord('sys_email');
    var vid = vid || 1;
    vmessage.push("Email ('" + vemailsysid + "');\n^^^^^^^ RESULTS ^^^^^^^\n");

    // validating vnotificationsysid
    if (vnotificationsysid) {
        var gno = new GlideRecord('sysevent_email_action');

        try {
            gno.get(vnotificationsysid);

            // If the emails are not sent, then this is useful
            if (gno.isValid()) {
                // Find the associated Notification 
                vmessage.push("-" + vid + ". " + printRecordInfo(gno.getTableName(), gno.getEncodedQuery()).join('\n'));
            } else vmessage.push("Error: findNotificationfromEmail Notification " + gr1.notification + " no accessible or does not exist");

            // Find the associated cmn_notif_message disabled
            // TODO
            
        } catch (e) {
            vmessage.push('error:' + e);
        }
        try {
            var gr4 = new GlideRecord('cmn_notif_message');
            gr4.addQuery('notification', vnotificationsysid);
            gr4.addEncodedQuery('notification_filterISNOTEMPTY^ORconditionISNOTEMPTY^ORscheduleISNOTEMPTY^ORdevice.active=false^ORdevice.email_addressISEMPTY^ORdevice.email_addressNOT LIKE@');
            gr4.setLimit(100);
            gr4.orderByDesc("sys_created_on");
            
            // vmessage.push("^^^^^^^**cmn_notif_message Query:** " + vurl + 'cmn_notif_message_list.do?sysparm_query=' + escape(gr4.getEncodedQuery()) + "\n\n");

            vmessage.push("-" + vid + ". Notification messages to validate:\n" + printRecordTable(gr4.getTableName(), gr4.getEncodedQuery()).join('\n'));
            
        } catch (e) {
            vmessage.push('error:' + e);
        }
    }

    try {
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
            gr1.query();
            gr1.hasNext() ? vmessage.push("Found " + gr1.getRowCount() + " emails") : vmessage.push("No email found");
            for (r = 1; gr1.next(); r++) {

				// Email
				vmessage.push("-" + vid + "." + r + "-  " + printRecordTable(gr1.getTableName(), "sys_id=" + gr1.sys_id).join('\n'));
	
                // Find the associated syslog_email logs 
                var gr4 = new GlideRecord('syslog_email');
                gr4.addQuery('email', gr.sys_id);
                gr4.addEncodedQuery(createEncodedDateRange(gr.sys_created_on, gr.sys_updated_on, 1));
                gr4.setLimit(20);
                gr4.orderByDesc("sys_created_on");
				
				vmessage.push("-" + vid + "." + r + "-  " + printRecordTable(gr4.getTableName(), gr4.getEncodedQuery(),"sys_created_on,level,message,url").join('\n'));
                

                // Find the associated Notification 
                var gr2 = new GlideRecord('sysevent_email_action');
                gr2.get(gr1.notification);
                if (gr2.isValid()) {
					vmessage.push("-" + vid + "." + r + "-  " + printRecordInfo(gr2.getTableName(), "sys_id=" + gr2.sys_id).join('\n'));
                } else vmessage.push("Notification " + gr1.notification + " no accessible or does not exist");

                // Find the associated cmn_notif_message disabled
                var gr4 = new GlideRecord('cmn_notif_message');
                gr4.addQuery('notification', gr1.notification);
                gr4.addEncodedQuery('notification_filterISNOTEMPTY^ORconditionISNOTEMPTY^ORscheduleISNOTEMPTY^ORdevice.active=false^ORdevice.email_addressISEMPTY^ORdevice.email_addressNOT LIKE@');
                gr4.setLimit(100);
                gr4.orderByDesc("sys_created_on");

				vmessage.push("-" + vid + "." + r + "- " + printRecordTable(gr4.getTableName(), gr4.getEncodedQuery()).join('\n'));

//                vmessage.push("^^^^^^^**cmn_notif_message Query:** " + vurl + 'cmn_notif_message_list.do?sysparm_query=' + escape(gr4.getEncodedQuery()) + "\n\n");

                // Find the associated events 
                var gr3 = new GlideRecord('sysevent');
                gr3.get(gr1.event);
                if (gr3.isValid()) {
                	vmessage.push("-" + vid + "." + r + "- " + printRecordInfo(gr3.getTableName(), gr3.getEncodedQuery()).join('\n'));
                } else vmessage.push("-" + vid + "." + r + "- Event " + gr1.event + " no accessible or does not exist**");

            }
        }
    } catch (e) {
        vmessage.push('error:' + e);
    }
    return vmessage;
}



// findNotificationFromRecord (vtable, vsysid)
// Retrieve all associated notification emails sent with vtable + vsysid record
//
// example of usage:
// gs.print(findNotificationFromRecord("incident","6638ac9adbe507002fd876231f9619c8").join("\n"));
//to add the incident_templateinfo()
function findNotificationFromRecord(vtable, vsysid, vnotificationsysid,timetosearch) {
    var vmessage = [],
        f = gs.getProperty("glide.servlet.uri"),
        a = new GlideRecord(vtable);

    vmessage.push("Record ('" + vtable + "','" + vsysid + "','" + vnotificationsysid + "'); \n^^^^^^^RESULTS^^^^^^^\n");

    try {
        a.get(vsysid);
    } catch (e) {
        vmessage.push('error:' + e);
    }
    if (a.isValid()) {
		// Print record - incident as example
		vmessage.push(printRecordInfo(vtable, a.getEncodedQuery()).join("\n"));

        // Search for the related events 
        var encodedaterange = [];
        b = new GlideRecord("sysevent");
        timetosearch ? b.addEncodedQuery(createEncodedDateRange(timetosearch, timetosearch, 1)) : b.addEncodedQuery(createEncodedDateRange(a.sys_created_on, a.sys_updated_on, 1));
        b.addEncodedQuery("name!=user.view^name!=text_index^name!=metric.update^name!=attachment.deleted^name!=attachment.read^name!=attachment.uploaded^name!=event.transfer^name!=glide.heartbeat^name!=email.read^ORname=NULL^name!=import.error^ORname=NULL");
        b.addQuery("instance", vsysid);
        b.addQuery("table", vtable);
        b.orderByDesc("sys_created_on");
        b.setLimit(100);
        // vmessage.push("^^^^^^^**Events Query:** " + f + "sysevent_list.do?sysparm_query=" + escape(b.getEncodedQuery()) + "\n\n_Please export to XML and attach to the case as they get deleted_\n\n");
        // Retrieve the events 
        vmessage.push(printRecordTable('sysevent', b.getEncodedQuery()).join("\n"));
        try {
            // with the events, we can search for the system logs 
            b.query();
            if (b.hasNext()) {
                for (q = 1; b.next(); q++) {
                    encodedaterange.push(createEncodedDateRange(b.sys_created_on, b.sys_updated_on, 0) + "");
                }
                vmessage.push(printRecordTable('syslog', encodedaterange.join('^OR')).join('\n'));
            } else {
                // otherwise it looks when it got created or updated exactly
                if (timetosearch) {  
		            vmessage.push(printRecordTable('syslog',createEncodedDateRange (timetosearch,timetosearch,0)).join('\n'));
	    	        vmessage.push(printRecordTable('syslog',createEncodedDateRange (b.sys_created_on,b.sys_updated_on,1)).join('\n'));
	    	    } else {
	                encodedaterange.push(createEncodedDateRange(a.sys_created_on, a.sys_created_on, 0) + "");
    	            encodedaterange.push(createEncodedDateRange(a.sys_updated_on, a.sys_updated_on, 0) + "");
        	        vmessage.push(printRecordTable('syslog', encodedaterange.join('^OR')).join('\n'));
        	    }
            }
        } catch (e) {
            vmessage.push('error:' + e);
        }

        // Search for the related emails       
        b = new GlideRecord("sys_email");
        // limit the search for 1 day before and after
        timetosearch ? b.addEncodedQuery(createEncodedDateRange(timetosearch, timetosearch, 1)) : b.addEncodedQuery(createEncodedDateRange(a.sys_created_on, a.sys_updated_on, 1));
        b.addEncodedQuery("typeINsend-failed,send-ignored,send-ready,sent");
        b.addQuery("instance", vsysid);
        b.orderByDesc("sys_created_on");
        b.setLimit(100);
        vmessage.push("^^^^^^^**Emails Query:** " + f + "sys_email_list.do?sysparm_query=" + escape(b.getEncodedQuery()) + "\n\n");
        // Search duplicates
        vmessage.push(getDuplicates(vtable, "subject,recipients", b.getEncodedQuery()).join('\n'));
        try {
            for (q = 1, b.query(); b.next(); q++) vmessage.push("-" + q + "-" + findNotificationfromEmail(b.sys_id, q, vnotificationsysid).join("\n"))
        } catch (e) {
            vmessage.push('error:' + e);
        }

    } else vmessage.push("Record not found");
    return vmessage
};

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
            try {
                for (vcount.query(); vcount.next(); r++) {
                    var d = [];

                    gr = new GlideRecord(vtable);
                    gr.addEncodedQuery(vencodedquery);
                    for (q = 0; q < vfield.length; q++) gr.addQuery(vfield[q], vcount.getValue(vfield[q]));
                    for (gr.query(); gr.next();) d.push(gr.sys_id + "");

                    vresult.push("[" + vcount.getAggregate("COUNT", vfield[0]) + " duplicate found. Group " + r + "](" + vurl + vtable + "_list.do?sysparm_query=sys_idIN" + d.join(",") + "&)")
                }
            } catch (e) {
                vresult.push('error:' + e);
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
    return (date1 == date2) ? 0 : ((a1.getNumericValue() - b1.getNumericValue()) / 1000);
}

function getcount(vtable, vencodedquery) {
    try {
        var showcustomerupdateonly = new GlideAggregate(vtable);
        return showcustomerupdateonly.isValid() ? (vencodedquery && showcustomerupdateonly.addEncodedQuery(vencodedquery), showcustomerupdateonly.addAggregate("COUNT"), showcustomerupdateonly.query(), showcustomerupdateonly.next() ? c = showcustomerupdateonly.getAggregate("COUNT") : 0) : 0
    } catch (vmaxtablesize) {
        return 0
    }
};


function createEncodedDateRange(vdatestart, vdateend, datestoadd) {
    var start_date = new GlideDateTime(vdatestart);
    var end_date = new GlideDateTime(vdateend);

    if (datestoadd) {
        start_date.addDaysUTC(-datestoadd);
        end_date.addDaysUTC(datestoadd)
    }
    return 'sys_created_onBETWEEN' + start_date.getValue() + '@' + end_date.getValue();
}

// var myText = 'Hello %1. How are you %2?';
// var values = ['John','today'];
// gs.print(format(myText,values));
function formatstring(str, arr) {
    return str.replace(/%(\d+)/g, function(_, m) {
        return arr[--m];
    });
}

// === PRINT logs
function printRecordTable(vtable, vencodedquery, vcolumns, addextra) {
    addextra ? addextra = parseBool(addextra) : addextra = true;
    vcolumns = vcolumns || "";
    try {
        if (!vcolumns) {
            switch (vtable) {
                case "incident":
                    vcolumns = 'caller_id,assignment_group,assigned_to,watch_list,state,short_description';
                    break;
                case "sysapproval_approver":
                    vcolumns = 'sysapproval,document_id,approver,source_table,state';
                    break;
                case "sc_req_item":
                    vcolumns = 'number,cat_item,request,opened_by,stage,assignment_group,assigned_to,watch_list,state,approval';
                    break;
                case "change_request":
                    vcolumns = 'number,assignment_group,assigned_to,watch_list,state,category,short_description';
                    break;
                case "sc_request":
                    vcolumns = 'number,requested_for,opened_by,description,assignment_group,assigned_to,watch_list,state';
                    break;
                case "sysevent":
                    vcolumns = 'name,state,duration,claimed_by,table,instance,user_id,parm1,parm2';
                    break;
                case "sys_email":
                    vcolumns = 'content_type,state,subject,message_id,recipient,state,error_string,user_id,duration,target_table';
                    break;
                case "sysevent_in_email_action":
                    vcolumns = 'name,table,condition_script,type,action,stop_processing,template,filter_condition,from,required_roles';
                    break;
                case "syslog":
                    addextra = false;
                    vencodedquery+= "^level!=0^ORsourceLIKEScript^ORmessageLIKEexception^ORmessageLIKEerror^source!=Cleanup^source!=TableCleaner^messageNOT LIKEBackground Script run by^messageNOT LIKENo subscription marked as auto sync, skipping"
                    vcolumns = 'sys_created_on,sys_created_by,level,message,source';
                    break;
                case "sys_data_source":
                    vcolumns = 'import_set_table_name,type,format,file_retrieval_method,connection_url';
                    break;
                case "sys_transform_map":
                    vcolumns = 'name,active,source_table,target_table,run_business_rules,order,copy_empty_fields,enforce_mandatory_fields,run_script'
                    break;
                case "sys_import_set":
                    vcolumns = 'number,state,data_source,load_completed,load_run_time,mode,schedule_import,short_description,table_name';
                    break;
                case "sys_import_set_run":
                    vcolumns = 'state,completed,total,updates,ignored,inserts,errors';
                    break;
                case "sys_import_set_row":
                    vcolumns = 'import_set_run,sys_import_row,sys_import_set,sys_import_state,sys_import_state_comment,sys_target_table,sys_target_sys_id,sys_transform_map';
                    break;
                case "cmn_notif_message":
                    addextra = false;
                    vcolumns = "sys_created_on,notification,user,deviceurl,device_email_address,notification_filter,condition,schedule,url";
                    break;
                case "sysevent_email_action":
                    vcolumns = "send_self,recipient_fields,recipient_groups,recipient_users,collection,generation_type,event_name";
                    break;                    
                default:
                    vcolumns = 'assignment_group,assigned_to,watch_list,state'
            }
            addextra && (vcolumns = "displayname,sys_updated_on,sys_updated_by,sys_created_on,sys_created_by," + vcolumns + ",url");
        }
        return printRecord(vtable, vencodedquery, "", vcolumns, printRecordtemplate)
    } catch (e) {
        return ["Error: printRecordTable " + e];
    }
}





// gs.print("RESULT:\n" + printRecordInfo('incident', 'number=INC34952450').join("\n"));
// gs.print("RESULT:\n" + printRecordInfo('sysapproval_approver', 'sys_id=92218c4adb214b00c9e490b6db9619e7').join("\n"));
// gs.print("RESULT:\n" + printRecordInfo('sc_req_item', 'sys_id=a6dceaf0dbad8700c9e490b6db96197c').join("\n"));
// 
// gs.print("RESULT:\n" + printRecordInfo('change_request', 'sys_id=c286d61347c12200e0ef563dbb9a71df').join("\n"));
// gs.print("RESULT:\n" + printRecordInfo('sc_request', 'sys_id=56218c4adb214b00c9e490b6db9619fc').join("\n"));
// 
// gs.print("RESULT:\n" + printRecordInfo('sysevent', 'sys_id=94982385db354b002fd876231f961989').join("\n"));
// gs.print("RESULT:\n" + printRecordInfo('sys_email', 'sys_id=0538641adb294b00c9e490b6db9619c1').join("\n"));

function printRecordInfo(vtable, vencodedquery, vtemplate, addextra) {
    addextra ? addextra = parseBool(addextra) : addextra = true;

    vtable = vtable.trim();
    try {
        if (!vtemplate) switch (vtable) {
            case "incident":
                vtemplate = '```,\nNumber:,number,\nCaller:,caller_id,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state,\nIncident State:,incident_state,\nShort Description:,short_description,\n```';
                break;
            case "sysapproval_approver":
                vtemplate = '```\nSys approval:,sysapproval,\nApproving:,document_id,\nApprover:,approver,\nSource table:,source_table,\nState:,state,\n```';
                break;
            case "sc_req_item":
                vtemplate = '```,\nNumber:,number,\nItem:,cat_item,\nRequest:,request,\nOpened by:,opened_by,\nStage:,stage,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state,\nApproval:,approval,\n,variables,\n```';
                break;
            case "change_request":
                vtemplate = '```,\nNumber:,number,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state,\nCategory:,category,\nShort Description:,short_description,\n```';
                break;
            case "sc_request":
                vtemplate = '```,\nNumber:,number,\nRequest for:,requested_for,\nOpened by:,opened_by,\nDescription:,description,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state,\n,variables,\n```';
                break;
            case "sysevent":
                vtemplate = '```,\nName:,name,\nState:,state,\nDuration:,duration,seconds\nClaimed:,claimed_by,\nTable:,table,\nInstance:,instance,\nUser Id:,user_id,\nParm1:,parm1,\nParm2:,parm2,\n```';
                break;
            case "sys_email":
                vtemplate = '```,\nContent type:,content_type,\nType:,type,\nState:,state,\nSubject:,subject,\nMessage Id:,message_id,\nRecipients:,recipient,\nState:,state,\nError:,error_string,\nUser_Id:,user_id,\nDuration:,duration,seconds,\nTarget:,target_table,\nBody_text:,body_text,\n```';
                break;
            case "sysevent_in_email_action":
                vtemplate = '```,\nName:,name,\nTable:,table,\nCondition Script:,condition_script,\nType:,type,\nAction:,action,\nStop processing:,stop_processing,\nTemplate:,template,\nCondition:,filter_condition,\nFrom:,from,\nRequired roles:,required_roles,\n```';
                break;
            case "sys_data_source":
                vtemplate = '```,\nImport table:,import_set_table_name,\nType:,type,\nFormat:,format,\nRetrieval Method:,file_retrieval_method,\nConnection Url:,connection_url,\n```';
                break;
            case "sys_transform_map":
                vtemplate = '```,\nName:,name,\nActive:,active,\nSource:,source_table,\nTarget:,target_table,\nRun Business Rules:,run_business_rules,\nOrder:,order,\nCopy empty:,copy_empty_fields,\nMandatory Fields:,enforce_mandatory_fields,\nRun Scripts:,run_script,\n```'
                break;
            case "sys_import_set":
                vtemplate = '```,\nNumber:,number,\nState:,state,\nData Source:,data_source,\nLoad completed:,load_completed,\nLoad Run Time:,load_run_time,\nMode:,mode,\nSchedule Import:,schedule_import,\nShort Description:,short_description,\nTable Name:,table_name,\n```';
                break;
            case "sys_import_set_run":
                vtemplate = '```,\nState:,state,\nCompleted:,completed,\nTotal:,total,\nUpdates:,updates,\nIgnored:,ignored,\nInserts:,inserts,\nErrors:,errors,\n```';
                break;
            case "sys_import_set_row":
                vtemplate = '```,\nImport Set Run:,import_set_run,\nRow:,sys_import_row,\nImport Set:,sys_import_set,\nImport State:,sys_import_state,\nImport State Comment:,sys_import_state_comment,\nTarget Table:,sys_target_table,\nTarget Sys_Id:,sys_target_sys_id,\nTransform map:,sys_transform_map,\n```';
                break;
            case "syslog":
                vtemplate = '```,\nLevel:,level,\nMessage:,message,\nSource:,source,\n```';
                break;
            case "cmn_notif_message":
                vtemplate = "```,\nNotification:,notification,\nUser:,user,\nDevice:,deviceurl,\nDevice Email:,device_email_address,\nNotification:,notification_filter,\nCondition:,condition,\nSchedule:,schedule,\n```";
                break;
            case "sysevent_email_action":
                vtemplate = "```\nName:,name,\nCondition:,condition,\nAdvanced conditi:n,advanced_condition,\nSend Event Creator:,send_self,\nRecipient fields:,recipient_fields,\nRecipient groups:,recipient_groups,\nRecipient users:,recipient_users,\nCollection:,collection,\nGeneration type:,generation_type,\nEvent name:,event_name,\nSys version:,sys_version,\nContent type:,content_type,\nEvent name:,event_name,\nExclude delegate:,exclude_delegates,\nForce delivery:,force_delivery,\nFrom:,from,\nInclude attachme:ts,include_attachments,\nPush message onl:,push_message_only,\nSubscribable:,subscribable,\nWeight:,weight,\nSubject:,subject,\n```";
                break;
            default:
                vtemplate = '```\n,\n```'
        }
        if (addextra) 
            return printRecord(vtable, vencodedquery, "**Reviewing,table,displayname,(Updated,sys_updated_on,by,sys_updated_by,Created,sys_created_on,by,sys_created_by,)**,urlinfo,\n\n" + vtemplate + "\n", "", printRecordtemplate)
        else
        	return printRecord(vtable, vencodedquery, vtemplate, "", printRecordtemplate)
    } catch (e) {
        return ["Error: printRecordInfo " + e];
    }

};

function printRecordtemplate(vname, vgliderecord) {
    var vresult = "";
    try {
        if (vname && vgliderecord && vgliderecord.isValid()) switch (vname) {
            case "action_insert":
            case "action_update":
            case "event_parm_1":
            case "event_parm_2":        
            case "run_business_rules":
            case "active":
            case "copy_empty_fields":
            case "enforce_mandatory_fields":
            case "subscribable":
            case "send_self":
                vresult = parseBool(vname);
                break;
            case "sys_updated_on":
            case "sys_created_on":
            case "level":
            case "impact":
            case "urgency":
            case "priority":
            case "sys_domain":
            case "state":
                vgliderecord.isValidField(vname) ? vresult = vgliderecord.getDisplayValue(vname) : vresult = "[1]-" + vname;
                break;
            case "approver":
            case "assigned_to":
            case "assignment_group":
            case "caller_id":
            case "delivery_plan":
            case "document_id":
            case "group":
            case "incident_state":
            case "opened_by":
            case "request":
            case "requested_by":
            case "requested_for":
            case "resolved_by":
            case "sysapproval":
            case "type":
            case "wf_activity":
            case "watch_list":
            case "user_id":
                if (vgliderecord.isValidField(vname)) {
                    var dvalue = vgliderecord.getDisplayValue(vname);
                    var vvalue = vgliderecord.getValue(vname);
                    dvalue && (vresult = dvalue);
                    (dvalue != vvalue) && vvalue && (vresult += " (id: " + vvalue + ")");
                } else
                    vresult = vname;
                break;
            case "target_table":
                vgliderecord.isValidField(vname) && (vresult = vgliderecord.getValue(vname));
                vgliderecord.isValidField('instance') && (vresult += ":" + vgliderecord.getValue('instance'));
                //             vresult = "[" + vresult + "](" + gs.getProperty("glide.servlet.uri") + vgliderecord.getValue(vname) + ".do?sys_id=" + vgliderecord.getValue('instance') + "&)";
                break;
            case "deviceurl":
                 if (vgliderecord.isValidField("device")) {
                     var c = vgliderecord.getValue("device"),
                         d = vgliderecord.getDisplayValue("device"),
                         b = new GlideRecord("cmn_notif_device");
                     b.get(c);
                     d && (vresult = d);
                     c && b.isValid() && (vresult = vresult + " [" + parseBool(b.getValue("active")) +  "](" + gs.getProperty("glide.servlet.uri") + "cmn_notif_device.do?sys_id=" + c + "&)")
                 } else vresult = vname;
            	 break;
            case "device_email_address":
 	           	 if (vgliderecord.isValidField("device")) {
 	           	      var vvalue = vgliderecord.getValue("device");
 	           	      var gr = new GlideRecord('cmn_notif_device');
                      gr.get(vvalue);
 	           	      gr.isValid() && (vresult = gr.getValue("email_address"));
 	           	 } 	           	 else vresult = vname;
            	 break;
            case "content_type":
                vresult = vgliderecord.getValue(vname).split(";")[0];
                break;
            case "claimed_by":
                vresult = vgliderecord.getValue(vname).split(":").pop();
                break;
            case "url":
                vgliderecord.isValidField("sys_id") ? (vresult = gs.getProperty("glide.servlet.uri"), vresult = "[" + vgliderecord.getValue("sys_id") + "](" + vresult + printRecordtemplate("table", vgliderecord) + ".do?sys_id=" + vgliderecord.getValue("sys_id") + ")") : vresult = "[3]-" + vname;
                break;
            case "displayname":
                var vdisplay = vgliderecord.getDisplayValue();
                vdisplay ? vresult = vdisplay : (vgliderecord.isValidField("name") ? vresult = vgliderecord.getField("name") : vresult = vgliderecord.getField("sys_id"))
                break;
            case "urlinfo":
                vresult = "\n-- " + gs.getProperty("glide.servlet.uri") + printRecordtemplate("table", vgliderecord) + ".do?sys_id=" + vgliderecord.getValue("sys_id") + "&";
                break;
            case "table":
                // Search if it is a child / parent table
                vresult = vgliderecord.getRecordClassName();
                // If no classname, then the table name
                !vresult && (vresult = vgliderecord.getTableName());
                break;
            case "duration":
                vresult = getDurationofDates(vgliderecord.getValue("sys_created_on"), vgliderecord.getValue("sys_updated_on"));
                break;
            case "variables":
                var c = [],
                    d = vgliderecord.variables,
                    a;
                for (key in d) a = vgliderecord.variables[key], "" != a.getGlideObject().getQuestion().getLabel() && c.push("\nVariable name: " + key + " (" + a.getGlideObject().getQuestion().getLabel() + ") = '" + a.getDisplayValue() + "'")
                vresult = c.join(" ");
                break;
            case "message":
                vresult = vgliderecord.isValidField(vname) ? (vgliderecord.getValue(vname) + "").replace(/\r?\n\||\r/g, " ").substring(0, 100) : "[2]-" + vname;
                break;
            case "(":
                vresult = " ("
                break;
            case ")":
                vresult = ")"
                break;
            default:
                if (vgliderecord.isValidField(vname)) {
                    var dvalue = vgliderecord.getDisplayValue(vname);
                    var vvalue = vgliderecord.getValue(vname);
                    dvalue && (vresult = dvalue);
                    (dvalue +"" != vvalue +"") && vvalue && (vresult += " (id: " + vvalue + ")");
                } else
                    vresult = vname;

        } else vresult = "[5]-" + vname;
    } catch (e) {
        vresult = "Error: printRecordtemplate" + e;
    }
    return vresult ? vresult : "(empty)"
};



// gs.print("RESULT:\n" + printRecord('incident', 'number=INC34952450',"**Reviewing,table,name,(Updated,sys_updated_on,by,sys_updated_by,Created,sys_created_on,by,sys_created_by,)**,urlinfo,\n\n```,\nCaller:,caller_id,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state,\nIncident State:,incident_state,\n```\n",'',printlogtemplate).join("\n"));

function printRecord(vtable, vencodedquery, vfieldlistinfo, vfieldlisttable, printfunction) {
    var vresult = [],
        vresultinfo = [],
        vresulttable = [];
    var g = gs.getProperty("glide.servlet.uri"),
        d = new GlideRecord(vtable);
    try {
        if (d.isValid()) {
            vfieldlistinfo ? vfieldlistinfo = vfieldlistinfo.split(",") : vfieldlistinfo = [];
            vfieldlisttable ? vfieldlisttable = vfieldlisttable.split(",") : vfieldlisttable = [];

            if (vencodedquery) {
                d.addEncodedQuery(vencodedquery);
                d.setLimit(100);
                d.orderByDesc("sys_created_on");
                vresult.push("^^^^^^^**" + vtable + " Query:** " + g + vtable + "_list.do?sysparm_query=" + escape(d.getEncodedQuery()) + "\n\n");
                d.query();
                if (d.hasNext()) {
                    // print header table
                    if (vfieldlisttable.length > 0) {
                        var vheader = "| " + vfieldlisttable.join(" | ") + " |";
                        vresulttable.push(vheader);
                        vresulttable.push(vheader.replace(new RegExp('[^\|]+', 'g'), '----'));
                    }
                    for (; d.next();) {
                        // vresultinfo
                        if (vfieldlistinfo.length > 0) {
                            var vresultinforow = [];
                            for (q = 0; q < vfieldlistinfo.length; q++) {
                                vresultinforow.push(printfunction(vfieldlistinfo[q], d));
                            }
                            vresultinfo.push(vresultinforow.join(' '));
                        }
                        if (vfieldlisttable.length > 0) {
                            vtable = [];
                            // print rows table
                            for (q = 0; q < vfieldlisttable.length; q++) vtable.push(printfunction(vfieldlisttable[q], d));
                            vresulttable.push("| " + vtable.join(" | ") + " |");
                        }
                    }
                } else vresulttable.push("no results");
                vresulttable.push("\n\n")
            } else vresulttable.push("no query");

            vresult = vresult.concat(vresultinfo).concat(vresulttable);
        } else
            vresult.push("Error: printRecord no a valid table");
    } catch (e) {
        vresult.push("Error: printRecord " + e);
    }
    return vresult;
}

// Get the time in seconds 
// gs.print(getDurationofDates('2017-10-03 11:30:06','2017-10-03 11:30:25'));
function getDurationofDates(date1, date2) {
    var a1 = new GlideDateTime(date2);
    var b1 = new GlideDateTime(date1);
    return (date1 == date2) ? 0 : ((a1.getNumericValue() - b1.getNumericValue()) / 1000);
}

function parseBool(a) {
    return ("boolean" == typeof a ? a : /^(true|1|yes|on)$/i.test(a)) ? "true" : "false"
}
// === PRINT logs