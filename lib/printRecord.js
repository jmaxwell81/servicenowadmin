// printRecord
// vtable, vencodedquery, vfieldlistinfo, vfieldlisttable, printfunction
//
//
// var  xtable = "syslog",
//   xencoded = "sys_created_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^sys_id=36f6eb88db3d0f00c9e490b6db96198d",
//   xfieldlistinfo = "**Reviewing,table,name,(Created,sys_created_on,by,sys_created_by,)**,urlinfo,\n\n```,\nLevel:,level,\nMessage:,message,\n```\n",
//   xfieldlisttable = "sys_created_on,level,message,url";
//  
//  gs.print("test\n" + printRecord(xtable, xencoded, xfieldlistinfo, xfieldlisttable, printlogtemplate).join("\n"));


gs.getSession().setStrictQuery(true);


gs.print("RESULT:\n" + printRecordTable('incident', 'number=INC34952450').join("\n"));
gs.print("RESULT:\n" + printRecordTable('sysapproval_approver', 'sys_id=92218c4adb214b00c9e490b6db9619e7').join("\n"));
gs.print("RESULT:\n" + printRecordTable('sc_req_item', 'sys_id=a6dceaf0dbad8700c9e490b6db96197c').join("\n"));
gs.print("RESULT:\n" + printRecordTable('change_request', 'sys_id=c286d61347c12200e0ef563dbb9a71df').join("\n"));
gs.print("RESULT:\n" + printRecordTable('sc_request', 'sys_id=56218c4adb214b00c9e490b6db9619fc').join("\n"));
gs.print("RESULT:\n" + printRecordTable('sysevent', 'sys_id=94982385db354b002fd876231f961989').join("\n"));
gs.print("RESULT:\n" + printRecordTable('sys_email', 'sys_id=0538641adb294b00c9e490b6db9619c1').join("\n"));
gs.print("RESULT:\n" + printRecordTable('sysevent_in_email_action', 'sys_id=3ccfeff5c611227a0180144333c87af9').join("\n"));



function printRecordTable(vtable, vencodedquery, vcolumns) {
    vcolumns = vcolumns || "";
    if (!vcolumns) switch (vtable) {
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
        default:
            vcolumns = 'assignment_group,assigned_to,watch_list,state'
    }

    return printRecord(vtable, vencodedquery, "", "name,sys_updated_on,sys_updated_by,sys_created_on,sys_created_by," + vcolumns + ",url", printRecordtemplate)

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

function printRecordInfo(vtable, vencodedquery, vtemplate) {

    if (!vtemplate) switch (vtable) {
        case "incident":
            vtemplate = '```,\nNumber:,number,\nCaller:,caller_id,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state,\nIncident State:,incident_state,\nShort Description,short_description,\n```';
            break;
        case "sysapproval_approver":
            vtemplate = '```\nSys approval:,sysapproval,\nApproving:,document_id,\nApprover:,approver,\nSource table:,source_table,\nState:,state,\n```';
            break;
        case "sc_req_item":
            vtemplate = '```,\nNumber:,number,\nItem:,cat_item,\nRequest:,request,\nOpened by:,opened_by,\nStage:,stage,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state,\nApproval:,approval,\n,variables,\n```';
            break;
        case "change_request":
            vtemplate = '```,\nNumber:,number,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state,\nCategory:,category,\nShort Description,short_description,\n```';
            break;
        case "sc_request":
            vtemplate = '```,\nNumber:,number,\nRequest for:,requested_for,\nOpened by:,opened_by,\nDescription:,description,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state,\n,variables,\n```';
            break;
        case "sysevent":
            vtemplate = '```,\nName:,name,\nState:,state,\nDuration:,duration,seconds\nClaimed:,claimed_by,\nTable,table,\nInstance,instance,\nUser Id:,user_id,\nParm1:,parm1,\nParm2:,parm2,\n```';
            break;
        case "sys_email":
            vtemplate = '```,\nContent type:,content_type,\nType:,type,\nState:,state,\nSubject:,subject,\nMessage Id:,message_id,\nRecipients:,recipient,\nState:,state,\nError:,error_string,\nUser_Id:,user_id,\nDuration:,duration,seconds,\nTarget:,target_table,\nBody_text:,body_text,\n```';
            break;
        case "sysevent_in_email_action":
            vtemplate = '```,\nName:,name,\nTable:,table,\nCondition Script:,condition_script,\nType:,type,\nAction:,action,\nStop processing:,stop_processing,\nTemplate:,template,\nCondition:,filter_condition,\From:,from,\Required roles:,required_roles,\n```';
            break;
        default:
            vtemplate = '```,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state\n```'
    }

    return printRecord(vtable, vencodedquery, "**Reviewing,table,name,(Updated,sys_updated_on,by,sys_updated_by,Created,sys_created_on,by,sys_created_by,)**,urlinfo,\n\n" + vtemplate + "\n", "", printRecordtemplate)
};

function printRecordtemplate(vname, vgliderecord) {
    var vresult = "";
    if (vname && vgliderecord && vgliderecord.isValid()) switch (vname) {
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
                var vdisplay = vgliderecord.getDisplayValue(vname),
                    vvalue = vgliderecord.getValue(vname);
                vdisplay && (vresult = vdisplay);
                (vdisplay && (vdisplay != vvalue)) && (vresult = vdisplay + " (" + vvalue + ")")
            }
            break;
        case "target_table":
            vgliderecord.isValidField(vname) && (vresult = vgliderecord.getValue(vname));
            vgliderecord.isValidField('instance') && (vresult += ":" + vgliderecord.getValue('instance'));
//             vresult = "[" + vresult + "](" + gs.getProperty("glide.servlet.uri") + vgliderecord.getValue(vname) + ".do?sys_id=" + vgliderecord.getValue('instance') + "&)";
            break;
        case "content_type":
            vresult = vgliderecord.getValue(vname).split(";")[0];
            break;
        case "claimed_by":
            vresult = vgliderecord.getValue(vname).split(":").pop();
            break;
        case "url":
            vgliderecord.isValidField("sys_id") ? (vresult = gs.getProperty("glide.servlet.uri"), vresult = "[" + vgliderecord.getValue("sys_id") + "](" + vresult + vgliderecord.getTableName() + ".do?sys_id=" + vgliderecord.getValue("sys_id") + ")") : vresult = "[3]-" + vname;
            break;
        case "name":
            var vdisplay = vgliderecord.getDisplayValue();
            vdisplay ? vresult = vdisplay : (vgliderecord.isValidField("name") ? vresult = vgliderecord.getField("name") : vresult = vgliderecord.getField("sys_id"))
            break;
        case "urlinfo":
            vresult = "\n-- " + gs.getProperty("glide.servlet.uri") + vgliderecord.getTableName() + ".do?sys_id=" + vgliderecord.getValue("sys_id") + "&";
            break;
        case "table":
            vresult = vgliderecord.getTableName();
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
        case "(":
            vresult = " ("
            break;
        case ")":
            vresult = ")"
            break;
        default:
            vgliderecord.isValidField(vname) ? vresult = vgliderecord.getValue(vname) : vresult = vname
    } else vresult = "[5]-" + vname;
    return vresult ? vresult : "(empty)"
};



