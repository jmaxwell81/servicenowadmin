// Set the User 'notification' to Enable/Disabled for the matching email addresses
// vemailarray is the array of emails to disable
// setEnable is either "enabled" or "disabled". Disabled is the defaul
// limitquery is the max number of users to set. It has a limitquery of 100
// 
function setUserNotificationbyEmail(vemailarray, setEnable,limitquery) {

    // It will only query the users that need to be enabled or disabled, and ignore the ones already set.
    var c = (setEnable = /^(enable|enabled|true|1|yes|on)$/i.test(setEnable)) ? "notification=1^emailIN" + vemailarray.join(",") : "notification=2^emailIN" + vemailarray.join(","),
        b = new GlideRecord("sys_user");
	limitquery = limitquery ? limitquery : 100;
    b.addEncodedQuery(c);
    b.setLimit(limitquery);
    b.query();
    // create the message to provide back
	c = ['Query Limit set '+ limitquery , 'Records found: '+ b.getRowCount(), 'Query executed: ' + c ];
	// Here the users are being set
    for (; b.next();) c.push((setEnable ? "Enabled " : "Disabled ") + "notification: " + b.sys_id + " - user: " + b.user_name), b.notification = setEnable ? 2 : 1, b.update();
    return c
};
