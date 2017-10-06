//
var duplicates_found1 = getDuplicates("sys_email", "xxx,yyyy,subject,recipients", "type=sent^sys_created_onONLast 7 days@javascript:gs.beginningOfLast7Days()@javascript:gs.endOfLast7Days()");
gs.print("duplicates found: " + duplicates_found1.length + " \n" + duplicates_found1.join("\n"));

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