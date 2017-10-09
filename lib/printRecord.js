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

gs.print("RESULT:\n" + printRecord('incident', 'number=INC34952450',"**Reviewing,table,name,(Updated,sys_updated_on,by,sys_updated_by,Created,sys_created_on,by,sys_created_by,)**,urlinfo,\n\n```,\nCaller:,caller_id,\nAssignment Group:,assignment_group,\nAssigned to:,assigned_to,\nWatchlist:,watch_list,\nState:,state,\nIncident State:,incident_state,\n```\n",'',printlogtemplate).join("\n"));
 
function printRecord(vtable, vencodedquery, vfieldlistinfo, vfieldlisttable, printfunction) {
    var vresult = [],
        vresultinfo = [],
        vresulttable = [];
    var g = gs.getProperty("glide.servlet.uri"),
        d = new GlideRecord(vtable);
        
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
        	    vresulttable.push(vheader.replace(new RegExp('[^\|]+','g'),'----'));
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
            vgliderecord.isValidField(vname) ? vresult = vgliderecord.getDisplayValue(vname) : vresult = "[1]-" + vname;
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
            vgliderecord.isValidField(vname) ? vresult = vgliderecord.getValue(vname) : vresult = vname
    } else vresult = "[5]-" + vname;
    return vresult
};