// gs.print("RESULT:\n" + printRecord('incident', 'number=INC34952450',"**Reviewing,table,name,(Updated,sys_updated_on,by,sys_updated_by,Created,sys_created_on,by,sys_created_by,)**,urlinfo,\n\n```,\nCaller:,caller_id,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state,\nIncident State:,incident_state,\n```\n",'',printlogtemplate).join("\n"));

function printRecord(vtable, vencodedquery, vfieldlistinfo, vfieldlisttable, printfunction) {
    var vresult = [],
        vresultinfo = [],
        vresulttable = [];
    var g = gs.getProperty("glide.servlet.uri"),
        d = new GlideRecord(vtable);
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
        vresult.push("no a valid table");
    return vresult;
}


// https://empjseymour8.service-now.com/nav_to.do?uri=syslog.do?sys_id=9167afccdb79c7002fd876231f9619df
// var gr= new GlideRecord('syslog');
// gr.get('9167afccdb79c7002fd876231f9619df');
// gs.print( printlogtemplate("level",gr));
// 
function printlogtemplate(vname, vgliderecord) {
    var vresult = "";
    if (vname && vgliderecord && vgliderecord.isValid()) switch (vname) {
        case "sys_updated_on":
        case "sys_created_on":
        case "level":
        case "impact":
        case "urgency":
        case "priority":
            vgliderecord.isValidField(vname) ? vresult = vgliderecord.getDisplayValue(vname) : vresult = "[1]-" + vname;
            break;
        case "caller_id":
        case "state":
        case "incident_state":
        case "opened_by":
        case "resolved_by":
        case "delivery_plan":
        case "request":
        case "approver":
        case "document_id":
        case "sysapproval":
        case "group":
        case "wf_activity":
        case "requested_by":
        case "type":
            vgliderecord.isValidField(vname) ? vresult = vgliderecord.getDisplayValue(vname) + " (id: " + vgliderecord.getValue(vname) + ")" : vresult = "[1]-" + vname;
            break;
        case "message":
            vresult = vgliderecord.isValidField(vname) ? (vgliderecord.getValue(vname) + "").replace(/\r?\n\||\r/g, "").substring(0, 100) : "[2]-" + vname;
            break;
        case "url":
            vgliderecord.isValidField("source") ? (vresult = gs.getProperty("glide.servlet.uri"), vresult = "[" + vgliderecord.getValue("source") + "](" + vresult + "syslog.do?sys_id=" + vgliderecord.getValue("sys_id") + ")") : vresult = "[3]-" + vname;
            break;
        case "urlinfo":
            vresult = "\n-- " + gs.getProperty("glide.servlet.uri") + vgliderecord.getTableName() + ".do?sys_id=" + vgliderecord.getValue("sys_id") + "&";
            break;
        case "table":
            vresult = vgliderecord.getTableName();
            break;
        case "(":
            vresult = " ("
            break;
        case ")":
            vresult = ")"
            break;
        default:
            vgliderecord.isValidField(vname) ? vresult = vgliderecord.getValue(vname) + "" : vresult = vname
    } else vresult = "[5]-" + vname;
    return (vresult == "") ? "'" + vresult + "'" : "(empty)"
};


// Get the time in seconds 
// gs.print(getDurationofDates('2017-10-03 11:30:06','2017-10-03 11:30:25'));
function getDurationofDates(date1, date2) {
    var a1 = new GlideDateTime(date2);
    var b1 = new GlideDateTime(date1);
    return (date1 == date2) ? 0 : ((a1.getNumericValue() - b1.getNumericValue()) / 1000);
}