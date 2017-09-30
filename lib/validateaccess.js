// Validate user access to the provided table and sys_id
// It uses GlideRecordSecure
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

// Example of use:
//  gs.print("*******Result: "+ validateaccess("sc_req_item", "aeed229047801200e0ef563dbb9a71c2", "abel.tuter"));
//  gs.print("*******Result: "+ validateaccess("sys_user", "62826bf03710200044e0bfc8bcbe5df1", "abel.tuter"));
// 
//  RESULTS:
//  *** Script: *******Result: User abel.tuter has NO access to record on table sc_req_item (sys_id= aeed229047801200e0ef563dbb9a71c2)
//  *** Script: *******Result: User abel.tuter has access to record on table sys_user (Abel Tuter - sys_id= 62826bf03710200044e0bfc8bcbe5df1) - canWrite: true - canRead: true - canCreate: false - canDelete: false
