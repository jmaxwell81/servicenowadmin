var duplicates_found1 = getDuplicates("sys_email", "subject,recipients", "type=sent^sys_created_onONLast 7 days@javascript:gs.beginningOfLast7Days()@javascript:gs.endOfLast7Days()");
gs.print("duplicates found: " + duplicates_found1.length + " \n" + duplicates_found1.join("\n"));

function getDuplicates(vtable, vfield, vencodedQuery) {
    var vresult = [],
        vcounttable = new GlideAggregate(vtable);
    var vurl = gs.getProperty("glide.servlet.uri");
    
    vfield = vfield.split(",");
    vcounttable.addEncodedQuery(vencodedQuery);
    vcounttable.addAggregate("COUNT", vfield[0]);
    for (q = 0; q < vfield.length; q++)  vcounttable.groupBy(vfield[q]);
    vcounttable.addHaving("COUNT", ">", 1);
    gs.print("1: " + vcounttable.getEncodedQuery());

    
    for (vcounttable.query(); vcounttable.next();) {
    	gs.print("1: " + vcounttable.getValue(vfield[0]));
        var qr = new GlideRecord(vtable);
        qr.addEncodedQuery(vencodedQuery);
        for (q = 0; q < vfield.length; q++) qr.addQuery(vfield[q], vcounttable.getValue(vfield[q]));
        gs.print ("2: " +qr.getEncodedQuery());
    	vresult.push ( "[Duplicates found: " + vcounttable.getAggregate("COUNT",vfield[0]) +  "](" + vurl + vtable + "_list.do?sysparm_query="+ escape(qr.getEncodedQuery())+"&)");
    }	
    return vresult
};

