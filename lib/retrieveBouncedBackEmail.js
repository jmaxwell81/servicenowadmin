   
// Retrieve the list of emails on bounced emails 
// Note: The normal practice here isn't to attempt to parse the bounce message at all.
//
// Returns an array with the list of [0] messages [1] Array of emails bounced
function retrieveBouncedBackEmail(queryToMatch, maxToFindPerEmail, limitquery) {

    return _retrieveBouncedBackEmail(queryToMatch, maxToFindPerEmail, limitquery);

    function _retrieveBouncedBackEmail(queryToMatch, maxToFindPerEmail, limitquery) {
        // Set max emails retrieved from each bounced email parsed - default 10 
        maxToFindPerEmail = maxToFindPerEmail || 10;
        // Limit parsing more than limitquery emails - default 100
        limitquery = limitquery ? limitquery : 100;

        // Set the query that matches the bounced emails - default: "type=received-ignored^sys_created_onONThis week
        queryToMatch = queryToMatch || "type=received-ignored^sys_created_onONThis week@javascript:gs.beginningOfThisWeek()@javascript:gs.endOfThisWeek()";

        // Set the response message and the query to perform
        var vmessages = ["Query limit set " + limitquery, "Searching on sys_email", "Query: " + queryToMatch, "Threshold: " + maxToFindPerEmail],
            b = new GlideRecord("sys_email");
        b.addEncodedQuery(queryToMatch);
        b.setLimit(limitquery);
        b.query();
        vmessages.push(" sys_email records returned: " + b.getRowCount());
        // Loop on the matched emails and assume the body contains the list of emails bounced back
        for (var lemails = []; b.next();) {
            var a = b.body_text,
                // Ignores the text after "Received:" on the body_text as it contains the emails from the original message
                // that you do not want to parse. You want to retrieve only the ones related to the bounced email
                g = a.indexOf("Received:");
            0 < g && (a = a.substr(0, g));

            a = (a = extractEmails(a)) ? uniq(a) : [];

            // It would report on email bound back on which we could not extract an email 
            // so you need to inspected it, to validate why it did not retrieve an email
            0 == a.length && vmessages.push("Email we could not extract an email addresses: " +
                b.sys_id + " - count: " + a.length);

            // If the email contains too many emails, it will add a message
            // so you need to inspected it, to validate why there were so many emails
            a.length > maxToFindPerEmail && vmessages.push("Email ignored by threshold: " + b.sys_id + " - count: " + a.length);
            (0 < a.length && a.length) <= maxToFindPerEmail && (lemails = uniq(lemails.concat(a)))
        }

        // returns an array with the list of arrays: 
        // [0] array of message [1] array of emails
        return [vmessages, lemails]
    };

    // Generate an array of emails found on the text provided
    function extractEmails(text)
    {
        return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    }

    // Sort and remove non-unique strings on the array
    function uniq(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        })
    }
}