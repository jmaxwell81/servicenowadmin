// Supporting libraries to convert times between timezones

var DateTimeUTCconverter = Class.create();  
  
DateTimeUTCconverter.prototype = {  
    initialize: function() {},  
  
    // Returns DateTime used on the timezone set (or UTC if timezone is null)  
    setTime: function(originaldt, vtimezone) {  
        originaldt = originaldt ? new GlideDateTime(originaldt) : new GlideDateTime();  
        vtimezone = vtimezone ? vtimezone : "UTC";  
        originaldt.setTZ(Packages.java.util.TimeZone.getTimeZone(  
            vtimezone));  
        return originaldt;  
    },  
  
    // Convert provided date time and timezone into UTC to validate    
    // Default format is "yyyy-MM-dd HH:mm:ss"    
    // return: GlideDateTime on vtimezone    
    setDisplayTime: function(originaldt, vtimezone) {  
        var a = new GlideDateTime();  
        a.setTZ(Packages.java.util.TimeZone.getTimeZone(vtimezone));  
        a.setDisplayValue(originaldt, "yyyy-MM-dd HH:mm:ss");  
        return a;  
    },  
  
    // Returns the value of the server timezone in text  
    // similar to gs.getSysTimeZone()  
    // return: string.  
    getServerTimezone: function() {  
        return gs.getProperty("glide.sys.default.tz") ||  
            "America/Los_Angeles";  
    },  
  
    // Returns true if the timezone matches the string defined on the   
    // Java runtime. False if it does not matches. If Java do not find it, it returns GMT as getID.  
    // return: true or false  
    isValidTimezone: function(vtimezone) {  
        return Packages.java.util.TimeZone.getTimeZone(vtimezone)  
            .getID() == vtimezone;  
    },  
  
    type: "DateTimeUTCconverter"  
}; 