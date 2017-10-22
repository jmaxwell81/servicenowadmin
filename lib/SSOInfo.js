gs.getSession().setStrictQuery(true);

gs.print(SSOInfo().join('\n'));

// SSOInfo == 
function SSOInfo() {
    var vmessage = [],
        listofsysids = [],
        vurl = gs.getProperty("glide.servlet.uri");


    // Intro        
    vmessage.push("\n|Plugin information | true/false |\n|--|--|\n|Is SAML2Update1 plugin enabled? | "+ gs.getProperty("glide.authenticate.external") +" |\n|Is SAML2Update1 debug enabled?  | "+ gs.getProperty("glide.authenticate.sso.saml2.debug") +" |\n|||\n|Is MultiSSO plugin enabled?| "+ gs.getProperty("glide.authenticate.multisso.enabled") +" |\n|Is MultiSSO debug enabled? | "+ gs.getProperty("glide.authenticate.multisso.debug") +" |\n");
    vmessage.push('\n**Plugins:** Check the relevant plugins are enabled. Multi SSO is recommended\n' + printRecordTable('v_plugin', 'idINcom.snc.integration.sso.multi.installer,com.snc.sso.okta,com.snc.integration.sso.openid,com.snc.integration.sso.saml20.update1,com.snc.integration.sso.saml20', 'id,name,version,active,help', false).join('\n'));
	vmessage.push("\n------------");
    vmessage.push('\n**Properties:** Check the correct properties are set\n' + printRecordTable('sys_properties', 'nameINglide.authenticate.multisso.user.autoprovision,glide.authenticate.multisso.test.connection.mandatory,glide.authenticate.external,glide.authenticate.multisso.enabled,glide.authenticate.multisso.debug,glide.authenticate.multisso.user.autoprovision,glide.authenticate.multisso.login_locate.user_field,glide.authenticate.external,glide.authenticate.sso.saml2.keystore,glide.security.url.whitelist,glide.authenticate.auth.validate.url,glide.authenticate.external.logout_redirect,glide.authenticate.failed_redirect,glide.authenticate.failed_requirement_redirect,glide.authenticate.external.use_redirect_page,glide.authentication.external.disable_local_login,glide.userauthgate.extauth.check,glide.security.handle.ms_special_request,glide.saml2.session_request_id_arr,glide.authenticate.external.side_door_uri,,glide.entry.page.script,glide.entry.page,glide.entry.first.page.script,glide.entry.loggedin.page,glide.entry.loggedin.page_ess,glide.authenticate.sso.saml2.debug,glide.authenticate.sso.saml2.clockskew,glide.authenticate.sso.saml2.keystore,glide.authenticate.sso.redirect.idp,glide.ldap.authentication', 'name,value,sys_updated_by,url',false).join('\n'));
	vmessage.push("\n------------");
    vmessage.push('\n**Content Login Default:** Check the login_page is (empty)\n' + printRecordTable('content_config', 'name=configuration', 'login_page').join('\n'));
    vmessage.push('\n**Content Site:** Check the login_page is (empty)\n' + printRecordTable('content_site', 'active=true', 'login_page').join('\n'));
    vmessage.push('\n**Login Rules:** Check only "Direct Navigation" to "Default UI" is active\n. They need to use [SPEntry page instead](https://docs.servicenow.com/bundle/jakarta-servicenow-platform/page/build/service-portal/concept/c_RedirectToSPAfterLogin.html?)' + printRecordTable('content_page_rule', 'active=true', 'type,active').join('\n'));
	vmessage.push("\n------------");
    vmessage.push('\n**Installation exits:** Check the relevant installation exits are active\n' + printRecordTable('sys_installation_exit', 'active=true', 'active').join('\n'));
    vmessage.push('\n**Script include:** Check the relevant script include are active\n' + printRecordTable('sys_script_include', 'nameSTARTSWITHMultiSSO^ORnameSTARTSWITHSAML2_^active=true', 'active,sys_package').join('\n'));
    vmessage.push('\n**UI Scripts with redirections:** Check if there is an UI script interfering with login\n' + printRecordTable('sys_script_include', 'active=true^scriptLIKEtop.location^ORscriptLIKEwindow.location^ORscriptLIKElocation.href^ORscriptLIKElocation.replace^name!=DownloadLogFromNodes^name!=HelpTheHelpDesk^name!=KBViewArticle^name!=KnowledgeIframeFix^name!=pwd_csrf_common_ui_script^name!=sn_change_cab.cal.snCabMeetingCalendar^name!=sn_change_cab.vcom.go', 'active').join('\n'));
    vmessage.push('\n**Versions Updates:** Check if there is any customisation that could cause problems\n' + printRecordTable('sys_update_version', 'nameSTARTSWITHsys_installation_exit^ORnameSTARTSWITHsys_script_include^state=current^record_nameLIKESAML2^ORrecord_nameLIKEMulti^ORrecord_nameLIKELogin^ORrecord_nameLIKELogout^ORrecord_nameLIKESSO^ORrecord_nameLIKEokta', 'record_name,state,type,source,source_table,url', false).join('\n'));
	vmessage.push("\n------------");
    vmessage.push('\n**Certificates:** Check the certificates are valid [KB0538763](https://hi.service-now.com/kb_view.do?sysparm_article=KB0538763&)\n' + printRecordTable('sys_certificate', 'active=true', 'active,type,format,valid_from,expires').join('\n'));
	vmessage.push("\n------------");
    vmessage.push('\n**Multi SSO info:** Check the URL are valid and common settings setup fine\n' + printRecordTable('saml2_update1_properties', 'active=true', 'displayname,active,is_primary,default,idp,idp_authnrequest_url,idp_logout_url,service_url,idp_authnrequest_url,idp_logout_url,service_url,issuer,audience,external_logout_redirect,failed_requirement_redirect,auto_provision,url', false).join('\n'));
	vmessage.push("\n------------");
    vmessage.push('\n**System Logs:** Check the latest errors. Review [KB0539112](https://hi.service-now.com/kb_view.do?sysparm_article=KB0539112&)\n' + printRecordTable('syslog', 'sys_created_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^sourceSTARTSWITHSAML').join('\n'));

    // Print certificate from the records.
    vmessage.push('\n**System Logs with Certificates:** Check the certificate back\n' + printRecordInfo('syslog', 'sys_created_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^sourceSTARTSWITHSAML^messageLIKE<ds:X509Certificate>^messageLIKE</ds:X509Certificate>').join('\n'));
	vmessage.push("\n------------");
    vmessage.push('\n**Events Logs:** Failure authentications events\n' + printRecordTable('sysevent', 'sys_created_onONToday@javascript:gs.daysAgoStart(0)@javascript:gs.daysAgoEnd(0)^name=external.authentication.failed','sys_created_on,name,parm1,state,duration,url',false).join('\n'));
	vmessage.push("\n------------");
	vmessage.push('\n**Users:** Check for lockout accounts\n' + printRecordTable('sys_user', 'active=false^ORlocked_out=true^sys_updated_onONLast 7 days@javascript:gs.beginningOfLast7Days()@javascript:gs.endOfLast7Days()','displayname,active,locked_out,url',true).join('\n'));
	vmessage.push("\n------------");

    return vmessage;

    // Multi-SSO Info
    // https://empjseymour8.service-now.com/saml2_update1_properties_list.do?sys_id=7cb23f131b121100227e5581be071355&sysparm_record_target=sso_properties&sysparm_record_row=2&sysparm_record_rows=2&sysparm_record_list=ORDERBYname
    // 

}
// SSOInfo ==

// === PRINT logs
function printRecordTable(vtable, vencodedquery, vcolumns, addextra) {
	// addextra default it is true
    (addextra === false) ? ( addextra = false) : addextra = true;

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
        }
        if (addextra) 
            return printRecord(vtable, vencodedquery, "", "displayname,sys_updated_on,sys_updated_by,sys_created_on,sys_created_by," + vcolumns + ",url", printRecordtemplate)
        else
        	return printRecord(vtable, vencodedquery, "", vcolumns, printRecordtemplate);
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
	// addextra default it is true
    (addextra === false) ? ( addextra = false) : addextra = true;

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
                vgliderecord.isValidField(vname) ? vresult = parseBool(vgliderecord.getValue(vname)): vresult = vname;
                break;
            case "sys_updated_on":
            case "sys_created_on":
            case "level":
            case "impact":
            case "urgency":
            case "priority":
            case "sys_domain":
            case "state":
                vgliderecord.isValidField(vname) ? vresult = vgliderecord.getDisplayValue(vname) : vresult = vname;
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