gs.print(printLogs("sys_created_onONLast 7 days@javascript:gs.beginningOfLast7Days()@javascript:gs.endOfLast7Days()").join('\n'));

function printLogs(vencodedquery) {
    var vmessage = [],
        vurl = gs.getProperty("glide.servlet.uri"),
        // Find the associated syslog 
        gr4 = new GlideRecord('syslog');

    if (vencodedquery) {
        gr4.addEncodedQuery(vencodedquery);
        gr4.addEncodedQuery('level!=0^ORsourceLIKEScript^ORmessageLIKEexception^ORmessageLIKEerror^source!=Cleanup^source!=TableCleaner^messageNOT LIKEBackground Script run by^messageNOT LIKENo subscription marked as auto sync, skipping');
        gr4.setLimit(100);
        gr4.orderByDesc("sys_created_on");
        vmessage.push("^^^^^^^**syslog Query:** " + vurl + 'syslog_list.do?sysparm_query=' + escape(gr4.getEncodedQuery()) + "\n\n");
        gr4.query();
        if (gr4.hasNext()) {
            vmessage.push("syslog messages to validate:\n| Created | Level | Message | Source |\n| ------- |:-----:|:-------:|:------:|")
            for (; gr4.next();) {
                var vtemplate = "| %1 | %2  | %3 | %4 |";
                var vvalues = [gr4.sys_created_on.getDisplayValue(), gr4.level.getDisplayValue(), gr4.message.replace(/\r?\n|\r/g, "").substring(0, 100), "[" + gr4.source + "](" + vurl + "syslog.do?sys_id=" + gr4.sys_id + ")"];
                vmessage.push(formatstring(vtemplate, vvalues));
            }
        }
        vmessage.push('\n\n');
    } else vmessage.push('no query')
    return vmessage;
}

// var myText = 'Hello %1. How are you %2?';
// var values = ['John','today'];
// gs.print(format(myText,values));
function formatstring(str, arr) {
  return str.replace(/%(\d+)/g, function(_,m) {
    return arr[--m];
  });
}