OBSOLETE

// gs.print('RESULTS:'+findEmailDuplicated('incident','3d81170ddba983002fd876231f961954').join('\n'));

// findEmailDuplicated ==== 
// findEmailDuplicated finds the emails that have same recipients and subject for a given incident
// 
// Example of use:
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
            "\n\n* " + b.getDisplayValue() + "- created " + b.sys_created_on + " by " + b.sys_created_by +
            "\n-- " + vurl + vtable + ".do?sys_id=" + b.sys_id);


        // Find emails duplicated
        var duplicates_found = getDuplicates("sys_email", "subject,recipients", "type=sent^target_table=" + vtable + "^instance=" + vsysid + "^sys_created_onONLast 3 months@javascript:gs.beginningOfLast3Months()@javascript:gs.endOfLast3Months()");

        // gs.print(duplicates_found.join('\n'));

        // Find notification, conditions + event
        var gr2 = new GlideRecord('sys_email_log');
        gr2.addEncodedQuery("sys_created_onONLast 90 days@javascript:gs.beginningOfLast90Days()@javascript:gs.endOfLast90Days()^emailIN" + duplicates_found[1].join(','));
        gr2.setLimit(100);
        for (q = 1, gr2.query(); gr2.next(); q++) {
            vmessage.push(
                "\n\n* Email #" + q + " " + gr2.email.getDisplayValue() + " created " + gr2.email.sys_created_on + " by " + gr2.email.sys_created_by +
                "\n-- " + vurl + "sys_email.do?sys_id=" + gr2.email +

                "\n\n* Trigger Event #" + q + " " + gr2.event.getDisplayValue() + " created " + gr2.event.sys_created_on + " by " + gr2.event.sys_created_by +
                "\n-- " + vurl + "sysevent.do?sys_id=" + gr2.event +

                "\n\n* Email notification #" + q + " " + gr2.notification.getDisplayValue() + "' " + (parseBool(gr2.notification.action_insert) ? "on Insert" : "") + (parseBool(gr2.notification.action_update) ? "on Update" : "") + ", on " + gr2.notification.collection + ", updated " + gr2.notification.sys_updated_on + " by " + gr2.notification.sys_updated_by +
                "\n-- " + vurl + "sysevent_email_action.do?sys_id=" + gr2.notification +
                "\n\nIt reads \n" + gr2.notification.generation_type.getDisplayValue() + " - event name: " + gr2.notification.event_name +
                "\nCondition:" + gr2.notification.condition + " - Advanced condition: " + gr2.notification.advanced_condition +
                "\n")


        }
    } else vmessage.push("ERROR: Provide valid targetable and targesysid");
    return vmessage;
    // Find conditions 

    function parseBool(a) {
        return "boolean" == typeof a ? a : /^(active|ok|true|1|yes|on)$/i.test(a)
    }
}
// findEmailDuplicated ==== 
	


// getDuplicates == 
function getDuplicates(vtable, vfield, vencodedquery) {
    var vresult = [],
        vcount = new GlideAggregate(vtable),
        vurl = gs.getProperty("glide.servlet.uri");
    gr = new GlideRecord(vtable);
    try {
        // Validate the table
        if (gr.isValid()) {
            // Remove invalid fields
            vfield = vfield.split(",");
            vfield = vfield.filter(function(vfield) {
                return gr.isValidField(vfield)
            })

            if (0 <= vfield.length) {
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
                    vresult.push('Error: getDuplicates 2' + e);
                }

            } else result.push('Error: getDuplicates Invalid table: "' + vtable + '"');
        }
    } catch (e) {
        result.push('Error: getDuplicates 1' + e);
    }
    return vresult
};
// getDuplicates == 