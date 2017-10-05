// findSourceRecordFromTarget finds the associated source record if it comes from an import set 
//
//
// Returs: Array of vmessage, listofsysids
// Example of usage:
var result = findSourceRecordFromTarget('incident','21c8a4b4db158300c9e490b6db9619a5','1be5042ddba1c3002fd876231f9619c3');
 gs.print(result[0].join('\n') + '\n\nFound sysids:\n' + result[1].join('\n') );
function findSourceRecordFromTarget(targetable, targesysid, transformationmapsysid) {
    var vmessage = [],
        listofsysids = [],
        vurl = gs.getProperty("glide.servlet.uri");
        
    vmessage.push("findSourceRecordFromTarget ('"+targetable+"','"+targesysid+"','"+ transformationmapsysid +"');\n^^^^^^^ RESULTS ^^^^^^^\n");
    
    // validate and find the target
    if (targetable && targesysid) {
        var b = new GlideRecord(targetable);
        b.get(targesysid)
    } else vmessage.push("ERROR: Provide targetable and targesysid");

    if (b.isValid()) {
		// set the default source table to search
    	var sourcetable = "sys_import_set_row";
		// validate and find the transformation map
        if (transformationmapsysid) {
            var g = new GlideRecord("sys_transform_map");
            g.get(transformationmapsysid);
            g.isValid() && (sourcetable = g.source_table)
        }
        // Find the source record
        gr1 = new GlideRecord(sourcetable);
  		gr1.addEncodedQuery(createEncodedDateRange (b.sys_created_on,b.sys_updated_on,1));  
        gr1.addQuery("sys_target_sys_id", targesysid);
        gr1.addQuery("sys_target_table", targetable);
        gr1.orderByDesc("sys_created_on");
        gr1.setLimit(1E3);
	    vmessage.push("Searching for the matching records on the "+ sourcetable + " table\n-- "+ vurl + sourcetable + '_list.do?sysparm_query=' + escape(gr1.getEncodedQuery()) + "\n\n");
        // Construct the response arrays
        for (r=1,gr1.query(); gr1.next();r++)
            for (listofsysids.push(gr1.sys_id), 
                  vmessage.push("\nFound matching on " + targetable + " table\n* Target: '" + b.getDisplayValue() + "' (Created by " + b.sys_created_by + " " + b.sys_created_on.getDisplayValue() + " - Updated by " + b.sys_created_by + " " + b.sys_updated_on.getDisplayValue() + " )\n-- " + vurl + targetable + ".do?sys_id=" + targesysid + "\n\n* Source: on " + gr1.sys_class_name + " '" + gr1.getDisplayValue() + "' (Created by " + gr1.sys_created_by + " " + gr1.sys_created_on.getDisplayValue() + " - Updated by " + gr1.sys_created_by +
                    " " + gr1.sys_updated_on.getDisplayValue() + " )\n-- " + vurl + gr1.sys_class_name + ".do?sys_id=" + gr1.sys_id + "\n\n* Import set " + gr1.sys_import_set.number + " - Row: " + gr1.sys_import_row + " - State: " + gr1.sys_import_state + " - Comment: " + gr1.sys_import_state_comment + " - Error: " + (gr1.sys_row_error && gr1.sys_row_error.getDisplayValue()) + "\n-- " + vurl + "sys_import_set.do?sys_id=" + gr1.sys_import_set.sys_id + "\n\n\n* Data Source " + gr1.sys_import_set.data_source.name + " (Created by " + gr1.sys_import_set.data_source.sys_created_by +
                    " " + gr1.sys_import_set.data_source.sys_created_on.getDisplayValue() + " - Updated by " + gr1.sys_import_set.data_source.sys_created_by + " " + gr1.sys_import_set.data_source.sys_updated_on.getDisplayValue() + " )\n-- " + vurl + "sys_data_source.do?sys_id=" + gr1.sys_import_set.data_source.sys_id + "\n\n\n* Transformation map " + gr1.sys_transform_map.name + " (Created by " + gr1.sys_transform_map.sys_created_by + " " + gr1.sys_transform_map.sys_created_on.getDisplayValue() + " - Updated by " + gr1.sys_transform_map.sys_created_by +
                    " " + gr1.sys_transform_map.sys_updated_on.getDisplayValue() + " )\n-- " + vurl + "sys_transform_map.do?sys_id=" + gr1.sys_transform_map.sys_id + "\n\n\n* Import set run: " + gr1.import_set_run.state.getDisplayValue() + " - " + gr1.import_set_run.sys_created_on.getDisplayValue() + " to " + gr1.import_set_run.completed.getDisplayValue() + " (total: " + gr1.import_set_run.total + " updates: " + gr1.import_set_run.updates + " ignored: " + gr1.import_set_run.ignored + " inserts: " + gr1.import_set_run.inserts + " errors: " + gr1.import_set_run.errors + ").\n-- " + vurl + "sys_import_set_run.do?sys_id=" + gr1.import_set_run.sys_id + ""), transformationmapsysid = new GlideRecord("import_log"), transformationmapsysid.addQuery("run_history", gr1.import_set_run), transformationmapsysid.setLimit(10), transformationmapsysid.query(); transformationmapsysid.next();) vmessage.push("import_log_list: " +
                transformationmapsysid.level + " - " + transformationmapsysid.message + " - " + transformationmapsysid.source)
    }
    return [vmessage, listofsysids]
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



//
// RESULT
// *********Found matching  on table incident *********
// * INC0010008 (Created by jsadmin 2017-09-16 09:25:56 - Updated by jsadmin 2017-10-01 01:07:10 )
// -- https://empjseymour8.service-now.com/incident.do?sys_id=21c8a4b4db158300c9e490b6db9619a5
// 
// * Source on u_setincident0 (Created by admin 2017-10-01 01:06:55 - Updated by admin 2017-10-01 01:07:10 )
// -- https://empjseymour8.service-now.com/u_setincident.do?sys_id=9a66082ddba1c3002fd876231f9619e4
// 
// * Import set ISET0010114 - Row: 0 - State: updated - Comment:  - Error: 
// -- https://empjseymour8.service-now.com/sys_import_set.do?sys_id=5e66082ddba1c3002fd876231f9619e3
// 
// 
// * Data Source test_1 (Created by admin 2017-10-01 01:04:20 - Updated by admin 2017-10-01 01:04:20 )
// -- https://empjseymour8.service-now.com/sys_data_source.do?sys_id=3775002ddba1c3002fd876231f961916
// 
// 
// * Transformation map _test_setincident (Created by admin 2017-10-01 01:05:29 - Updated by admin 2017-10-01 01:05:29 )
// -- https://empjseymour8.service-now.com/sys_transform_map.do?sys_id=1be5042ddba1c3002fd876231f9619c3
// 
// 
// * Import set run: Complete - 2017-10-01 01:07:10 to 2017-10-01 01:07:10.
// -- https://empjseymour8.service-now.com/sys_import_set_run.do?sys_id=7d76802ddba1c3002fd876231f961968
// import_log_list: 0 - total: 1, inserts 0, updates 1, ignored 0, skipped 0, errors 0 - ImportSetTransformer (_test_setincident)
// import_log_list: 0 - Reference field value for sys_domain created: global - ImportSetTransformer (_test_setincident)
// import_log_list: 0 - Using import set: ISET0010114, table u_setincident - ImportSetTransformer (_test_setincident)
// 
// Found sysids:
// 9a66082ddba1c3002fd876231f9619e4