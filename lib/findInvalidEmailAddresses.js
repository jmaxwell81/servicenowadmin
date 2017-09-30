// Search for invalid email addresses (syntax check) on the sys_user form 
// https://community.servicenow.com/community/develop/blog/2016/03/27/example-of-six-steps-to-speed-up-your-email-notifications-by-validating-your-target-emails
//
function findInvalidEmailAddresses(setnotifyoff) {
    var a = [], // holds the message back    
        b = [], // holds the sys_id's for the link    
        f = "emailISNOTEMPTY^active=true^locked_out!=true^notification=2",
        h = 10000, // max results for the query to avoid unlimited queries    
        e = setnotifyoff == !0; // check if want to set notification off on the user    
    a.push("*** Scripts findInvalidEmailAddresses ***");
    a.push("-----Searching for invalid email addresses: ----- setting notification off: " + e + "\nsys_user query: " + f);
    // c is the regex to validate the email is valid. Note this is a guide    
    var c = /^\b[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|tv|biz|info|mobi|name|aero|jobs|museum)\b$/i,
        d = new GlideRecord("sys_user");
    // query for relevant users.    
    d.addEncodedQuery(f);
    d.setLimit(h); // do not query more than 10K records    
    for (d.query(), g = 1; d.next();) {
        d.email && !c.test(d.email) && (b.push(d.sys_id + ""), a.push("User #" + g + " Found: " + d.sys_id + ' - email = "' + d.email + '"')) && g++ && e && (d.notification = 1) && d.update();
    }
    (d.getRowCount() >= h) && a.push("\n**** WARNING results are higher or equal than the limit " + h + " set for the query");
    b.length ? a.push("\n**** Found " + b.length + " possible invalid email(s) of " + d.getRowCount() + " emails checked. Run 'findInvalidEmailAddresses(!0)' to disable them" + "\nTo list them use the following link:\n" + gs.getProperty('glide.servlet.uri') + "sys_user_list.do?sysparm_query=sys_idIN" + b.join(",")) : a.push("\n**** All emails compliant: " + d.getRowCount() + " emails checked.");
    // print the message for the background script    
    gs.print(a.join("\n"))
};
