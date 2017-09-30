// Convert provided date time and timezone into UTC to validate  
// Default format is "yyyy-MM-dd HH:mm:ss"  
// return: GlideDateTime on vtimezone  
function setDisplayTime (originaldt, vtimezone) {  
    var a = new GlideDateTime();  
    a.setTZ(Packages.java.util.TimeZone.getTimeZone(vtimezone));  
    a.setDisplayValue(originaldt, "yyyy-MM-dd HH:mm:ss");         
    return a;  
}  

// examples of use
// var vgdt_ist = setDisplayTime ("2017-03-19 20:08:01", "IST");  
// var vgdt_pdt = setDisplayTime ("2017-03-19 07:38:01", "US/Pacific");  
